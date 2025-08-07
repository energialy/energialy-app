const { Router } = require('express');
const {
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription
} = require('../../controllers/subscriptionsController');

const router = Router();

// GET /subscriptions - Get all subscriptions
router.get('/', getAllSubscriptions);

// GET /subscriptions/:id - Get subscription by ID
router.get('/:id', getSubscriptionById);

// POST /subscriptions - Create new subscription
router.post('/', createSubscription);

// PUT /subscriptions/:id - Update subscription
router.put('/:id', updateSubscription);

// DELETE /subscriptions/:id - Delete subscription
router.delete('/:id', deleteSubscription);

module.exports = router;
