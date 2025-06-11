import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email';
import { getBaseUrl } from '@/lib/utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    // Don't reveal if user doesn't exist (for security)
    if (!user) {
      return res.status(200).json({ 
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Save token and expiry to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(resetTokenExpiry);
    await user.save();

    // Send email with reset link
    const baseUrl = getBaseUrl();
    const resetUrl = `${baseUrl}/auth/reset-password?token=${resetToken}`;
    
    try {
      await sendPasswordResetEmail(user.email, resetUrl);
      
      return res.status(200).json({ 
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link.'
      });
    } catch (emailError) {
      console.error('Error sending password reset email:', emailError);
      return res.status(500).json({ 
        success: false, 
        message: 'Error sending password reset email. Please try again later.' 
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while processing your request.' 
    });
  }
}
