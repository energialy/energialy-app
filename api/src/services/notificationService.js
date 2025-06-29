const { Resend } = require('resend');
const { Users, Companies, Notifications } = require('../db');
const {
  generateChatMessageNotification,
  generateNewAccountNotification,
  generateTenderPublishedNotification,
  generateProposalReceivedNotification,
  generateProposalAcceptedNotification,
  generateContractAwardedNotification,
  generateTenderCompletedNotification,
  generateTenderCancelledNotification,
  generateBankAccountStatusNotification,
  generateFinanceProductNotification,
  generateAdminNotification,
} = require('./emailTemplates');

class NotificationService {
  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.adminEmail = process.env.ADMIN_EMAIL || 'admin@energialy.ar';
  }

  async createNotification({
    userId,
    title,
    message,
    type,
    relatedId = null,
    relatedType = null,
    priority = 'MEDIUM',
    metadata = null
  }) {
    try {
      const notification = await Notifications.create({
        userId,
        title,
        message,
        type,
        relatedId,
        relatedType,
        priority,
        metadata
      });

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async sendEmail(to, subject, html, sendToAdmin = false) {
    try {
      const recipients = [to];
      if (sendToAdmin && this.adminEmail !== to) {
        recipients.push(this.adminEmail);
      }

      const response = await this.resend.emails.send({
        from: 'Energialy <hola@energialy.ar>',
        to: recipients,
        subject,
        html,
      });

      console.log(`📧 Email sent successfully to: ${recipients.join(', ')}`);
      return response;
    } catch (error) {
      console.error('❌ Error sending email:', error);
      throw error;
    }
  }

  async sendAdminEmail(subject, html) {
    try {
      const response = await this.resend.emails.send({
        from: 'Energialy <hola@energialy.ar>',
        to: this.adminEmail,
        subject: `[ADMIN] ${subject}`,
        html,
      });

      console.log(`📧 Admin email sent successfully`);
      return response;
    } catch (error) {
      console.error('❌ Error sending admin email:', error);
      throw error;
    }
  }

  // Chat message notification
  async notifyChatMessage({ recipientUserId, senderName, senderCompanyName, messagePreview, conversationId }) {
    try {
      const recipient = await Users.findByPk(recipientUserId);
      if (!recipient) throw new Error('Recipient not found');

      // Create in-app notification
      await this.createNotification({
        userId: recipientUserId,
        title: `Nuevo mensaje de ${senderName}`,
        message: `${senderName} de ${senderCompanyName} te ha enviado un mensaje: "${messagePreview}"`,
        type: 'CHAT_MESSAGE',
        relatedId: conversationId,
        relatedType: 'conversation',
        priority: 'HIGH'
      });

      // Send email
      const emailHtml = generateChatMessageNotification(senderName, senderCompanyName, messagePreview);
      await this.sendEmail(recipient.email, `Nuevo mensaje de ${senderName} - Energialy`, emailHtml);

      console.log(`✅ Chat message notification sent to ${recipient.email}`);
    } catch (error) {
      console.error('❌ Error sending chat message notification:', error);
    }
  }

  // New account notification
  async notifyNewAccount({ userId, userName, companyName }) {
    try {
      const user = await Users.findByPk(userId);
      if (!user) throw new Error('User not found');

      // Create in-app notification
      await this.createNotification({
        userId,
        title: '¡Bienvenido a Energialy!',
        message: `Tu cuenta ha sido creada exitosamente. ¡Comienza a explorar todas las funcionalidades!`,
        type: 'NEW_ACCOUNT',
        priority: 'HIGH'
      });

      // Send styled email to user
      const userEmailHtml = generateNewAccountNotification(userName, companyName);
      await this.sendEmail(user.email, '¡Bienvenido a Energialy!', userEmailHtml);

      // Send simple notification to admin
      const adminHtml = generateAdminNotification(
        'Nueva cuenta creada',
        `Se ha registrado una nueva cuenta en la plataforma.`,
        {
          'Usuario': userName,
          'Empresa': companyName,
          'Email': user.email
        }
      );
      await this.sendAdminEmail('Nueva cuenta registrada', adminHtml);

      console.log(`✅ New account notifications sent for ${user.email}`);
    } catch (error) {
      console.error('❌ Error sending new account notification:', error);
    }
  }

  // Tender published notification
  async notifyTenderPublished({ userId, tenderTitle, companyName, tenderAmount, tenderId }) {
    try {
      const user = await Users.findByPk(userId);
      if (!user) throw new Error('User not found');

      // Create in-app notification
      await this.createNotification({
        userId,
        title: 'Licitación publicada exitosamente',
        message: `Tu licitación "${tenderTitle}" ha sido publicada y está disponible para recibir propuestas.`,
        type: 'TENDER_PUBLISHED',
        relatedId: tenderId,
        relatedType: 'tender',
        priority: 'MEDIUM'
      });

      // Send styled email to user
      const userEmailHtml = generateTenderPublishedNotification(tenderTitle, companyName, tenderAmount);
      await this.sendEmail(user.email, 'Licitación publicada - Energialy', userEmailHtml);

      // Send notification to admin
      const adminHtml = generateAdminNotification(
        'Nueva licitación publicada',
        `Se ha publicado una nueva licitación en la plataforma.`,
        {
          'Título': tenderTitle,
          'Empresa': companyName,
          'Presupuesto': tenderAmount,
          'Usuario': `${user.firstName} ${user.lastName}`
        }
      );
      await this.sendAdminEmail('Nueva licitación publicada', adminHtml);

      console.log(`✅ Tender published notifications sent for ${tenderTitle}`);
    } catch (error) {
      console.error('❌ Error sending tender published notification:', error);
    }
  }

  // Proposal received notification
  async notifyProposalReceived({ employerUserId, tenderTitle, supplierCompanyName, proposalAmount, proposalId }) {
    try {
      const employer = await Users.findByPk(employerUserId);
      if (!employer) throw new Error('Employer not found');

      // Create in-app notification
      await this.createNotification({
        userId: employerUserId,
        title: 'Nueva propuesta recibida',
        message: `${supplierCompanyName} ha enviado una propuesta para "${tenderTitle}" por ${proposalAmount}.`,
        type: 'PROPOSAL_RECEIVED',
        relatedId: proposalId,
        relatedType: 'proposal',
        priority: 'HIGH'
      });

      // Send styled email to employer
      const userEmailHtml = generateProposalReceivedNotification(tenderTitle, supplierCompanyName, proposalAmount);
      await this.sendEmail(employer.email, 'Nueva propuesta recibida - Energialy', userEmailHtml);

      // Send notification to admin
      const adminHtml = generateAdminNotification(
        'Nueva propuesta enviada',
        `Se ha enviado una nueva propuesta en la plataforma.`,
        {
          'Licitación': tenderTitle,
          'Proveedor': supplierCompanyName,
          'Monto': proposalAmount,
          'Cliente': `${employer.firstName} ${employer.lastName}`
        }
      );
      await this.sendAdminEmail('Nueva propuesta enviada', adminHtml);

      console.log(`✅ Proposal received notifications sent for ${tenderTitle}`);
    } catch (error) {
      console.error('❌ Error sending proposal received notification:', error);
    }
  }

  // Proposal accepted notification
  async notifyProposalAccepted({ supplierUserId, tenderTitle, employerCompanyName, proposalAmount, proposalId }) {
    try {
      const supplier = await Users.findByPk(supplierUserId);
      if (!supplier) throw new Error('Supplier not found');

      // Create in-app notification
      await this.createNotification({
        userId: supplierUserId,
        title: '¡Propuesta aceptada!',
        message: `Tu propuesta para "${tenderTitle}" ha sido aceptada por ${employerCompanyName}.`,
        type: 'PROPOSAL_ACCEPTED',
        relatedId: proposalId,
        relatedType: 'proposal',
        priority: 'HIGH'
      });

      // Send styled email to supplier
      const userEmailHtml = generateProposalAcceptedNotification(tenderTitle, employerCompanyName, proposalAmount);
      await this.sendEmail(supplier.email, '¡Propuesta aceptada! - Energialy', userEmailHtml);

      // Send notification to admin
      const adminHtml = generateAdminNotification(
        'Propuesta aceptada',
        `Una propuesta ha sido aceptada en la plataforma.`,
        {
          'Licitación': tenderTitle,
          'Cliente': employerCompanyName,
          'Proveedor': `${supplier.firstName} ${supplier.lastName}`,
          'Monto': proposalAmount
        }
      );
      await this.sendAdminEmail('Propuesta aceptada', adminHtml);

      console.log(`✅ Proposal accepted notifications sent for ${tenderTitle}`);
    } catch (error) {
      console.error('❌ Error sending proposal accepted notification:', error);
    }
  }

  // Contract awarded notification
  async notifyContractAwarded({ employerUserId, tenderTitle, supplierCompanyName, contractAmount, contractId }) {
    try {
      const employer = await Users.findByPk(employerUserId);
      if (!employer) throw new Error('Employer not found');

      // Create in-app notification
      await this.createNotification({
        userId: employerUserId,
        title: 'Contrato adjudicado',
        message: `El contrato para "${tenderTitle}" ha sido adjudicado a ${supplierCompanyName}.`,
        type: 'CONTRACT_AWARDED',
        relatedId: contractId,
        relatedType: 'contract',
        priority: 'MEDIUM'
      });

      // Send styled email
      const userEmailHtml = generateContractAwardedNotification(tenderTitle, supplierCompanyName, contractAmount);
      await this.sendEmail(employer.email, 'Contrato adjudicado - Energialy', userEmailHtml);

      // Send notification to admin
      const adminHtml = generateAdminNotification(
        'Contrato adjudicado',
        `Un contrato ha sido adjudicado en la plataforma.`,
        {
          'Proyecto': tenderTitle,
          'Proveedor': supplierCompanyName,
          'Cliente': `${employer.firstName} ${employer.lastName}`,
          'Valor': contractAmount
        }
      );
      await this.sendAdminEmail('Contrato adjudicado', adminHtml);

      console.log(`✅ Contract awarded notifications sent for ${tenderTitle}`);
    } catch (error) {
      console.error('❌ Error sending contract awarded notification:', error);
    }
  }

  // Tender completed notification
  async notifyTenderCompleted({ employerUserId, tenderTitle, supplierCompanyName, tenderId }) {
    try {
      const employer = await Users.findByPk(employerUserId);
      if (!employer) throw new Error('Employer not found');

      // Create in-app notification
      await this.createNotification({
        userId: employerUserId,
        title: 'Proyecto completado',
        message: `El proyecto "${tenderTitle}" ha sido completado por ${supplierCompanyName}.`,
        type: 'TENDER_COMPLETED',
        relatedId: tenderId,
        relatedType: 'tender',
        priority: 'MEDIUM'
      });

      // Send styled email
      const userEmailHtml = generateTenderCompletedNotification(tenderTitle, supplierCompanyName);
      await this.sendEmail(employer.email, 'Proyecto completado - Energialy', userEmailHtml);

      // Send notification to admin
      const adminHtml = generateAdminNotification(
        'Proyecto completado',
        `Un proyecto ha sido completado en la plataforma.`,
        {
          'Proyecto': tenderTitle,
          'Proveedor': supplierCompanyName,
          'Cliente': `${employer.firstName} ${employer.lastName}`
        }
      );
      await this.sendAdminEmail('Proyecto completado', adminHtml);

      console.log(`✅ Tender completed notifications sent for ${tenderTitle}`);
    } catch (error) {
      console.error('❌ Error sending tender completed notification:', error);
    }
  }

  // Tender cancelled notification  
  async notifyTenderCancelled({ affectedUserIds, tenderTitle, reason, tenderId }) {
    try {
      for (const userId of affectedUserIds) {
        const user = await Users.findByPk(userId);
        if (!user) continue;

        // Create in-app notification
        await this.createNotification({
          userId,
          title: 'Licitación cancelada',
          message: `La licitación "${tenderTitle}" ha sido cancelada. ${reason ? `Motivo: ${reason}` : ''}`,
          type: 'TENDER_CANCELLED',
          relatedId: tenderId,
          relatedType: 'tender',
          priority: 'HIGH'
        });

        // Send styled email
        const userEmailHtml = generateTenderCancelledNotification(tenderTitle, reason);
        await this.sendEmail(user.email, 'Licitación cancelada - Energialy', userEmailHtml);
      }

      // Send notification to admin
      const adminHtml = generateAdminNotification(
        'Licitación cancelada',
        `Una licitación ha sido cancelada en la plataforma.`,
        {
          'Licitación': tenderTitle,
          'Motivo': reason || 'No especificado',
          'Usuarios afectados': affectedUserIds.length
        }
      );
      await this.sendAdminEmail('Licitación cancelada', adminHtml);

      console.log(`✅ Tender cancelled notifications sent for ${tenderTitle}`);
    } catch (error) {
      console.error('❌ Error sending tender cancelled notification:', error);
    }
  }

  // Bank account status notification
  async notifyBankAccountStatus({ userId, status, companyName, bankName, reason = null, accountId }) {
    try {
      const user = await Users.findByPk(userId);
      if (!user) throw new Error('User not found');

      const statusText = status === 'approved' ? 'aprobada' : 'rechazada';

      // Create in-app notification
      await this.createNotification({
        userId,
        title: `Solicitud de cuenta ${statusText}`,
        message: `Tu solicitud de apertura de cuenta en ${bankName} ha sido ${statusText}.`,
        type: status === 'approved' ? 'BANK_ACCOUNT_APPROVED' : 'BANK_ACCOUNT_REJECTED',
        relatedId: accountId,
        relatedType: 'bank_account',
        priority: 'HIGH'
      });

      // Send styled email
      const userEmailHtml = generateBankAccountStatusNotification(status, companyName, bankName, reason);
      await this.sendEmail(user.email, `Solicitud de cuenta ${statusText} - Energialy`, userEmailHtml);

      // Send notification to admin
      const adminHtml = generateAdminNotification(
        `Solicitud de cuenta ${statusText}`,
        `Una solicitud de apertura de cuenta ha sido ${statusText}.`,
        {
          'Empresa': companyName,
          'Banco': bankName,
          'Usuario': `${user.firstName} ${user.lastName}`,
          'Estado': statusText,
          'Observaciones': reason || 'Ninguna'
        }
      );
      await this.sendAdminEmail(`Solicitud de cuenta ${statusText}`, adminHtml);

      console.log(`✅ Bank account status notifications sent for ${companyName}`);
    } catch (error) {
      console.error('❌ Error sending bank account status notification:', error);
    }
  }

  // Finance product notification
  async notifyFinanceProduct({ userId, productName, companyName, status, amount = null, reason = null, productId }) {
    try {
      const user = await Users.findByPk(userId);
      if (!user) throw new Error('User not found');

      const statusMap = {
        'requested': 'solicitado',
        'approved': 'aprobado', 
        'rejected': 'rechazado'
      };
      const statusText = statusMap[status] || status;

      // Create in-app notification
      await this.createNotification({
        userId,
        title: `Producto financiero ${statusText}`,
        message: `Tu solicitud de ${productName} ha sido ${statusText}.`,
        type: status === 'approved' ? 'FINANCE_PRODUCT_APPROVED' : 
              status === 'rejected' ? 'FINANCE_PRODUCT_REJECTED' : 'FINANCE_PRODUCT_REQUESTED',
        relatedId: productId,
        relatedType: 'finance_product',
        priority: 'HIGH'
      });

      // Send styled email to user
      const userEmailHtml = generateFinanceProductNotification(productName, companyName, status, amount, reason);
      await this.sendEmail(user.email, `Producto financiero ${statusText} - Energialy`, userEmailHtml);

      // Send notification to admin  
      const adminHtml = generateAdminNotification(
        `Producto financiero ${statusText}`,
        `Una solicitud de producto financiero ha sido ${statusText}.`,
        {
          'Producto': productName,
          'Empresa': companyName,
          'Usuario': `${user.firstName} ${user.lastName}`,
          'Estado': statusText,
          'Monto': amount || 'No especificado',
          'Observaciones': reason || 'Ninguna'
        }
      );
      await this.sendAdminEmail(`Producto financiero ${statusText}`, adminHtml);

      console.log(`✅ Finance product notifications sent for ${productName}`);
    } catch (error) {
      console.error('❌ Error sending finance product notification:', error);
    }
  }

  // Admin-only notifications (simple, no styling)
  async notifyAdminBankAccountRequest({ companyName, userName, userEmail, bankName }) {
    try {
      const adminHtml = generateAdminNotification(
        'Nueva solicitud de apertura de cuenta',
        `Se ha recibido una nueva solicitud de apertura de cuenta bancaria.`,
        {
          'Empresa': companyName,
          'Usuario': userName,
          'Email': userEmail,
          'Banco': bankName
        }
      );
      await this.sendAdminEmail('Nueva solicitud de apertura de cuenta', adminHtml);

      console.log(`✅ Admin bank account request notification sent`);
    } catch (error) {
      console.error('❌ Error sending admin bank account request notification:', error);
    }
  }

  async notifyAdminFinanceProductRequest({ companyName, userName, userEmail, productName, amount }) {
    try {
      const adminHtml = generateAdminNotification(
        'Nueva solicitud de producto financiero',
        `Se ha recibido una nueva solicitud de producto financiero.`,
        {
          'Empresa': companyName,
          'Usuario': userName,
          'Email': userEmail,
          'Producto': productName,
          'Monto': amount || 'No especificado'
        }
      );
      await this.sendAdminEmail('Nueva solicitud de producto financiero', adminHtml);

      console.log(`✅ Admin finance product request notification sent`);
    } catch (error) {
      console.error('❌ Error sending admin finance product request notification:', error);
    }
  }

  // Get user notifications
  async getUserNotifications(userId, page = 1, limit = 20, unreadOnly = false) {
    try {
      const offset = (page - 1) * limit;
      const whereClause = { userId };
      
      if (unreadOnly) {
        whereClause.isRead = false;
      }

      const { count, rows } = await Notifications.findAndCountAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
        limit,
        offset
      });

      return {
        notifications: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
        hasMore: offset + rows.length < count
      };
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notifications.findOne({
        where: { id: notificationId, userId }
      });

      if (!notification) {
        throw new Error('Notification not found');
      }

      await notification.update({ isRead: true });
      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId) {
    try {
      await Notifications.update(
        { isRead: true },
        { where: { userId, isRead: false } }
      );

      console.log(`✅ All notifications marked as read for user ${userId}`);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Get unread count
  async getUnreadCount(userId) {
    try {
      const count = await Notifications.count({
        where: { userId, isRead: false }
      });

      return count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }
}

module.exports = new NotificationService();
