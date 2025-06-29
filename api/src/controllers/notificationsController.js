const notificationService = require('../services/notificationService');

const getUserNotifications = async (userId, query = {}) => {
  try {
    const {
      page = 1,
      limit = 20,
      unreadOnly = false
    } = query;

    const result = await notificationService.getUserNotifications(
      userId,
      parseInt(page),
      parseInt(limit),
      unreadOnly === 'true'
    );

    return result;
  } catch (error) {
    throw new Error(`Failed to get notifications: ${error.message}`);
  }
};

const markNotificationAsRead = async (notificationId, userId) => {
  try {
    const notification = await notificationService.markAsRead(notificationId, userId);
    return {
      success: true,
      message: 'Notification marked as read',
      notification
    };
  } catch (error) {
    throw new Error(`Failed to mark notification as read: ${error.message}`);
  }
};

const markAllNotificationsAsRead = async (userId) => {
  try {
    await notificationService.markAllAsRead(userId);
    return {
      success: true,
      message: 'All notifications marked as read'
    };
  } catch (error) {
    throw new Error(`Failed to mark all notifications as read: ${error.message}`);
  }
};

const getUnreadCount = async (userId) => {
  try {
    const count = await notificationService.getUnreadCount(userId);
    return { count };
  } catch (error) {
    throw new Error(`Failed to get unread count: ${error.message}`);
  }
};

// Trigger notifications (these would be called from other controllers)
const triggerChatMessageNotification = async (data) => {
  try {
    await notificationService.notifyChatMessage(data);
    return { success: true, message: 'Chat notification sent' };
  } catch (error) {
    throw new Error(`Failed to send chat notification: ${error.message}`);
  }
};

const triggerNewAccountNotification = async (data) => {
  try {
    await notificationService.notifyNewAccount(data);
    return { success: true, message: 'New account notification sent' };
  } catch (error) {
    throw new Error(`Failed to send new account notification: ${error.message}`);
  }
};

const triggerTenderPublishedNotification = async (data) => {
  try {
    await notificationService.notifyTenderPublished(data);
    return { success: true, message: 'Tender published notification sent' };
  } catch (error) {
    throw new Error(`Failed to send tender published notification: ${error.message}`);
  }
};

const triggerProposalReceivedNotification = async (data) => {
  try {
    await notificationService.notifyProposalReceived(data);
    return { success: true, message: 'Proposal received notification sent' };
  } catch (error) {
    throw new Error(`Failed to send proposal received notification: ${error.message}`);
  }
};

const triggerProposalAcceptedNotification = async (data) => {
  try {
    await notificationService.notifyProposalAccepted(data);
    return { success: true, message: 'Proposal accepted notification sent' };
  } catch (error) {
    throw new Error(`Failed to send proposal accepted notification: ${error.message}`);
  }
};

const triggerContractAwardedNotification = async (data) => {
  try {
    await notificationService.notifyContractAwarded(data);
    return { success: true, message: 'Contract awarded notification sent' };
  } catch (error) {
    throw new Error(`Failed to send contract awarded notification: ${error.message}`);
  }
};

const triggerTenderCompletedNotification = async (data) => {
  try {
    await notificationService.notifyTenderCompleted(data);
    return { success: true, message: 'Tender completed notification sent' };
  } catch (error) {
    throw new Error(`Failed to send tender completed notification: ${error.message}`);
  }
};

const triggerTenderCancelledNotification = async (data) => {
  try {
    await notificationService.notifyTenderCancelled(data);
    return { success: true, message: 'Tender cancelled notification sent' };
  } catch (error) {
    throw new Error(`Failed to send tender cancelled notification: ${error.message}`);
  }
};

const triggerBankAccountStatusNotification = async (data) => {
  try {
    await notificationService.notifyBankAccountStatus(data);
    return { success: true, message: 'Bank account status notification sent' };
  } catch (error) {
    throw new Error(`Failed to send bank account status notification: ${error.message}`);
  }
};

const triggerFinanceProductNotification = async (data) => {
  try {
    await notificationService.notifyFinanceProduct(data);
    return { success: true, message: 'Finance product notification sent' };
  } catch (error) {
    throw new Error(`Failed to send finance product notification: ${error.message}`);
  }
};

module.exports = {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount,
  triggerChatMessageNotification,
  triggerNewAccountNotification,
  triggerTenderPublishedNotification,
  triggerProposalReceivedNotification,
  triggerProposalAcceptedNotification,
  triggerContractAwardedNotification,
  triggerTenderCompletedNotification,
  triggerTenderCancelledNotification,
  triggerBankAccountStatusNotification,
  triggerFinanceProductNotification,
};
