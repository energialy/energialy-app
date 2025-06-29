const { Router } = require('express');
const verifyJWT = require('../middlewares/verifyJWT');
const {
  handleGetUserNotifications,
  handleMarkAsRead,
  handleMarkAllAsRead,
  handleGetUnreadCount,
} = require('../handlers/notificationsHandler');

const router = Router();

// All notification routes require authentication
router.use(verifyJWT);

// Get user notifications (with pagination and filters)
router.get('/', handleGetUserNotifications);

// Get unread count
router.get('/unread-count', handleGetUnreadCount);

// Mark specific notification as read
router.patch('/:notificationId/read', handleMarkAsRead);

// Mark all notifications as read
router.patch('/mark-all-read', handleMarkAllAsRead);

module.exports = router;
