const {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount,
} = require('../controllers/notificationsController');

const handleGetUserNotifications = async (req, res) => {
  try {
    const userId = req.userId; // From JWT middleware
    const query = req.query;

    const result = await getUserNotifications(userId, query);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error getting user notifications:', error);
    res.status(500).json({ error: error.message });
  }
};

const handleMarkAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.userId; // From JWT middleware

    const result = await markNotificationAsRead(notificationId, userId);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(400).json({ error: error.message });
  }
};

const handleMarkAllAsRead = async (req, res) => {
  try {
    const userId = req.userId; // From JWT middleware

    const result = await markAllNotificationsAsRead(userId);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: error.message });
  }
};

const handleGetUnreadCount = async (req, res) => {
  try {
    const userId = req.userId; // From JWT middleware

    const result = await getUnreadCount(userId);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  handleGetUserNotifications,
  handleMarkAsRead,
  handleMarkAllAsRead,
  handleGetUnreadCount,
};
