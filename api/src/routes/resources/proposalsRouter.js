const { Router } = require('express');
const {
  getProposalsHandler,
  getProposalByIdHandler,
  createProposalHandler,
  updateProposalHandler,
  deleteProposalHandler
} = require('../../handlers/proposalsHandler');
const verifyJWT = require('../../middlewares/verifyJWT');

const proposalsRouter = Router();

proposalsRouter.get('/', verifyJWT, getProposalsHandler);
proposalsRouter.get('/:id', verifyJWT, getProposalByIdHandler);
proposalsRouter.post('/', verifyJWT, createProposalHandler);
proposalsRouter.put('/:id', verifyJWT, updateProposalHandler);
proposalsRouter.delete('/:id', verifyJWT, deleteProposalHandler);

module.exports = proposalsRouter;