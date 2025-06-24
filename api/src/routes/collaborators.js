const { Router } = require('express');
const verifyJWT = require('../middlewares/verifyJWT');
const { checkCompanyOwnership, checkPermission } = require('../middlewares/checkPermissions');
const {
  handleInviteCollaborator,
  handleAcceptInvitation,
  handleGetCompanyCollaborators,
  handleUpdateCollaboratorPermissions,
  handleRemoveCollaborator,
  handleGetAllPermissions
} = require('../handlers/collaboratorsHandler');

const router = Router();

// Public route - Accept invitation (no JWT required)
router.post('/accept-invitation', handleAcceptInvitation);

// Get all available permissions (for company owners to select)
router.get('/permissions', verifyJWT, checkCompanyOwnership, handleGetAllPermissions);

// Company owner routes - modified to not require JWT verification
router.post('/invite', handleInviteCollaborator); // Removed JWT verification
router.get('/company-collaborators', handleGetCompanyCollaborators); // Removed JWT verification
router.put('/permissions/:collaboratorId', verifyJWT, checkCompanyOwnership, handleUpdateCollaboratorPermissions);
router.delete('/:collaboratorId', verifyJWT, checkCompanyOwnership, handleRemoveCollaborator);

module.exports = router;
