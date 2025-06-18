import express from 'express';
import {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  addLeadNote,
  getLeadStats
} from '../controllers/leadController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/', createLead);

// All routes below this middleware will be protected
router.use(protect);

// Routes that require authentication
router.get('/stats', authorize('admin', 'loanOfficer'), getLeadStats);
router.post('/:id/notes', authorize('admin', 'loanOfficer', 'processor'), addLeadNote);

// Admin and loan officer routes
router.use(authorize('admin', 'loanOfficer'));

router.get('/', getLeads);
router.get('/:id', getLead);
router.put('/:id', updateLead);
router.delete('/:id', authorize('admin'), deleteLead);

// Advanced search endpoint
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const searchResults = await Lead.find({
      $or: [
        { 'propertyAddress.street': { $regex: query, $options: 'i' } },
        { 'propertyAddress.city': { $regex: query, $options: 'i' } },
        { 'propertyAddress.state': { $regex: query, $options: 'i' } },
        { 'propertyAddress.zipCode': { $regex: query, $options: 'i' } },
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { phone: { $regex: query.replace(/[^\d]/g, ''), $options: 'i' } },
      ],
    })
      .select('firstName lastName email phone status loanPurpose propertyType')
      .limit(10);

    res.json({
      success: true,
      count: searchResults.length,
      data: searchResults,
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error performing search',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Export leads (CSV)
router.get('/export/csv', authorize('admin'), async (req, res) => {
  try {
    const leads = await Lead.find().lean();
    
    // Convert to CSV
    const headers = [
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Status',
      'Loan Purpose',
      'Property Type',
      'Property Value',
      'Loan Amount',
      'Credit Score',
      'Submitted At'
    ].join(',');
    
    const csvRows = leads.map(lead => {
      return [
        `"${lead.firstName || ''}"`,
        `"${lead.lastName || ''}"`,
        `"${lead.email || ''}"`,
        `"${lead.phone || ''}"`,
        `"${lead.status || ''}"`,
        `"${lead.loanPurpose || ''}"`,
        `"${lead.propertyType || ''}"`,
        `"${lead.propertyValue || ''}"`,
        `"${lead.loanAmount || ''}"`,
        `"${lead.creditScore || ''}"`,
        `"${lead.submittedAt || ''}"`
      ].join(',');
    });
    
    const csvContent = [headers, ...csvRows].join('\n');
    
    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads-export.csv');
    
    res.send(csvContent);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting leads',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

export default router;
