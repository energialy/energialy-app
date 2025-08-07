const { CompanySubscriptions, Companies, Subscriptions } = require('../db');

// Get all company subscriptions
const getAllCompanySubscriptions = async (req, res) => {
  try {
    const companySubscriptions = await CompanySubscriptions.findAll({
      include: [
        {
          model: Companies,
          attributes: ['id', 'name', 'email']
        },
        {
          model: Subscriptions,
          attributes: ['id', 'name', 'price', 'currency', 'duration']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(companySubscriptions);
  } catch (error) {
    console.error('Error fetching company subscriptions:', error);
    res.status(500).json({ error: 'Error fetching company subscriptions' });
  }
};

// Get company subscription by ID
const getCompanySubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const companySubscription = await CompanySubscriptions.findByPk(id, {
      include: [
        {
          model: Companies,
          attributes: ['id', 'name', 'email']
        },
        {
          model: Subscriptions,
          attributes: ['id', 'name', 'price', 'currency', 'duration']
        }
      ]
    });
    
    if (!companySubscription) {
      return res.status(404).json({ error: 'Company subscription not found' });
    }
    
    res.status(200).json(companySubscription);
  } catch (error) {
    console.error('Error fetching company subscription:', error);
    res.status(500).json({ error: 'Error fetching company subscription' });
  }
};

// Create new company subscription
const createCompanySubscription = async (req, res) => {
  try {
    const subscriptionData = req.body;
    
    // Validate that company and subscription exist
    const company = await Companies.findByPk(subscriptionData.companyId);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    const subscription = await Subscriptions.findByPk(subscriptionData.subscriptionId);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription plan not found' });
    }
    
    const newCompanySubscription = await CompanySubscriptions.create(subscriptionData);
    res.status(201).json(newCompanySubscription);
  } catch (error) {
    console.error('Error creating company subscription:', error);
    res.status(500).json({ error: 'Error creating company subscription' });
  }
};

// Update company subscription
const updateCompanySubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const [updatedRows] = await CompanySubscriptions.update(updateData, {
      where: { id },
      returning: true
    });
    
    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Company subscription not found' });
    }
    
    const updatedCompanySubscription = await CompanySubscriptions.findByPk(id);
    res.status(200).json(updatedCompanySubscription);
  } catch (error) {
    console.error('Error updating company subscription:', error);
    res.status(500).json({ error: 'Error updating company subscription' });
  }
};

// Delete company subscription
const deleteCompanySubscription = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedRows = await CompanySubscriptions.destroy({
      where: { id }
    });
    
    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Company subscription not found' });
    }
    
    res.status(200).json({ message: 'Company subscription deleted successfully' });
  } catch (error) {
    console.error('Error deleting company subscription:', error);
    res.status(500).json({ error: 'Error deleting company subscription' });
  }
};

// Get subscriptions for a specific company
const getCompanySubscriptions = async (req, res) => {
  try {
    const { companyId } = req.params;
    
    const companySubscriptions = await CompanySubscriptions.findAll({
      where: { companyId },
      include: [
        {
          model: Subscriptions,
          attributes: ['id', 'name', 'price', 'currency', 'duration']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json(companySubscriptions);
  } catch (error) {
    console.error('Error fetching company subscriptions:', error);
    res.status(500).json({ error: 'Error fetching company subscriptions' });
  }
};

module.exports = {
  getAllCompanySubscriptions,
  getCompanySubscriptionById,
  createCompanySubscription,
  updateCompanySubscription,
  deleteCompanySubscription,
  getCompanySubscriptions
};
