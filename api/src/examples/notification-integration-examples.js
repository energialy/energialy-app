// Example of how to integrate notifications into existing controllers
// This shows how to modify the register controller to send welcome notifications

const { Users, Companies } = require('../db');
const bcrypt = require('bcrypt');
const notificationService = require('../services/notificationService');

const newUserRegister = async (body) => {
  const { email, password, firstName, lastName, position, role, companyId } = body;
  
  if (!email || !password) {
    const error = new Error('Email and password are required.');
    error.status = 400;
    throw error;
  }

  const duplicate = await Users.findOne({ where: { email: email } });
  if (duplicate) {
    const error = new Error('Email already registered.');
    error.status = 409;
    throw error;
  }

  const hashedPwd = await bcrypt.hash(password, 10);
  const newUser = await Users.create({
    email,
    hashedPassword: hashedPwd,
    firstName,
    lastName,
    position,
    role,
    CompanyId: companyId
  });

  // Send welcome notification after successful registration
  try {
    const company = await Companies.findByPk(companyId);
    const companyName = company ? company.name : 'Tu empresa';
    
    await notificationService.notifyNewAccount({
      userId: newUser.id,
      userName: `${firstName} ${lastName}`,
      companyName: companyName
    });
  } catch (notificationError) {
    console.error('Error sending welcome notification:', notificationError);
    // Don't fail the registration if notification fails
  }

  return newUser;
};

module.exports = { newUserRegister };

// ===============================================================
// Example: Integrating notifications into Tender controller
// ===============================================================

const { Tenders, Users, Companies } = require('../db');
const notificationService = require('../services/notificationService');

const createTender = async (tenderData, userId) => {
  try {
    // Create the tender
    const newTender = await Tenders.create({
      ...tenderData,
      CompanyId: userId // assuming this maps to the company relationship
    });

    // Get user and company info for notification
    const user = await Users.findByPk(userId, {
      include: [{ model: Companies }]
    });

    if (user && user.Company) {
      // Send tender published notification
      await notificationService.notifyTenderPublished({
        userId: userId,
        tenderTitle: newTender.title,
        companyName: user.Company.name,
        tenderAmount: newTender.budget,
        tenderId: newTender.id
      });
    }

    return newTender;
  } catch (error) {
    throw error;
  }
};

// ===============================================================
// Example: Integrating notifications into Proposal controller
// ===============================================================

const { Proposals, Tenders, Users, Companies } = require('../db');
const notificationService = require('../services/notificationService');

const createProposal = async (proposalData, supplierUserId) => {
  try {
    // Create the proposal
    const newProposal = await Proposals.create({
      ...proposalData,
      CompanyId: supplierUserId // assuming this maps to supplier company
    });

    // Get tender and employer info
    const tender = await Tenders.findByPk(proposalData.TenderId, {
      include: [{ 
        model: Companies,
        include: [{ model: Users, where: { role: 'company_owner' } }]
      }]
    });

    // Get supplier company info
    const supplierUser = await Users.findByPk(supplierUserId, {
      include: [{ model: Companies }]
    });

    if (tender && tender.Company && tender.Company.Users.length > 0 && supplierUser && supplierUser.Company) {
      const employerUser = tender.Company.Users[0]; // Get the company owner
      
      // Send proposal received notification to employer
      await notificationService.notifyProposalReceived({
        employerUserId: employerUser.id,
        tenderTitle: tender.title,
        supplierCompanyName: supplierUser.Company.name,
        proposalAmount: newProposal.amount,
        proposalId: newProposal.id
      });
    }

    return newProposal;
  } catch (error) {
    throw error;
  }
};

const acceptProposal = async (proposalId, employerUserId) => {
  try {
    // Update proposal status
    const proposal = await Proposals.findByPk(proposalId, {
      include: [
        { 
          model: Tenders,
          include: [{ model: Companies }]
        },
        { 
          model: Companies,
          include: [{ model: Users, where: { role: 'company_owner' } }]
        }
      ]
    });

    if (!proposal) {
      throw new Error('Proposal not found');
    }

    await proposal.update({ status: 'accepted' });

    // Get supplier user (proposal owner)
    const supplierUser = proposal.Company.Users[0];
    
    if (supplierUser && proposal.Tender && proposal.Tender.Company) {
      // Send proposal accepted notification to supplier
      await notificationService.notifyProposalAccepted({
        supplierUserId: supplierUser.id,
        tenderTitle: proposal.Tender.title,
        employerCompanyName: proposal.Tender.Company.name,
        proposalAmount: proposal.amount,
        proposalId: proposal.id
      });
    }

    return proposal;
  } catch (error) {
    throw error;
  }
};

// ===============================================================
// Example: Integrating notifications into Message controller
// ===============================================================

const { Messages, Users, Companies } = require('../db');
const notificationService = require('../services/notificationService');

const sendMessage = async (messageData) => {
  try {
    const { senderId, receiverId, content } = messageData;
    
    // Create the message
    const newMessage = await Messages.create({
      senderId,
      receiverId,
      content
    });

    // Get sender info for notification
    const sender = await Users.findByPk(senderId, {
      include: [{ model: Companies }]
    });

    if (sender && sender.Company) {
      // Send chat message notification to receiver
      await notificationService.notifyChatMessage({
        recipientUserId: receiverId,
        senderName: `${sender.firstName} ${sender.lastName}`,
        senderCompanyName: sender.Company.name,
        messagePreview: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
        conversationId: newMessage.id // or conversation ID if you have a conversations table
      });
    }

    return newMessage;
  } catch (error) {
    throw error;
  }
};

// ===============================================================
// Example: Integrating notifications into Bank Account controller
// ===============================================================

const { BankAccounts, Users, Companies } = require('../db');
const notificationService = require('../services/notificationService');

const updateBankAccountStatus = async (accountId, status, reason = null) => {
  try {
    // Update bank account status
    const bankAccount = await BankAccounts.findByPk(accountId, {
      include: [{ 
        model: Companies,
        include: [{ model: Users, where: { role: 'company_owner' } }]
      }]
    });

    if (!bankAccount) {
      throw new Error('Bank account not found');
    }

    await bankAccount.update({ status, statusReason: reason });

    // Send notification to company owner
    if (bankAccount.Company && bankAccount.Company.Users.length > 0) {
      const companyOwner = bankAccount.Company.Users[0];
      
      await notificationService.notifyBankAccountStatus({
        userId: companyOwner.id,
        status: status,
        companyName: bankAccount.Company.name,
        bankName: bankAccount.bankName,
        reason: reason,
        accountId: bankAccount.id
      });
    }

    return bankAccount;
  } catch (error) {
    throw error;
  }
};

// ===============================================================
// HOW TO USE THESE EXAMPLES:
// ===============================================================

/*
1. Copy the relevant parts from these examples into your existing controllers
2. Make sure to import the notificationService at the top of each controller:
   const notificationService = require('../services/notificationService');

3. Add the notification calls after successful operations, wrapped in try-catch 
   so they don't break the main functionality if they fail

4. Adjust the data retrieval queries to match your actual database relationships

5. Test each notification type individually to make sure they work correctly

6. Remember to run the SQL migration to create the notifications table first
*/
