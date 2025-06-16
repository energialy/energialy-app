const { Users, Companies } = require('../db');

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const userEmail = req.user; // From JWT middleware
      
      if (!userEmail) {
        return res.status(401).json({ error: 'Unauthorized: No user found' });
      }

      // Get user with company information
      const user = await Users.findOne({
        where: { email: userEmail },
        include: [{ model: Companies }]
      });

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized: User not found' });
      }

      // Super admin and admin have all permissions
      if (user.role === 'superAdmin' || user.role === 'admin') {
        req.userRole = user.role;
        req.userId = user.id;
        req.companyId = user.Company?.id;
        return next();
      }

      // Company owner has all company-related permissions
      if (user.role === 'company_owner') {
        req.userRole = user.role;
        req.userId = user.id;
        req.companyId = user.Company?.id;
        return next();
      }

      // Company collaborator needs specific permission
      if (user.role === 'company_collaborator') {
        if (!user.permissions || !Array.isArray(user.permissions)) {
          return res.status(403).json({ 
            error: 'Forbidden: No permissions assigned',
            required: requiredPermission
          });
        }

        if (!user.permissions.includes(requiredPermission)) {
          return res.status(403).json({ 
            error: 'Forbidden: Insufficient permissions',
            required: requiredPermission,
            userPermissions: user.permissions
          });
        }

        req.userRole = user.role;
        req.userId = user.id;
        req.companyId = user.Company?.id;
        req.userPermissions = user.permissions;
        return next();
      }

      // Bank role - specific handling if needed
      if (user.role === 'bank') {
        req.userRole = user.role;
        req.userId = user.id;
        return next();
      }

      return res.status(403).json({ 
        error: 'Forbidden: Invalid user role',
        userRole: user.role
      });

    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({ error: 'Internal server error during permission check' });
    }
  };
};

const checkCompanyOwnership = async (req, res, next) => {
  try {
    const userEmail = req.user;
    
    const user = await Users.findOne({
      where: { email: userEmail },
      include: [{ model: Companies }]
    });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    // Only company owners can manage collaborators
    if (user.role !== 'company_owner' && user.role !== 'superAdmin' && user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Forbidden: Only company owners can perform this action' 
      });
    }

    req.userRole = user.role;
    req.userId = user.id;
    req.companyId = user.Company?.id;
    
    next();
  } catch (error) {
    console.error('Company ownership check error:', error);
    return res.status(500).json({ error: 'Internal server error during ownership check' });
  }
};

module.exports = {
  checkPermission,
  checkCompanyOwnership
};
