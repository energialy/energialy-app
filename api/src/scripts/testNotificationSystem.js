const { Users, Companies } = require('../db');
const notificationService = require('../services/notificationService');

const testNotificationSystem = async () => {
  try {
    console.log('🧪 Testing Notification System...\n');

    // Find a test user and company
    const testUser = await Users.findOne({
      include: [{ model: Companies }]
    });

    if (!testUser) {
      console.log('❌ No test user found. Please create a user first.');
      return;
    }

    console.log(`📋 Using test user: ${testUser.firstName} ${testUser.lastName} (${testUser.email})`);
    console.log(`🏢 Company: ${testUser.Company?.name || 'No company'}\n`);

    // Test 1: New Account Notification
    console.log('🔄 Testing New Account Notification...');
    try {
      await notificationService.notifyNewAccount({
        userId: testUser.id,
        userName: `${testUser.firstName} ${testUser.lastName}`,
        companyName: testUser.Company?.name || 'Test Company'
      });
      console.log('✅ New Account Notification sent successfully\n');
    } catch (error) {
      console.log('❌ New Account Notification failed:', error.message, '\n');
    }

    // Test 2: Chat Message Notification
    console.log('🔄 Testing Chat Message Notification...');
    try {
      await notificationService.notifyChatMessage({
        recipientUserId: testUser.id,
        senderName: 'Test Sender',
        senderCompanyName: 'Test Company',
        messagePreview: 'This is a test message for notification system',
        conversationId: 'test-conversation-id'
      });
      console.log('✅ Chat Message Notification sent successfully\n');
    } catch (error) {
      console.log('❌ Chat Message Notification failed:', error.message, '\n');
    }

    // Test 3: Tender Published Notification
    console.log('🔄 Testing Tender Published Notification...');
    try {
      await notificationService.notifyTenderPublished({
        userId: testUser.id,
        tenderTitle: 'Test Solar Panel Installation',
        companyName: testUser.Company?.name || 'Test Company',
        tenderAmount: 'USD $50,000',
        tenderId: 'test-tender-id'
      });
      console.log('✅ Tender Published Notification sent successfully\n');
    } catch (error) {
      console.log('❌ Tender Published Notification failed:', error.message, '\n');
    }

    // Test 4: Proposal Received Notification
    console.log('🔄 Testing Proposal Received Notification...');
    try {
      await notificationService.notifyProposalReceived({
        employerUserId: testUser.id,
        tenderTitle: 'Test Solar Panel Installation',
        supplierCompanyName: 'Test Supplier Company',
        proposalAmount: 'USD $45,000',
        proposalId: 'test-proposal-id'
      });
      console.log('✅ Proposal Received Notification sent successfully\n');
    } catch (error) {
      console.log('❌ Proposal Received Notification failed:', error.message, '\n');
    }

    // Test 5: Proposal Accepted Notification
    console.log('🔄 Testing Proposal Accepted Notification...');
    try {
      await notificationService.notifyProposalAccepted({
        supplierUserId: testUser.id,
        tenderTitle: 'Test Solar Panel Installation',
        employerCompanyName: 'Test Employer Company',
        proposalAmount: 'USD $45,000',
        proposalId: 'test-proposal-id'
      });
      console.log('✅ Proposal Accepted Notification sent successfully\n');
    } catch (error) {
      console.log('❌ Proposal Accepted Notification failed:', error.message, '\n');
    }

    // Test 6: Bank Account Status Notification
    console.log('🔄 Testing Bank Account Status Notification...');
    try {
      await notificationService.notifyBankAccountStatus({
        userId: testUser.id,
        status: 'approved',
        companyName: testUser.Company?.name || 'Test Company',
        bankName: 'Banco de Comercio',
        reason: 'All documentation approved',
        accountId: 'test-account-id'
      });
      console.log('✅ Bank Account Status Notification sent successfully\n');
    } catch (error) {
      console.log('❌ Bank Account Status Notification failed:', error.message, '\n');
    }

    // Test 7: Finance Product Notification
    console.log('🔄 Testing Finance Product Notification...');
    try {
      await notificationService.notifyFinanceProduct({
        userId: testUser.id,
        productName: 'Línea de Crédito Empresarial',
        companyName: testUser.Company?.name || 'Test Company',
        status: 'approved',
        amount: 'USD $100,000',
        reason: 'Excellent credit score',
        productId: 'test-product-id'
      });
      console.log('✅ Finance Product Notification sent successfully\n');
    } catch (error) {
      console.log('❌ Finance Product Notification failed:', error.message, '\n');
    }

    // Test 8: Get User Notifications
    console.log('🔄 Testing Get User Notifications...');
    try {
      const notifications = await notificationService.getUserNotifications(testUser.id, 1, 10);
      console.log(`✅ Retrieved ${notifications.notifications.length} notifications for user`);
      console.log(`📊 Total notifications: ${notifications.total}`);
      console.log(`📄 Total pages: ${notifications.totalPages}\n`);

      // Show first few notifications
      if (notifications.notifications.length > 0) {
        console.log('📋 Recent notifications:');
        notifications.notifications.slice(0, 3).forEach((notif, index) => {
          console.log(`   ${index + 1}. ${notif.title} - ${notif.isRead ? '✅ Read' : '📧 Unread'}`);
        });
        console.log('');
      }
    } catch (error) {
      console.log('❌ Get User Notifications failed:', error.message, '\n');
    }

    // Test 9: Get Unread Count
    console.log('🔄 Testing Get Unread Count...');
    try {
      const unreadCount = await notificationService.getUnreadCount(testUser.id);
      console.log(`✅ Unread notifications count: ${unreadCount}\n`);
    } catch (error) {
      console.log('❌ Get Unread Count failed:', error.message, '\n');
    }

    // Test 10: Mark notifications as read
    console.log('🔄 Testing Mark All As Read...');
    try {
      await notificationService.markAllAsRead(testUser.id);
      console.log('✅ All notifications marked as read\n');
      
      // Verify unread count is now 0
      const newUnreadCount = await notificationService.getUnreadCount(testUser.id);
      console.log(`📊 New unread count: ${newUnreadCount}\n`);
    } catch (error) {
      console.log('❌ Mark All As Read failed:', error.message, '\n');
    }

    console.log('🎉 Notification system testing completed!');
    console.log('📧 Check your email for the test notifications.');
    console.log('📊 Check the database notifications table for stored notifications.');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  } finally {
    process.exit(0);
  }
};

// Run the test
testNotificationSystem();
