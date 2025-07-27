import * as React from 'react';

interface PasswordResetEmailProps {
  resetLink: string;
  firstName?: string;
}

export const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({
  resetLink,
  firstName = 'there',
}) => (
  <div style={{
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    color: '#333',
    lineHeight: '1.6',
  }}>
    <div style={{
      textAlign: 'center',
      marginBottom: '30px',
    }}>
      <h1 style={{
        color: '#4f46e5',
        margin: '0 0 10px',
      }}>Quick Close Mortgage</h1>
      <h2 style={{
        margin: '0',
        fontSize: '24px',
        fontWeight: 'normal',
      }}>Reset Your Password</h2>
    </div>
    
    <p>Hi {firstName},</p>
    <p>
      We received a request to reset your password. Click the button below to set a new password:
    </p>
    
    <div style={{
      textAlign: 'center',
      margin: '30px 0',
    }}>
      <a
        href={resetLink}
        style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#4f46e5',
          color: '#ffffff',
          textDecoration: 'none',
          borderRadius: '6px',
          fontWeight: 'bold',
          fontSize: '16px',
        }}
      >
        Reset Password
      </a>
    </div>
    
    <p>
      If you didn't request this, you can safely ignore this email. This link will expire in 1 hour.
    </p>
    
    <p>
      Best regards,<br />
      The Quick Close Mortgage Team
    </p>
    
    <hr style={{
      border: 'none',
      borderTop: '1px solid #e5e7eb',
      margin: '30px 0',
    }} />
    
    <p style={{
      color: '#6b7280',
      fontSize: '12px',
      lineHeight: '1.5',
    }}>
      If you're having trouble with the button above, copy and paste this link into your browser:<br />
      <a 
        href={resetLink}
        style={{
          color: '#4f46e5',
          wordBreak: 'break-all',
        }}
      >
        {resetLink}
      </a>
    </p>
    
    <p style={{
      color: '#6b7280',
      fontSize: '12px',
      marginTop: '20px',
    }}>
      © {new Date().getFullYear()} Quick Close Mortgage. All rights reserved.
    </p>
  </div>
);

export default PasswordResetEmail;
