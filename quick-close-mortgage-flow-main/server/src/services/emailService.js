import nodemailer from 'nodemailer';
import path from 'path';
import ejs from 'ejs';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Email template cache
const emailTemplates = {};

/**
 * Load email template
 * @param {string} templateName - Name of the template file (without extension)
 * @returns {Promise<string>} Compiled template
 */
async function loadTemplate(templateName) {
  if (emailTemplates[templateName]) {
    return emailTemplates[templateName];
  }

  const templatePath = path.join(__dirname, `../templates/emails/${templateName}.ejs`);
  try {
    const template = await fs.readFile(templatePath, 'utf-8');
    const compiledTemplate = ejs.compile(template);
    emailTemplates[templateName] = compiledTemplate;
    return compiledTemplate;
  } catch (error) {
    console.error(`Error loading email template ${templateName}:`, error);
    throw new Error(`Failed to load email template: ${templateName}`);
  }
}

/**
 * Create email transporter
 * @returns {Promise<import('nodemailer').Transporter>} Nodemailer transporter
 */
const createTransporter = async () => {
  // In production, use real SMTP credentials
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: process.env.NODE_ENV === 'production' && process.env.NODE_ENV !== 'test',
      },
    });
  }

  // In development, use ethereal.email for testing
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

/**
 * Send email using a template
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.template - Template name (without .ejs)
 * @param {Object} options.data - Template data
 * @param {string} [options.from] - Sender email
 * @param {string} [options.replyTo] - Reply-to email
 * @param {Array<Object>} [options.attachments] - Email attachments
 * @returns {Promise<Object>} Email send result
 */
export const sendEmail = async ({
  to,
  subject,
  template,
  data = {},
  from = process.env.EMAIL_FROM || 'noreply@mortgageapp.com',
  replyTo = process.env.EMAIL_REPLY_TO,
  attachments = []
}) => {
  try {
    const transporter = await createTransporter();
    const templateFn = await loadTemplate(template);
    
    // Add common data to all emails
    const templateData = {
      ...data,
      currentYear: new Date().getFullYear(),
      companyName: process.env.COMPANY_NAME || 'Quick Close Mortgage',
      companyAddress: process.env.COMPANY_ADDRESS || '123 Mortgage St, Anytown, USA',
      companyPhone: process.env.COMPANY_PHONE || '1-800-555-1234',
      companyEmail: process.env.COMPANY_EMAIL || 'info@mortgageapp.com',
      appUrl: process.env.APP_URL || 'https://app.mortgageapp.com',
      adminUrl: process.env.ADMIN_URL || 'https://admin.mortgageapp.com'
    };

    const html = templateFn(templateData);
    
    // Generate text version from HTML
    const text = html
      .replace(/<[^>]*>?/gm, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const mailOptions = {
      from: `"${templateData.companyName}" <${from}>`,
      to,
      subject,
      html,
      text,
      replyTo,
      attachments
    };

    const info = await transporter.sendMail(mailOptions);
    
    // In development, log the preview URL
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Email sent to ${to}: ${nodemailer.getTestMessageUrl(info)}`);
    }
    
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
  } catch (error) {
    console.error(`Error sending email (${template}):`, error);
    throw error;
  }
};

/**
 * Send new lead notification to admin
 * @param {Object} lead - Lead document
 * @returns {Promise<Object>} Email send result
 */
export const sendNewLeadEmail = async (lead) => {
  const leadUrl = `${process.env.ADMIN_URL}/leads/${lead._id}`;
  
  return sendEmail({
    to: process.env.ADMIN_EMAIL || 'admin@example.com',
    subject: `New Lead: ${lead.firstName} ${lead.lastName}`,
    template: 'new-lead-admin',
    data: {
      lead: {
        ...lead.toObject(),
        leadUrl
      },
      subject: `New Lead: ${lead.firstName} ${lead.lastName}`
    }
  });
};

/**
 * Send welcome email to lead
 * @param {Object} lead - Lead document
 * @returns {Promise<Object>} Email send result
 */
export const sendWelcomeEmail = async (lead) => {
  return sendEmail({
    to: lead.email,
    subject: 'Thank You for Your Mortgage Application',
    template: 'welcome-lead',
    data: {
      lead: lead.toObject(),
      subject: 'Thank You for Your Mortgage Application'
    }
  });
};

/**
 * Send application status update email
 * @param {Object} lead - Lead document
 * @param {string} status - New status
 * @param {string} [message] - Additional message
 * @returns {Promise<Object>} Email send result
 */
export const sendStatusUpdateEmail = async (lead, status, message = '') => {
  const statusTemplates = {
    'pre-approved': 'status-pre-approved',
    'approved': 'status-approved',
    'documents-requested': 'status-documents-requested',
    'under-review': 'status-under-review',
    'denied': 'status-denied',
    'closed': 'status-closed'
  };

  const template = statusTemplates[status] || 'status-update';
  
  return sendEmail({
    to: lead.email,
    subject: `Your Mortgage Application: ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    template,
    data: {
      lead: lead.toObject(),
      status,
      message,
      subject: `Your Mortgage Application: ${status.charAt(0).toUpperCase() + status.slice(1)}`
    }
  });
};

/**
 * Send document request email
 * @param {Object} lead - Lead document
 * @param {Array<string>} documents - List of required documents
 * @param {string} [deadline] - Document submission deadline
 * @returns {Promise<Object>} Email send result
 */
export const sendDocumentRequestEmail = async (lead, documents, deadline = '') => {
  const documentList = documents.map(doc => ({
    name: doc,
    isUploaded: lead.documents?.some(d => d.documentType === doc && d.status === 'submitted')
  }));

  return sendEmail({
    to: lead.email,
    subject: 'Action Required: Additional Documents Needed',
    template: 'document-request',
    data: {
      lead: lead.toObject(),
      documents: documentList,
      deadline: deadline || 'as soon as possible',
      uploadUrl: `${process.env.APP_URL}/dashboard/documents`,
      subject: 'Action Required: Additional Documents Needed'
    }
  });
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @param {string} token - Password reset token
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Email send result
 */
export const sendPasswordResetEmail = async (email, token, userId) => {
  const resetUrl = `${process.env.APP_URL}/auth/reset-password?token=${token}&id=${userId}`;
  
  return sendEmail({
    to: email,
    subject: 'Password Reset Request',
    template: 'password-reset',
    data: {
      resetUrl,
      subject: 'Password Reset Request',
      expirationHours: 1 // Token expiration in hours
    }
  });
};

/**
 * Send loan officer assignment notification
 * @param {Object} lead - Lead document
 * @param {Object} loanOfficer - Loan officer user document
 * @returns {Promise<Object>} Email send result
 */
export const sendLoanOfficerAssignmentEmail = async (lead, loanOfficer) => {
  return sendEmail({
    to: loanOfficer.email,
    subject: `New Lead Assigned: ${lead.firstName} ${lead.lastName}`,
    template: 'loan-officer-assignment',
    data: {
      lead: lead.toObject(),
      loanOfficer: {
        firstName: loanOfficer.firstName,
        lastName: loanOfficer.lastName,
        email: loanOfficer.email,
        phone: loanOfficer.phone
      },
      leadUrl: `${process.env.ADMIN_URL}/leads/${lead._id}`,
      subject: `New Lead Assigned: ${lead.firstName} ${lead.lastName}`
    }
  });
};
