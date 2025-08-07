const { Subscriptions } = require('../db');

// Get all subscriptions
const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscriptions.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Error fetching subscriptions' });
  }
};

// Get subscription by ID
const getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscriptions.findByPk(id);
    
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    res.status(200).json(subscription);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: 'Error fetching subscription' });
  }
};

// Create new subscription
const createSubscription = async (req, res) => {
  try {
    const subscriptionData = req.body;
    const newSubscription = await Subscriptions.create(subscriptionData);
    res.status(201).json(newSubscription);
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Error creating subscription' });
  }
};

// Update subscription
const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const [updatedRows] = await Subscriptions.update(updateData, {
      where: { id },
      returning: true
    });
    
    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    const updatedSubscription = await Subscriptions.findByPk(id);
    res.status(200).json(updatedSubscription);
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: 'Error updating subscription' });
  }
};

// Delete subscription
const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedRows = await Subscriptions.destroy({
      where: { id }
    });
    
    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    res.status(200).json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    console.error('Error deleting subscription:', error);
    res.status(500).json({ error: 'Error deleting subscription' });
  }
};

module.exports = {
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription
};
