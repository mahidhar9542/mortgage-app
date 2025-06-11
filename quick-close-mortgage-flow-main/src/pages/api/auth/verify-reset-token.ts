import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ valid: false, message: 'Token is required' });
    }

    // Find user by reset token and check if it's not expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(200).json({ 
        valid: false, 
        message: 'Password reset token is invalid or has expired.' 
      });
    }

    // Token is valid
    return res.status(200).json({ 
      valid: true,
      message: 'Token is valid.'
    });
  } catch (error) {
    console.error('Verify reset token error:', error);
    return res.status(500).json({ 
      valid: false, 
      message: 'An error occurred while verifying the token.' 
    });
  }
}
