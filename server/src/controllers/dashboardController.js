import Lead from '../models/Lead.js';
import User from '../models/User.js';
import { sendEmail } from '../services/emailService.js';

// Get user's applications
export const getUserApplications = async (req, res) => {
  try {
    const applications = await Lead.find({ email: req.user.email })
      .select('firstName lastName loanPurpose propertyType propertyAddress loanAmount status submittedAt')
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications'
    });
  }
};

// Get specific application details
export const getApplicationDetails = async (req, res) => {
  try {
    const application = await Lead.findOne({
      _id: req.params.id,
      email: req.user.email
    }).populate('assignedTo', 'firstName lastName email phone');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Calculate application progress
    const steps = [
      { id: 'personal_info', title: 'Personal Information', status: 'complete' },
      { id: 'property_details', title: 'Property Details', status: 'complete' },
      { id: 'financial_info', title: 'Financial Information', status: application.annualIncome ? 'complete' : 'current' },
      { id: 'document_upload', title: 'Document Upload', status: 'upcoming' },
      { id: 'review', title: 'Review & Submit', status: 'upcoming' },
      { id: 'approval', title: 'Approval', status: 'upcoming' },
    ];

    // Calculate progress percentage
    const completedSteps = steps.filter(step => step.status === 'complete').length;
    const progress = Math.round((completedSteps / steps.length) * 100);

    // Calculate estimated monthly payment (simplified)
    const monthlyPayment = application.loanAmount ? 
      Math.round((application.loanAmount * 0.0675) / 12) : 0;

    const applicationData = {
      id: application._id,
      status: application.status,
      currentStep: completedSteps,
      steps: steps,
      loanAmount: application.loanAmount || 0,
      interestRate: 6.75, // Mock rate
      monthlyPayment: monthlyPayment,
      loanTerm: 30,
      estimatedClosing: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      lastUpdated: application.updatedAt,
      propertyAddress: application.propertyAddress,
      loanPurpose: application.loanPurpose,
      propertyType: application.propertyType,
      assignedTo: application.assignedTo
    };

    res.json({
      success: true,
      data: applicationData
    });
  } catch (error) {
    console.error('Error fetching application details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching application details'
    });
  }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const application = await Lead.findOneAndUpdate(
      { _id: req.params.id, email: req.user.email },
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating application status'
    });
  }
};

// Upload document
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { applicationId, documentType } = req.body;

    // In a real application, you would save document info to database
    const documentInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      documentType: documentType,
      uploadedAt: new Date(),
      applicationId: applicationId
    };

    res.json({
      success: true,
      message: 'Document uploaded successfully',
      data: documentInfo
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading document'
    });
  }
};

// Get documents for user
export const getDocuments = async (req, res) => {
  try {
    // Mock document data - in real app, fetch from database
    const documents = [
      {
        id: '1',
        name: 'Pay Stubs - January 2024',
        type: 'pay_stubs',
        uploadedAt: new Date('2024-01-15'),
        status: 'approved'
      },
      {
        id: '2',
        name: 'W-2 Form 2023',
        type: 'w2_forms',
        uploadedAt: new Date('2024-01-10'),
        status: 'pending'
      },
      {
        id: '3',
        name: 'Bank Statement - December 2023',
        type: 'bank_statements',
        uploadedAt: new Date('2024-01-05'),
        status: 'approved'
      }
    ];

    res.json({
      success: true,
      data: documents
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching documents'
    });
  }
};

// Delete document
export const deleteDocument = async (req, res) => {
  try {
    // In real app, delete from database and file system
    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting document'
    });
  }
};

// Get loan team
export const getLoanTeam = async (req, res) => {
  try {
    // Mock loan team data - in real app, fetch from database
    const loanTeam = [
      {
        id: '1',
        name: 'Sarah Martinez',
        role: 'Loan Officer',
        phone: '(555) 123-4567',
        email: 'sarah.martinez@mortgage.com',
        avatar: 'SM'
      },
      {
        id: '2',
        name: 'Michael Johnson',
        role: 'Loan Processor',
        phone: '(555) 123-4568',
        email: 'michael.johnson@mortgage.com',
        avatar: 'MJ'
      }
    ];

    res.json({
      success: true,
      data: loanTeam
    });
  } catch (error) {
    console.error('Error fetching loan team:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching loan team'
    });
  }
};

// Send message to loan officer
export const sendMessage = async (req, res) => {
  try {
    const { subject, message, applicationId } = req.body;

    // In real app, save message to database and send email
    await sendEmail({
      to: 'sarah.martinez@mortgage.com',
      subject: `Message from ${req.user.firstName} ${req.user.lastName}: ${subject}`,
      template: 'message-to-lo',
      context: {
        userName: `${req.user.firstName} ${req.user.lastName}`,
        userEmail: req.user.email,
        message: message,
        applicationId: applicationId
      }
    });

    res.json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message'
    });
  }
};

// Schedule a call
export const scheduleCall = async (req, res) => {
  try {
    const { preferredDate, preferredTime, reason, applicationId } = req.body;

    // In real app, save to calendar/database and send confirmation
    await sendEmail({
      to: req.user.email,
      subject: 'Call Scheduled - Mortgage Application',
      template: 'call-scheduled',
      context: {
        userName: req.user.firstName,
        preferredDate: preferredDate,
        preferredTime: preferredTime,
        reason: reason
      }
    });

    res.json({
      success: true,
      message: 'Call scheduled successfully'
    });
  } catch (error) {
    console.error('Error scheduling call:', error);
    res.status(500).json({
      success: false,
      message: 'Error scheduling call'
    });
  }
};

// Download disclosures
export const downloadDisclosures = async (req, res) => {
  try {
    // In real app, generate and serve actual disclosure documents
    res.json({
      success: true,
      message: 'Disclosures downloaded successfully',
      data: {
        url: '/api/documents/disclosures.pdf'
      }
    });
  } catch (error) {
    console.error('Error downloading disclosures:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading disclosures'
    });
  }
};

// Get credit report
export const getCreditReport = async (req, res) => {
  try {
    // In real app, integrate with credit reporting service
    res.json({
      success: true,
      message: 'Credit report retrieved successfully',
      data: {
        score: 750,
        lastUpdated: new Date().toISOString(),
        factors: [
          'Payment history is excellent',
          'Credit utilization is low',
          'Length of credit history is good'
        ]
      }
    });
  } catch (error) {
    console.error('Error getting credit report:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting credit report'
    });
  }
}; 