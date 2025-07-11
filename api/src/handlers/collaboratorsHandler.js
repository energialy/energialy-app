const {
  inviteCollaborator,
  acceptInvitation,
  getCompanyCollaborators,
  updateCollaboratorPermissions,
  removeCollaborator,
  getAllPermissions,
  validateInvitation
} = require('../controllers/collaboratorsController');

const handleInviteCollaborator = async (req, res) => {
  try {
    const { email, permissions, firstName, lastName, position, inviterUserId, companyId } = req.body;

    if (!email || !permissions || !inviterUserId || !companyId) {
      return res.status(400).json({ error: 'Email, permissions, inviterUserId, and companyId are required' });
    }

    if (!Array.isArray(permissions) || permissions.length === 0) {
      return res.status(400).json({ error: 'Permissions must be a non-empty array' });
    }

    const result = await inviteCollaborator(
      email,
      permissions,
      firstName,
      lastName,
      position,
      inviterUserId,
      companyId
    );

    res.status(200).json(result);
  } catch (error) {
    console.error('Error inviting collaborator:', error);
    res.status(400).json({ error: error.message });
  }
};

const handleAcceptInvitation = async (req, res) => {
  try {
    const { invitationToken, password } = req.body;

    if (!invitationToken || !password) {
      return res.status(400).json({ error: 'Invitation token and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const result = await acceptInvitation(invitationToken, password);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error accepting invitation:', error);
    res.status(400).json({ error: error.message });
  }
};

const handleGetCompanyCollaborators = async (req, res) => {
  try {
    // Get companyId from query parameters instead of JWT middleware
    const companyId = req.query.companyId;
    
    if (!companyId) {
      return res.status(400).json({ error: 'Company ID is required' });
    }

    const collaborators = await getCompanyCollaborators(companyId);

    res.status(200).json({
      success: true,
      collaborators
    });
  } catch (error) {
    console.error('Error getting collaborators:', error);
    res.status(500).json({ error: error.message });
  }
};

const handleUpdateCollaboratorPermissions = async (req, res) => {
  try {
    const { collaboratorId } = req.params;
    const { permissions } = req.body;
    const companyId = req.companyId;

    if (!permissions || !Array.isArray(permissions)) {
      return res.status(400).json({ error: 'Permissions must be an array' });
    }

    const result = await updateCollaboratorPermissions(collaboratorId, permissions, companyId);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error updating collaborator permissions:', error);
    res.status(400).json({ error: error.message });
  }
};

const handleRemoveCollaborator = async (req, res) => {
  try {
    const { collaboratorId } = req.params;
    const companyId = req.companyId;

    const result = await removeCollaborator(collaboratorId, companyId);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error removing collaborator:', error);
    res.status(400).json({ error: error.message });
  }
};

const handleGetAllPermissions = async (req, res) => {
  try {
    const permissions = await getAllPermissions();

    res.status(200).json({
      success: true,
      permissions
    });
  } catch (error) {
    console.error('Error getting permissions:', error);
    res.status(500).json({ error: error.message });
  }
};

const handleValidateInvitation = async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ error: 'Invitation token is required' });
    }

    const invitation = await validateInvitation(token);

    res.status(200).json({
      success: true,
      invitationData: invitation
    });
  } catch (error) {
    console.error('Error validating invitation:', error);
    if (error.message.includes('not found') || error.message.includes('expired')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = {
  handleInviteCollaborator,
  handleAcceptInvitation,
  handleGetCompanyCollaborators,
  handleUpdateCollaboratorPermissions,
  handleRemoveCollaborator,
  handleGetAllPermissions,
  handleValidateInvitation
};
