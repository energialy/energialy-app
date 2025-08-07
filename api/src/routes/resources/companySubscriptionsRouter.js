const { Router } = require('express');
const {
  getAllCompanySubscriptions,
  getCompanySubscriptionById,
  createCompanySubscription,
  updateCompanySubscription,
  deleteCompanySubscription,
  getCompanySubscriptions
} = require('../../controllers/companySubscriptionsController');

const router = Router();

// GET /companySubscriptions - Get all company subscriptions
router.get('/', getAllCompanySubscriptions);

// GET /companySubscriptions/:id - Get company subscription by ID
router.get('/:id', getCompanySubscriptionById);

// POST /companySubscriptions - Create new company subscription
router.post('/', createCompanySubscription);

// PUT /companySubscriptions/:id - Update company subscription
router.put('/:id', updateCompanySubscription);

// DELETE /companySubscriptions/:id - Delete company subscription
router.delete('/:id', deleteCompanySubscription);

// GET /companySubscriptions/company/:companyId - Get subscriptions for a specific company
router.get('/company/:companyId', getCompanySubscriptions);

module.exports = router;
