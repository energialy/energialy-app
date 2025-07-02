const { inviteUsersToTender, getTenderInvitations } = require('../controllers/tenderInvitationsController');

const inviteUsersToTenderHandler = async (req, res) => {
  try {
    const { tenderId } = req.params;
    const { invitations } = req.body;
    const inviterUserId = req.user?.id; // Asumiendo que tienes middleware de autenticación

    if (!invitations || !Array.isArray(invitations) || invitations.length === 0) {
      return res.status(400).json({ error: 'Invitations array is required' });
    }

    const result = await inviteUsersToTender(tenderId, invitations, inviterUserId);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const getTenderInvitationsHandler = async (req, res) => {
  try {
    const { tenderId } = req.params;
    const invitations = await getTenderInvitations(tenderId);
    res.status(200).json(invitations);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

module.exports = {
  inviteUsersToTenderHandler,
  getTenderInvitationsHandler
};
