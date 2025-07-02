const { Router } = require('express');
const {
  inviteUsersToTenderHandler,
  getTenderInvitationsHandler
} = require('../handlers/tenderInvitationsHandler');

const tenderInvitationsRouter = Router();

// POST /tenders/:tenderId/invitations - Invitar usuarios a una licitación
tenderInvitationsRouter.post('/:tenderId/invitations', inviteUsersToTenderHandler);

// GET /tenders/:tenderId/invitations - Obtener invitaciones de una licitación
tenderInvitationsRouter.get('/:tenderId/invitations', getTenderInvitationsHandler);

module.exports = tenderInvitationsRouter;
