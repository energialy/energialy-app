const jwt = require('jsonwebtoken');
require('dotenv').config();
const { ACCESS_TOKEN_SECRET } = process.env;

const verifyJWT = (req, res, next) => {
  // First try to get token from Authorization header
  const authHeader = req.headers.authorization || req.headers.Authorization;
  let accessToken = null;

  console.log('verifyJWT - Headers:', { 
    authorization: !!authHeader,
    cookies: Object.keys(req.cookies || {})
  }); // Debug log

  if (authHeader?.startsWith('Bearer ')) {
    accessToken = authHeader.split(' ')[1];
    console.log('verifyJWT - Token from Authorization header');
  } else {
    // If no authorization header, try to get token from cookies
    accessToken = req.cookies?.accessToken;
    console.log('verifyJWT - Token from cookies:', !!accessToken);
  }
  
  if (!accessToken) {
    console.log('verifyJWT - No access token found');
    return res.status(401).json({ error: 'Missing access token' });
  }

  jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error('verifyJWT - Token verification failed:', err.message);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    console.log('verifyJWT - Token verified successfully:', { 
      email: decoded.email, 
      userId: decoded.userId, 
      role: decoded.role,
      companyId: decoded.companyId
    });
    
    req.user = decoded.email;
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.companyId = decoded.companyId;
    next();
  });
};

module.exports = verifyJWT;
