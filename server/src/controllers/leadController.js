import Lead from '../models/Lead.js';
import { sendNewLeadEmail, sendRefinanceLeadEmail } from '../services/emailService.js';

// Helper function to get client IP
const getClientIp = (req) => {
  return req.headers['x-forwarded-for'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null);
};

/**
 * @desc    Create a new lead
 * @route   POST /api/leads
 * @access  Public
 */
export const createLead = async (req, res) => {
  try {
    // Get client IP and user agent
    const ipAddress = getClientIp(req);
    const userAgent = req.headers['user-agent'];

    // Create lead with additional system data
    const leadData = {
      ...req.body,
      source: 'website',
      ipAddress,
      userAgent,
      submittedAt: new Date(),
      status: 'new'
    };

    // Check if lead with this email already exists
    const existingLead = await Lead.findOne({ 
      $or: [
        { email: leadData.email },
        { phone: leadData.phone.replace(/[^\d]/g, '') }
      ]
    });

    if (existingLead) {
      return res.status(400).json({
        success: false,
        message: 'A lead with this email or phone already exists',
        existingLeadId: existingLead._id
      });
    }

    // Create and save new lead
    const lead = new Lead(leadData);
    await lead.save();

    // Send welcome email (async)
    try {
      await sendNewLeadEmail(lead);
    } catch (emailError) {
      console.error('Failed to send new lead email:', emailError);
      // Don't fail the request if email fails
    }

    // Add internal note
    lead.notes.push({
      content: 'Lead created through website form',
      createdBy: 'system',
      isInternal: true
    });
    await lead.save();

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: lead
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get all leads with filtering, sorting, and pagination
 * @route   GET /api/leads
 * @access  Private/Admin
 */
export const getLeads = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Sorting
    const sortBy = req.query.sortBy || 'submittedAt';
    const order = req.query.order === 'asc' ? 1 : -1;
    const sort = { [sortBy]: order };

    // Filtering
    const filter = {};
    const { status, loanPurpose, propertyType, creditScore, startDate, endDate, search } = req.query;

    if (status) filter.status = status;
    if (loanPurpose) filter.loanPurpose = loanPurpose;
    if (propertyType) filter.propertyType = propertyType;
    if (creditScore) filter.creditScore = creditScore;

    // Date range filter
    if (startDate || endDate) {
      filter.submittedAt = {};
      if (startDate) filter.submittedAt.$gte = new Date(startDate);
      if (endDate) filter.submittedAt.$lte = new Date(endDate);
    }

    // Search across multiple fields
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { 'propertyAddress.street': searchRegex },
        { 'propertyAddress.city': searchRegex },
        { 'propertyAddress.state': searchRegex },
        { 'propertyAddress.zipCode': searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { phone: { $regex: search.replace(/[^\d]/g, '') } }
      ];
    }

    // Execute query
    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-__v -metadata'),
      Lead.countDocuments(filter)
    ]);

    // Calculate pagination
    const pages = Math.ceil(total / limit);
    const hasNextPage = page < pages;
    const hasPreviousPage = page > 1;

    res.json({
      success: true,
      count: leads.length,
      total,
      page,
      pages,
      hasNextPage,
      hasPreviousPage,
      data: leads
    });
  } catch (error) {
    console.error('Error getting leads:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get single lead by ID
 * @route   GET /api/leads/:id
 * @access  Private/Admin
 */
export const getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .select('-__v -metadata')
      .populate('assignedTo', 'firstName lastName email');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error('Error getting lead:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid lead ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Update lead
 * @route   PUT /api/leads/:id
 * @access  Private/Admin
 */
export const updateLead = async (req, res) => {
  try {
    // Don't allow updating these fields directly
    const { status, assignedTo, _id, __v, ...updateData } = req.body;
    
    // Handle status updates separately with notes
    if (req.body.status) {
      updateData.status = req.body.status;
      updateData.$push = {
        notes: {
          content: `Status changed to ${req.body.status}`,
          createdBy: req.user?.id || 'system',
          isInternal: true
        }
      };
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.json({
      success: true,
      message: 'Lead updated successfully',
      data: lead
    });
  } catch (error) {
    console.error('Error updating lead:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Delete lead
 * @route   DELETE /api/leads/:id
 * @access  Private/Admin
 */
export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting lead:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid lead ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Add note to lead
 * @route   POST /api/leads/:id/notes
 * @access  Private
 */
export const addLeadNote = async (req, res) => {
  try {
    const { content, isInternal = false } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Note content is required'
      });
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          notes: {
            content,
            isInternal,
            createdBy: req.user?.id || 'system'
          }
        },
        $set: { lastContacted: new Date() }
      },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.json({
      success: true,
      message: 'Note added successfully',
      data: lead.notes[lead.notes.length - 1]
    });
  } catch (error) {
    console.error('Error adding note to lead:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get lead statistics
 * @route   GET /api/leads/stats
 * @access  Private/Admin
 */
export const getLeadStats = async (req, res) => {
  try {
    const stats = await Lead.aggregate([
      {
        $facet: {
          totalLeads: [
            { $count: 'count' }
          ],
          statusCount: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          loanPurposeCount: [
            { $group: { _id: '$loanPurpose', count: { $sum: 1 } } }
          ],
          monthlyApplications: [
            {
              $group: {
                _id: { year: { $year: '$submittedAt' }, month: { $month: '$submittedAt' } },
                count: { $sum: 1 }
              }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 6 }
          ]
        }
      }
    ]);

    // Format the response
    const formattedStats = {
      totalLeads: stats[0].totalLeads[0]?.count || 0,
      statusCount: stats[0].statusCount,
      loanPurposeCount: stats[0].loanPurposeCount,
      monthlyApplications: stats[0].monthlyApplications.map(item => ({
        date: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
        count: item.count
      })).reverse()
    };

    res.json({
      success: true,
      data: formattedStats
    });
  } catch (error) {
    console.error('Error getting lead stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Create a refinance lead with additional refinance-specific data
 * @route   POST /api/leads/refinance
 * @access  Public
 */
export const createRefinanceLead = async (req, res) => {
  try {
    // Get client IP and user agent
    const ipAddress = getClientIp(req);
    const userAgent = req.headers['user-agent'];

    // Validate refinance-specific required fields
    const { 
      currentBalance, 
      currentRate, 
      currentMonthlyPayment, 
      refinanceType,
      estimatedSavings,
      ...otherData 
    } = req.body;

    if (!currentBalance || !currentRate || !refinanceType) {
      return res.status(400).json({
        success: false,
        message: 'Current balance, current rate, and refinance type are required'
      });
    }

    // Create lead with refinance-specific data
    const leadData = {
      ...otherData,
      loanPurpose: 'refinance',
      refinanceData: {
        currentBalance: parseFloat(currentBalance),
        currentRate: parseFloat(currentRate),
        currentMonthlyPayment: parseFloat(currentMonthlyPayment || 0),
        refinanceType,
        estimatedSavings: parseFloat(estimatedSavings || 0),
        refinanceDate: new Date()
      },
      source: 'refinance-page',
      ipAddress,
      userAgent,
      submittedAt: new Date(),
      status: 'new'
    };

    // Check if lead with this email already exists
    const existingLead = await Lead.findOne({ 
      $or: [
        { email: leadData.email },
        { phone: leadData.phone?.replace(/[^\d]/g, '') }
      ]
    });

    if (existingLead) {
      return res.status(400).json({
        success: false,
        message: 'A lead with this email or phone already exists',
        existingLeadId: existingLead._id
      });
    }

    // Create and save new refinance lead
    const lead = new Lead(leadData);
    await lead.save();

    // Send refinance-specific welcome email (async)
    try {
      await sendRefinanceLeadEmail(lead);
    } catch (emailError) {
      console.error('Failed to send refinance lead email:', emailError);
      // Don't fail the request if email fails
    }

    // Add internal note
    lead.notes.push({
      content: `Refinance lead created through refinance page. Type: ${refinanceType}, Current Rate: ${currentRate}%, Estimated Savings: $${estimatedSavings}`,
      createdBy: null,
      isInternal: true
    });
    await lead.save();

    res.status(201).json({
      success: true,
      message: 'Refinance lead created successfully',
      data: lead
    });
  } catch (error) {
    console.error('Error creating refinance lead:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get refinance-specific statistics
 * @route   GET /api/leads/refinance/stats
 * @access  Private/Admin
 */
export const getRefinanceStats = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalRefinances, monthlyRefinances, refinanceTypes, avgSavings] = await Promise.all([
      // Total refinance leads
      Lead.countDocuments({ loanPurpose: 'refinance' }),
      
      // Refinance leads in last 30 days
      Lead.countDocuments({ 
        loanPurpose: 'refinance',
        submittedAt: { $gte: thirtyDaysAgo }
      }),
      
      // Refinance types breakdown
      Lead.aggregate([
        { $match: { loanPurpose: 'refinance' } },
        { $group: { 
          _id: '$refinanceData.refinanceType', 
          count: { $sum: 1 } 
        }},
        { $sort: { count: -1 } }
      ]),
      
      // Average estimated savings
      Lead.aggregate([
        { $match: { 
          loanPurpose: 'refinance',
          'refinanceData.estimatedSavings': { $gt: 0 }
        }},
        { $group: { 
          _id: null, 
          avgSavings: { $avg: '$refinanceData.estimatedSavings' },
          totalSavings: { $sum: '$refinanceData.estimatedSavings' }
        }}
      ])
    ]);

    res.json({
      success: true,
      data: {
        totalRefinances,
        monthlyRefinances,
        refinanceTypes,
        averageSavings: avgSavings[0]?.avgSavings || 0,
        totalSavings: avgSavings[0]?.totalSavings || 0
      }
    });
  } catch (error) {
    console.error('Error getting refinance stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
