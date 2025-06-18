import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
  try {
    // Get token from header or cookie
    let token = req.header('Authorization') || req.cookies.token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied'
      });
    }

    // Remove 'Bearer ' if present
    if (token.startsWith('Bearer ')) {
      token = token.split(' ')[1];
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.VITE_JWT_SECRET || 'your-super-secret-jwt-key');
    
    // Add user from payload
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

const admin = (req, res, next) => {
  // Add admin check logic here if needed
  next();
};

export default protect;
export { admin };
