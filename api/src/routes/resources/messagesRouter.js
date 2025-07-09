const { Router } = require('express');
const { createMessageHandler, getAllMessagesHandler } = require('../../handlers/messageHandler');
const verifyJWT = require('../../middlewares/verifyJWT');
const { checkPermission } = require('../../middlewares/checkPermissions');

const messagesRouter = Router();

// Aplicar JWT verification a todas las rutas de mensajes
messagesRouter.use(verifyJWT);

// Verificar permiso de COMUNICACIONES para ver mensajes
messagesRouter.get('/', checkPermission('COMUNICACIONES'), getAllMessagesHandler);

// Verificar permiso de COMUNICACIONES para enviar mensajes
messagesRouter.post('/', checkPermission('COMUNICACIONES'), createMessageHandler);

module.exports = messagesRouter;
