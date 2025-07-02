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

const sendTenderInvitationEmail = async (receiver, userName, tenderTitle, companyName, inviterName, tenderId, userType) => {
  try {
    console.log('📧 Preparing to send tender invitation email...');
    console.log('📧 Receiver:', receiver);
    console.log('📧 User name:', userName);
    console.log('📧 Tender title:', tenderTitle);
    console.log('📧 Company name:', companyName);
    console.log('📧 Inviter name:', inviterName);
    console.log('📧 Tender ID:', tenderId);
    console.log('📧 User type:', userType);

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    let invitationLink;
    let emailSubject;
    let emailHtml;

    if (userType === 'registered') {
      // Usuario registrado - enlace directo a la licitación
      invitationLink = `${process.env.FRONTEND_URL}/dashboard/tenders/${tenderId}`;
      emailSubject = `Invitación para licitar en "${tenderTitle}" - Energialy`;
      emailHtml = generateTenderInvitationEmailRegistered(userName, tenderTitle, companyName, inviterName, invitationLink);
    } else {
      // Usuario no registrado - enlace para registrarse
      invitationLink = `${process.env.FRONTEND_URL}/auth/register?tender=${tenderId}`;
      emailSubject = `Invitación para licitar en "${tenderTitle}" - Únete a Energialy`;
      emailHtml = generateTenderInvitationEmailUnregistered(userName, tenderTitle, companyName, inviterName, invitationLink);
    }

    console.log('📧 Invitation link:', invitationLink);

    const response = await resend.emails.send({
      from: 'Energialy <hola@energialy.ar>',
      to: receiver,
      subject: emailSubject,
      html: emailHtml,
    });
    
    console.log('✅ Tender invitation email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('❌ Error sending tender invitation email:', error);
    throw error;
  }
};

const generateTenderInvitationEmailRegistered = (userName, tenderTitle, companyName, inviterName, invitationLink) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
        <h1 style="color: #2c5aa0;">Energialy</h1>
      </div>
      <div style="padding: 30px 20px;">
        <h2 style="color: #333;">¡Has sido invitado a licitar!</h2>
        <p>Hola ${userName},</p>
        <p><strong>${inviterName}</strong> de <strong>${companyName}</strong> te ha invitado a participar en la siguiente licitación:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2c5aa0; margin-top: 0;">${tenderTitle}</h3>
          <p style="color: #666;">Empresa: ${companyName}</p>
        </div>
        
        <p>Puedes revisar los detalles de la licitación y enviar tu propuesta haciendo clic en el siguiente enlace:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${invitationLink}" style="background-color: #2c5aa0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Ver Licitación</a>
        </div>
        
        <p>Si tienes alguna pregunta, puedes contactar directamente con ${inviterName} a través de la plataforma.</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">Este email fue enviado desde Energialy. Si no deseas recibir más invitaciones, puedes configurar tus preferencias en tu perfil.</p>
      </div>
    </div>
  `;
};

const generateTenderInvitationEmailUnregistered = (userName, tenderTitle, companyName, inviterName, invitationLink) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
        <h1 style="color: #2c5aa0;">Energialy</h1>
      </div>
      <div style="padding: 30px 20px;">
        <h2 style="color: #333;">¡Has sido invitado a licitar en Energialy!</h2>
        <p>Hola ${userName},</p>
        <p><strong>${inviterName}</strong> de <strong>${companyName}</strong> te ha invitado a participar en la siguiente licitación:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2c5aa0; margin-top: 0;">${tenderTitle}</h3>
          <p style="color: #666;">Empresa: ${companyName}</p>
        </div>
        
        <p>Para participar en esta licitación, necesitas crear una cuenta gratuita en Energialy.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${invitationLink}" style="background-color: #2c5aa0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Únete a Energialy</a>
        </div>
        
        <p><strong>Energialy</strong> es la plataforma líder que conecta empresas del sector energético con proveedores especializados.</p>
        
        <p>Una vez que crees tu cuenta, podrás:</p>
        <ul>
          <li>Acceder a licitaciones exclusivas</li>
          <li>Enviar propuestas profesionales</li>
          <li>Conectar con empresas del sector</li>
          <li>Gestionar tus proyectos</li>
        </ul>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">Este email fue enviado desde Energialy porque ${inviterName} considera que puedes ser un buen candidato para esta licitación.</p>
      </div>
    </div>
  `;
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
  sendTenderInvitationEmail,
};
