const { Resend } = require('resend');
const {
  generateEmployerEmailProposalReceived,
  generateSupplierEmailProposalAccepted,
  generateSupplierEmailProposalDeclined,
  generateBankEmailNewBankAccount,
  generateBankEmailNewFinanceProduct,
  generateCompanyEmailBankAccountOpen,
  generateCompanyEmailBankAccountRequireChanges,
  generateCompanyEmailFinanceProductAccepted,
  generateCompanyEmailFinanceProductDeclined,
  generateSendInviteCompanies,
  generatePasswordResetRequestEmail,
  generatePasswordResetSuccessfullyEmail,
  generateCollaboratorInvitationEmail,
} = require('./emailTemplates');

const sendEmployerEmailProposalReceived = async (receiver, employerName, supplierCompanyName, tenderTitle, proposalAmount, proposalDuration) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const response = await resend.emails.send({
    from: 'Energialy <hola@energialy.ar>',
    to: [`${receiver}`],
    subject: 'Nueva Propuesta Recibida en Energialy',
    html: generateEmployerEmailProposalReceived(employerName, supplierCompanyName, tenderTitle, proposalAmount, proposalDuration),
  });
  console.log(response);
};

const sendSupplierEmailProposalAccepted = async (receiver, supplierName, employerCompanyName, tenderTitle) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const response = await resend.emails.send({
    from: 'Energialy <hola@energialy.ar>',
    to: [`${receiver}`],
    subject: 'Felicitaciones! Tu Propuesta fue Aceptada!',
    html: generateSupplierEmailProposalAccepted(supplierName, employerCompanyName, tenderTitle),
  });
  console.log(response);
};

const sendSupplierEmailProposalDeclined = async (receiver, supplierName, employerCompanyName, tenderTitle) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const response = await resend.emails.send({
    from: 'Energialy <hola@energialy.ar>',
    to: [`${receiver}`],
    subject: 'Propuesta cancelada',
    html: generateSupplierEmailProposalDeclined(supplierName, employerCompanyName, tenderTitle),
  });
  console.log(response);
};

const sendBankEmailNewBankAccount = async (receiver, companyName) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const response = await resend.emails.send({
    from: 'Energialy <hola@energialy.ar>',
    to: [`${receiver}`],
    subject: 'Recibiste una nueva Solicitud de Apertura de cuenta',
    html: generateBankEmailNewBankAccount(companyName),
  });
  console.log(response);
};

const sendBankEmailNewFinanceProduct = async (receiver, companyName) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const response = await resend.emails.send({
    from: 'Energialy <hola@energialy.ar>',
    to: [`${receiver}`],
    subject: 'Recibiste una nueva Solicitud de Producto Financiero',
    html: generateBankEmailNewFinanceProduct(companyName),
  });
  console.log(response);
};

const sendCompanyEmailBankAccountOpen = async (receiver, companyOwnerName, companyName) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const response = await resend.emails.send({
    from: 'Energialy <hola@energialy.ar>',
    to: [`${receiver}`],
    subject: 'Apertura de Cuenta confirmada!',
    html: generateCompanyEmailBankAccountOpen(companyOwnerName, companyName),
  });
  console.log(response);
};

const sendCompanyEmailBankAccountRequireChanges = async (receiver, companyOwnerName, companyName) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const response = await resend.emails.send({
    from: 'Energialy <hola@energialy.ar>',
    to: [`${receiver}`],
    subject: 'Tenés una notificación en tu solicitud de Apertura de Cuenta',
    html: generateCompanyEmailBankAccountRequireChanges(companyOwnerName, companyName),
  });
  console.log(response);
};

const sendCompanyEmailFinanceProductAccepted = async (receiver, companyOwnerName, companyName) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const response = await resend.emails.send({
    from: 'Energialy <hola@energialy.ar>',
    to: [`${receiver}`],
    subject: 'La solicitud de Producto Financiero fue aprobada!',
    html: generateCompanyEmailFinanceProductAccepted(companyOwnerName, companyName),
  });
  console.log(response);
};

const sendCompanyEmailFinanceProductDeclined = async (receiver, companyOwnerName, companyName) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const response = await resend.emails.send({
    from: 'Energialy <hola@energialy.ar>',
    to: [`${receiver}`],
    subject: 'Tu solicitud de Producto Financiero fue rechazada',
    html: generateCompanyEmailFinanceProductDeclined(companyOwnerName, companyName),
  });
  console.log(response);
};

const sendInviteCompanies = async (receiver, companyName) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const response = await resend.emails.send({
    from: 'Energialy <hola@energialy.ar>',
    to: [`${receiver}`],
    subject: '¡Te invitaron a unirte a Energialy!',
    html: generateSendInviteCompanies(companyName),
  });
  console.log(response);
};

const sendPasswordResetRequestEmail = async (receiver, username, link) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const response = await resend.emails.send({
    from: 'Energialy <hola@energialy.ar>',
    to: [`${receiver}`],
    subject: 'Restablece tu contraseña de Energialy',
    html: generatePasswordResetRequestEmail(username, link),
  });
  console.log(response);
};

const sendPasswordResetSuccessfullyEmail = async (receiver, username) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const response = await resend.emails.send({
    from: 'Energialy <hola@energialy.ar>',
    to: [`${receiver}`],
    subject: 'Contraseña restablecida correctamente',
    html: generatePasswordResetSuccessfullyEmail(username),
  });
  console.log(response);
};

const sendCollaboratorInvitationEmail = async (receiver, collaboratorName, companyName, inviterName, invitationToken, frontendUrl) => {
  try {
    console.log('📧 Preparing to send invitation email...');
    console.log('📧 Receiver:', receiver);
    console.log('📧 Collaborator name:', collaboratorName);
    console.log('📧 Company name:', companyName);
    console.log('📧 Inviter name:', inviterName);
    console.log('📧 Invitation token:', invitationToken);
    console.log('📧 RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    console.log('📧 FRONTEND_URL:', frontendUrl);

    const resend = new Resend(process.env.RESEND_API_KEY);
    const invitationLink = `${frontendUrl}/accept-invitation?token=${invitationToken}`;
    
    console.log('📧 Invitation link:', invitationLink);

    // In development, check if email is using a test domain and skip sending
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const isTestEmail = receiver.includes('example.com') || receiver.includes('test.com');
    
    if (isDevelopment && isTestEmail) {
      console.log('⚠️ Development mode: Skipping email send for test email');
      console.log('📧 Email would be sent to:', receiver);
      console.log('📧 With link:', invitationLink);
      return { 
        statusCode: 200, 
        message: 'Email skipped in development mode for test email',
        id: 'dev-mode-skip'
      };
    }

    const response = await resend.emails.send({
      from: 'Energialy <hola@energialy.ar>',
      to: receiver,
      subject: `Invitación para colaborar en ${companyName} - Energialy`,
      html: generateCollaboratorInvitationEmail(collaboratorName, companyName, inviterName, invitationLink),
    });
    
    console.log('✅ Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('❌ Error sending invitation email:', error);
    throw error;
  }
};

module.exports = {
  sendEmployerEmailProposalReceived,
  sendSupplierEmailProposalAccepted,
  sendSupplierEmailProposalDeclined,
  sendBankEmailNewBankAccount,
  sendBankEmailNewFinanceProduct,
  sendCompanyEmailBankAccountOpen,
  sendCompanyEmailBankAccountRequireChanges,
  sendCompanyEmailFinanceProductAccepted,
  sendCompanyEmailFinanceProductDeclined,
  sendInviteCompanies,
  sendPasswordResetRequestEmail,
  sendPasswordResetSuccessfullyEmail,
  sendCollaboratorInvitationEmail,
};
