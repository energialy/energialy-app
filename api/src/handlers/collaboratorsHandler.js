const {
  inviteCollaborator,
  acceptInvitation,
  getCompanyCollaborators,
  updateCollaboratorPermissions,
  removeCollaborator,
  getAllPermissions
} = require('../controllers/collaboratorsController');

const handleInviteCollaborator = async (req, res) => {
  try {
    const { email, permissions, firstName, lastName, position } = req.body;
    const inviterUserId = req.userId;
    const companyId = req.companyId;

    if (!email || !permissions) {
      return res.status(400).json({ error: 'Email and permissions are required' });
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
    const companyId = req.companyId;

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

module.exports = {
  handleInviteCollaborator,
  handleAcceptInvitation,
  handleGetCompanyCollaborators,
  handleUpdateCollaboratorPermissions,
  handleRemoveCollaborator,
  handleGetAllPermissions
};
