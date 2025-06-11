import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import { PasswordResetEmail } from '@/components/emails/PasswordResetEmail';
import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Create a test account for development
// In production, use environment variables for SMTP configuration
const createTransporter = async () => {
  // Use ethereal.email for testing in development
  if (process.env.NODE_ENV !== 'production') {
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
  }

  // In production, use your SMTP server
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    throw new Error('SMTP configuration is missing');
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Helper function to strip HTML tags for plain text email
const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>?/gm, '');
};

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
}: SendEmailParams): Promise<nodemailer.SentMessageInfo> => {
  try {
    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: `"Quick Close Mortgage" <${process.env.EMAIL_FROM || 'noreply@quickclosemortgage.com'}>`,
      to,
      subject,
      text: text || stripHtml(html),
      html,
    });

    // Log the preview URL in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

export const sendPasswordResetEmail = async (
  email: string, 
  resetLink: string, 
  firstName?: string
): Promise<nodemailer.SentMessageInfo> => {
  try {
    const emailComponent = React.createElement(PasswordResetEmail, { resetLink, firstName });
    const emailHtml = render(emailComponent);

    return await sendEmail({
      to: email,
      subject: 'Reset Your Password',
      html: emailHtml,
    });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};
