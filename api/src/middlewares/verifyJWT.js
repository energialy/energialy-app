const jwt = require('jsonwebtoken');
require('dotenv').config();
const { ACCESS_TOKEN_SECRET } = process.env;

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  
  console.log('verifyJWT - Auth header:', authHeader ? 'Present' : 'Missing');

  if (!authHeader?.startsWith('Bearer ')) {
    console.log('verifyJWT - No Bearer token found');
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const accessToken = authHeader.split(' ')[1];
  
  if (!accessToken) {
    console.log('verifyJWT - No token after Bearer');
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
