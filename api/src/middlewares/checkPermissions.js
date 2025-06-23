const { Users, Companies } = require('../db');

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const userEmail = req.user; // From JWT middleware
      const userId = req.userId; // From JWT middleware
      const userRole = req.userRole; // From JWT middleware
      
      console.log('checkPermission - User info:', { userEmail, userId, userRole }); // Debug log
      
      if (!userEmail || !userId) {
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

      console.log('checkPermission - Database user:', { id: user.id, role: user.role, companyId: user.CompanyId }); // Debug log

      // Super admin and admin have all permissions
      if (user.role === 'superAdmin' || user.role === 'admin') {
        req.userRole = user.role;
        req.userId = user.id;
        req.companyId = user.CompanyId;
        return next();
      }

      // Company owner has all company-related permissions
      if (user.role === 'company_owner') {
        req.userRole = user.role;
        req.userId = user.id;
        req.companyId = user.CompanyId;
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
    const userId = req.userId;
    const userRole = req.userRole;
    
    console.log('checkCompanyOwnership - User info from token:', { userEmail, userId, userRole }); // Debug log
    
    if (!userEmail) {
      console.log('checkCompanyOwnership - No user email found');
      return res.status(401).json({ error: 'Unauthorized: No user found' });
    }
    
    const user = await Users.findOne({
      where: { email: userEmail },
      include: [{ model: Companies }]
    });

    if (!user) {
      console.log('checkCompanyOwnership - User not found in database');
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    console.log('checkCompanyOwnership - Database user found:', { 
      id: user.id, 
      role: user.role, 
      companyId: user.CompanyId,
      hasCompany: !!user.Company 
    }); // Debug log

    // Be more permissive - allow company_owner, admin, and superAdmin
    if (!['company_owner', 'admin', 'superAdmin'].includes(user.role)) {
      console.log('checkCompanyOwnership - User role not authorized:', user.role);
      return res.status(403).json({ 
        error: 'Forbidden: Insufficient permissions',
        userRole: user.role,
        allowedRoles: ['company_owner', 'admin', 'superAdmin']
      });
    }

    // Set request properties
    req.userRole = user.role;
    req.userId = user.id;
    req.companyId = user.CompanyId || user.Company?.id;
    
    console.log('checkCompanyOwnership - Authorization successful:', { 
      userId: req.userId, 
      userRole: req.userRole, 
      companyId: req.companyId 
    }); // Debug log
    
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
