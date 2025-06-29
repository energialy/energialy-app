const generateEmployerEmailProposalReceived = (employerName, supplierCompanyName, tenderTitle, proposalAmount, proposalDuration) => {
  const html = `
  <body>
    <p>Hola ${employerName}!</p>
    <p><b>${supplierCompanyName}</b> te ha enviado una nueva propuesta en este proyecto: <b>${tenderTitle}</b>.</p>
    <p><b>Monto de la Propuesta:</b> U$S ${proposalAmount}.</p>
    <p><b>Duración:</b> ${proposalDuration}.</p>
    <p>Ingresa a tu cuenta para ver más detalles haciendo clic <a href="https://energialy.vercel.app/">acá</a>.</p>
    <p><i>Si tienes alguna duda puedes escribirnos a: hola@energialy.ar</i></p>
    <p><b>Saludos de nuestro Equipo.</b></p>
  </body>
  `;
  return html;
};

const generateSupplierEmailProposalAccepted = (supplierName, employerCompanyName, tenderTitle) => {
  const html = `
  <body>
    <p>Hola ${supplierName}!</p>
    <p><b>${employerCompanyName}</b> ha aceptado tu propuesta en la siguiente licitación: <b>${tenderTitle}</b>.</p>
    <p>Desde tu Dashboard podrás continuar las comunicaciones con la empresa.</p>
    <p>Al Completar el proyecto, la empresa contratista valorará tu desempeño y aparecerá en tu perfil público.</p>
    <p>IMPORTANTE: Si necesitas contratar/tercerizar algun servicio para el presente proyecto, puedes también publicar GRATIS tu propio proyecto. Desde tu Dashboard selecciona <b>PUBLICAR LICITACIÓN</b></p>
    <p>Recuerda también que deberás abonar un fee a Energialy: 2% del total del proyecto en el cual tu empresa fué contratada. Tendrás 15 dias hábiles, desde la recepción de este correo, para realizar el pago.</p>
    <p>Para informar dicho pago o para realizar cualquier consulta que tengas, por favor comunicate con el equipo de Energialy: hola@energialy.ar</p>
    <p>Nuevamente felicitaciones por haber sido seleccionada tu propuesta!</p>
    <p><b>Saludos de nuestro Equipo.</b></p>
  </body>
  `;
  return html;
};

const generateSupplierEmailProposalDeclined = (supplierName, employerCompanyName, tenderTitle) => {
  const html = `
  <body>
    <p>Hola ${supplierName}.</p>
    <p>Lamentablemente, tu propuesta a la licitación "${tenderTitle}" de ${employerCompanyName} fue rechazada.</p>
    <p>Cualquier inquietud que tengas al respecto, puedes comunicarte con el Equipo de Energialy: hola@energialy.ar</p>
    <p><b>Saludos de nuestro Equipo.</b></p>
  </body>
  `;
  return html;
};

const generateBankEmailNewBankAccount = (companyName) => {
  const html = `
  <body>
    <p>Hola</p>
    <p>${companyName} ha enviado una Nueva Solicitud de Apertura de Cuenta en Banco de Comercio.</p>
    <p>Podés ingresar a tu cuenta de Energialy para ver más detalles.</p>
    <p><b>Saludos de nuestro Equipo.</b></p>
  </body>
  `;
  return html;
};

const generateBankEmailNewFinanceProduct = (companyName) => {
  const html = `
  <body>
    <p>Hola</p>
    <p>${companyName} ha solicitado un Producto Financiero de Banco de Comercio.</p>
    <p>Podés ingresar a tu cuenta de Energialy para ver más detalles.</p>
    <p><b>Saludos de nuestro Equipo.</b></p>
  </body>
  `;
  return html;
};

const generateCompanyEmailBankAccountOpen = (companyOwnerName, companyName) => {
  const html = `
  <body>
    <p>Hola ${companyOwnerName}, felicitaciones!</p>
    <p><b>Tu Solicitud de Apertura de Cuenta fue confirmada.</b></p>
    <p>Ya podés ingresar a tu cuenta en Energialy ${companyName} para ver más detalles y  solicitar los productos financieros que necesites para tu pyme. </p>
    <p>Si tenés alguna duda podés escribirnos a: hola@energialy.ar</p>
    <p><b>Saludos de nuestro Equipo.</b></p>
  </body>
  `;
  return html;
};

const generateCompanyEmailBankAccountRequireChanges = (companyOwnerName, companyName) => {
  const html = `
  <body>
    <p>Hola ${companyOwnerName}</p>
    <p>Recibiste una notificación en tu Solicitud de Apertura de Cuenta.</p>
    <p>Podés ingresar a tu cuenta en Energialy ${companyName} para ver más detalles. </p>
    <p>Si tenés alguna duda podés escribirnos a: hola@energialy.ar</p>
    <p><b>Saludos de nuestro Equipo.</b></p>
  </body>
  `;
  return html;
};

const generateCompanyEmailFinanceProductAccepted = (companyOwnerName, companyName) => {
  const html = `
  <body>
    <p>Hola ${companyOwnerName}, felicitaciones!</p>
    <p><b>El producto financiero que solicitaste fue aprobado. </b></p>
    <p>Podés ingresar a tu cuenta en Energialy ${companyName} para ver más detalles. </p>
    <p>Si tenés alguna duda podés escribirnos a: hola@energialy.ar</p>
    <p><b>Saludos de nuestro Equipo.</b></p>
  </body>
  `;
  return html;
};

const generateCompanyEmailFinanceProductDeclined = (companyOwnerName, companyName) => {
  const html = `
  <body>
    <p>Hola ${companyOwnerName}</p>
    <p>El producto financiero que solicitaste no fue aprobado. </p>
    <p>Podés ingresar a tu cuenta en Energialy ${companyName} para ver más detalles. </p>
    <p>Si tenés alguna duda podés escribirnos a: hola@energialy.ar</p>
    <p><b>Saludos de nuestro Equipo.</b></p>
  </body>
  `;
  return html;
};

const generateSendInviteCompanies = (companyName) => {
  const html = `
  <body>
    <p><b>Hola!</b></p>
    <p>La empresa ${companyName} te ha invitado a unirte a Energialy!</p>
    <p>En Energialy contratás y sos contratado: </p>
    <p>Creá Licitaciones y contratá a proveedores de servicios, sin cargo. </p>
    <p>Participá y enviá tu propuesta en Licitaciones de otras empresas. </p>
    <p>También accedés a las soluciones financieras de Banco de Comercio para que tu Pyme y tus Proyectos sigan creciendo: </p>
    <p>PRÉSTAMOS </p>
    <p>FACTURAS DE CRÉDITO ELECTRÓNICAS </p>
    <p>E-CHEQS | CHEQUES </p>
    <p>COMEX </p>
    <p>Energialy es la plataforma para integrar a la Cadena de Valor, gestionar contrataciones entre Pymes y acceder a financiamiento. </p>
    <p>Ingresá ahora y <a href="https://energialy.vercel.app">creá tu cuenta gratis</a>! </p>
  </body>
  `;
  return html;
};

const generatePasswordResetRequestEmail = (username, link) => {
  const html = `
  <body>
    <p>Hola ${username},</p>
    <p>Por favor, hacé clic en el link de acá abajo para restablecer tu contraseña.</p>
    <p><a href="${link}">Restablecer Contraseña</a></p>
    <p>Si no solicitaste el restablecimiento de tu contraseña, podés ignorar este email.</p>
    <p>Gracias!</p>
    <p>El equipo de Energialy</p>
  </body>
  `;
  return html;
};

const generatePasswordResetSuccessfullyEmail = (username) => {
  const html = `
  <body>
    <p>Hola ${username},</p>
    <p>Tu contraseña fue restablecida con éxito.</p>
    <p>Gracias!</p>
    <p>El equipo de Energialy</p>
  </body>
  `;
  return html;
};

const generateCollaboratorInvitationEmail = (collaboratorName, companyName, inviterName, invitationLink) => {
  const html = `
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2c5282;">¡Invitación para colaborar en ${companyName}!</h2>
      
      <p>Hola ${collaboratorName},</p>
      
      <p><strong>${inviterName}</strong> te ha invitado a colaborar en <strong>${companyName}</strong> a través de la plataforma Energialy.</p>
      
      <p>Como colaborador, tendrás acceso a funciones específicas de la empresa según los permisos que te han sido asignados.</p>
      
      <div style="margin: 30px 0; text-align: center;">
        <a href="${invitationLink}" 
           style="background-color: #2c5282; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Aceptar Invitación
        </a>
      </div>
      
      <p><strong>Instrucciones:</strong></p>
      <ol>
        <li>Haz clic en el botón "Aceptar Invitación"</li>
        <li>Crea tu contraseña para la cuenta</li>
        <li>¡Comienza a colaborar con ${companyName}!</li>
      </ol>
      
      <p style="font-size: 12px; color: #666; margin-top: 30px;">
        <strong>Nota:</strong> Esta invitación expira en 7 días. Si no puedes acceder al enlace, copia y pega la siguiente URL en tu navegador:<br>
        <span style="word-break: break-all;">${invitationLink}</span>
      </p>
      
      <p style="margin-top: 30px;">
        <em>Si tienes alguna duda puedes escribirnos a: hola@energialy.ar</em>
      </p>
      
      <p><strong>Saludos del Equipo de Energialy</strong></p>
    </div>
  </body>
  `;
  return html;
};

// Base template for styled emails
const getBaseEmailTemplate = (content, title = "Energialy") => {
  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f8f9fa;
      }
      .email-container {
        background-color: #ffffff;
        border-radius: 8px;
        padding: 30px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #e9ecef;
        margin-bottom: 30px;
      }
      .logo {
        font-size: 24px;
        font-weight: bold;
        color: #4f46e5;
        margin-bottom: 10px;
      }
      .content {
        margin-bottom: 30px;
      }
      .highlight {
        background-color: #f0f9ff;
        padding: 15px;
        border-left: 4px solid #4f46e5;
        margin: 20px 0;
        border-radius: 4px;
      }
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #4f46e5;
        color: white;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 500;
        margin: 20px 0;
      }
      .footer {
        text-align: center;
        padding-top: 20px;
        border-top: 1px solid #e9ecef;
        color: #6b7280;
        font-size: 12px;
      }
      .status-badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
      }
      .status-success { background-color: #d1fae5; color: #065f46; }
      .status-warning { background-color: #fef3c7; color: #92400e; }
      .status-error { background-color: #fee2e2; color: #991b1b; }
      .status-info { background-color: #dbeafe; color: #1e40af; }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <div class="logo">Energialy</div>
        <p>Plataforma de Gestión Empresarial</p>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p>Este es un email automático, por favor no respondas a este mensaje.</p>
        <p>Si tienes alguna consulta, contáctanos en: <a href="mailto:hola@energialy.ar">hola@energialy.ar</a></p>
        <p>&copy; 2025 Energialy. Todos los derechos reservados.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

// Chat message notification
const generateChatMessageNotification = (userName, companyName, messagePreview) => {
  const content = `
    <h2>Nuevo mensaje recibido</h2>
    <p>Hola,</p>
    <p>Has recibido un nuevo mensaje de <strong>${userName}</strong> de <strong>${companyName}</strong>.</p>
    <div class="highlight">
      <p><strong>Vista previa:</strong></p>
      <p>"${messagePreview}"</p>
    </div>
    <p>
      <a href="${process.env.FRONTEND_URL}/dashboard/chat" class="button">Ver Conversación</a>
    </p>
    <p>Saludos,<br>El equipo de Energialy</p>
  `;
  return getBaseEmailTemplate(content, "Nuevo mensaje - Energialy");
};

// New account creation notification
const generateNewAccountNotification = (userName, companyName) => {
  const content = `
    <h2>¡Bienvenido a Energialy!</h2>
    <p>Hola ${userName},</p>
    <p>Tu cuenta ha sido creada exitosamente en Energialy.</p>
    <div class="highlight">
      <p><strong>Detalles de tu cuenta:</strong></p>
      <p><strong>Empresa:</strong> ${companyName}</p>
      <p><strong>Estado:</strong> <span class="status-badge status-success">Activa</span></p>
    </div>
    <p>Ya puedes comenzar a usar todas las funcionalidades de la plataforma.</p>
    <p>
      <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Ir al Dashboard</a>
    </p>
    <p>¡Bienvenido a bordo!<br>El equipo de Energialy</p>
  `;
  return getBaseEmailTemplate(content, "Cuenta creada - Energialy");
};

// Tender published notification
const generateTenderPublishedNotification = (tenderTitle, companyName, tenderAmount) => {
  const content = `
    <h2>Licitación publicada exitosamente</h2>
    <p>Hola,</p>
    <p>Tu licitación ha sido publicada correctamente en Energialy.</p>
    <div class="highlight">
      <p><strong>Detalles de la licitación:</strong></p>
      <p><strong>Título:</strong> ${tenderTitle}</p>
      <p><strong>Empresa:</strong> ${companyName}</p>
      <p><strong>Presupuesto:</strong> ${tenderAmount}</p>
      <p><strong>Estado:</strong> <span class="status-badge status-info">Publicada</span></p>
    </div>
    <p>Los proveedores ya pueden ver tu licitación y enviar sus propuestas.</p>
    <p>
      <a href="${process.env.FRONTEND_URL}/dashboard/licitaciones" class="button">Ver Licitación</a>
    </p>
    <p>Saludos,<br>El equipo de Energialy</p>
  `;
  return getBaseEmailTemplate(content, "Licitación publicada - Energialy");
};

// Proposal received notification
const generateProposalReceivedNotification = (tenderTitle, supplierCompany, proposalAmount) => {
  const content = `
    <h2>Nueva propuesta recibida</h2>
    <p>Hola,</p>
    <p>Has recibido una nueva propuesta para tu licitación.</p>
    <div class="highlight">
      <p><strong>Detalles de la propuesta:</strong></p>
      <p><strong>Licitación:</strong> ${tenderTitle}</p>
      <p><strong>Proveedor:</strong> ${supplierCompany}</p>
      <p><strong>Monto:</strong> ${proposalAmount}</p>
      <p><strong>Estado:</strong> <span class="status-badge status-info">Pendiente de revisión</span></p>
    </div>
    <p>Revisa la propuesta y decide si deseas aceptarla o rechazarla.</p>
    <p>
      <a href="${process.env.FRONTEND_URL}/dashboard/propuestas" class="button">Ver Propuesta</a>
    </p>
    <p>Saludos,<br>El equipo de Energialy</p>
  `;
  return getBaseEmailTemplate(content, "Nueva propuesta - Energialy");
};

// Proposal accepted notification
const generateProposalAcceptedNotification = (tenderTitle, employerCompany, proposalAmount) => {
  const content = `
    <h2>¡Felicitaciones! Tu propuesta fue aceptada</h2>
    <p>Hola,</p>
    <p>Excelentes noticias: tu propuesta ha sido aceptada.</p>
    <div class="highlight">
      <p><strong>Detalles del proyecto:</strong></p>
      <p><strong>Licitación:</strong> ${tenderTitle}</p>
      <p><strong>Cliente:</strong> ${employerCompany}</p>
      <p><strong>Valor del contrato:</strong> ${proposalAmount}</p>
      <p><strong>Estado:</strong> <span class="status-badge status-success">Aceptada</span></p>
    </div>
    <p>Ahora puedes comunicarte directamente con el cliente para coordinar los detalles del proyecto.</p>
    <p><strong>Importante:</strong> Recuerda que deberás abonar el fee de Energialy (2% del total del proyecto) dentro de los 15 días hábiles.</p>
    <p>
      <a href="${process.env.FRONTEND_URL}/dashboard/proyectos" class="button">Ver Proyecto</a>
    </p>
    <p>¡Felicitaciones!<br>El equipo de Energialy</p>
  `;
  return getBaseEmailTemplate(content, "Propuesta aceptada - Energialy");
};

// Contract awarded notification
const generateContractAwardedNotification = (tenderTitle, supplierCompany, contractAmount) => {
  const content = `
    <h2>Contrato adjudicado</h2>
    <p>Hola,</p>
    <p>El contrato ha sido oficialmente adjudicado.</p>
    <div class="highlight">
      <p><strong>Detalles del contrato:</strong></p>
      <p><strong>Proyecto:</strong> ${tenderTitle}</p>
      <p><strong>Proveedor adjudicado:</strong> ${supplierCompany}</p>
      <p><strong>Valor del contrato:</strong> ${contractAmount}</p>
      <p><strong>Estado:</strong> <span class="status-badge status-success">Adjudicado</span></p>
    </div>
    <p>El proyecto está listo para comenzar. Mantente en contacto con el proveedor para el seguimiento.</p>
    <p>
      <a href="${process.env.FRONTEND_URL}/dashboard/contratos" class="button">Ver Contrato</a>
    </p>
    <p>Saludos,<br>El equipo de Energialy</p>
  `;
  return getBaseEmailTemplate(content, "Contrato adjudicado - Energialy");
};

// Tender completed notification
const generateTenderCompletedNotification = (tenderTitle, supplierCompany) => {
  const content = `
    <h2>Proyecto completado</h2>
    <p>Hola,</p>
    <p>El proyecto ha sido marcado como completado.</p>
    <div class="highlight">
      <p><strong>Detalles del proyecto:</strong></p>
      <p><strong>Proyecto:</strong> ${tenderTitle}</p>
      <p><strong>Proveedor:</strong> ${supplierCompany}</p>
      <p><strong>Estado:</strong> <span class="status-badge status-success">Completado</span></p>
    </div>
    <p>Por favor, no olvides calificar el desempeño del proveedor para ayudar a otros usuarios.</p>
    <p>
      <a href="${process.env.FRONTEND_URL}/dashboard/proyectos" class="button">Calificar Proveedor</a>
    </p>
    <p>Saludos,<br>El equipo de Energialy</p>
  `;
  return getBaseEmailTemplate(content, "Proyecto completado - Energialy");
};

// Tender cancelled notification
const generateTenderCancelledNotification = (tenderTitle, reason) => {
  const content = `
    <h2>Licitación cancelada</h2>
    <p>Hola,</p>
    <p>Te informamos que una licitación ha sido cancelada.</p>
    <div class="highlight">
      <p><strong>Detalles:</strong></p>
      <p><strong>Licitación:</strong> ${tenderTitle}</p>
      <p><strong>Motivo:</strong> ${reason || 'No especificado'}</p>
      <p><strong>Estado:</strong> <span class="status-badge status-error">Cancelada</span></p>
    </div>
    <p>Si tienes alguna consulta sobre esta cancelación, no dudes en contactarnos.</p>
    <p>
      <a href="${process.env.FRONTEND_URL}/dashboard/licitaciones" class="button">Ver Licitaciones</a>
    </p>
    <p>Saludos,<br>El equipo de Energialy</p>
  `;
  return getBaseEmailTemplate(content, "Licitación cancelada - Energialy");
};

// Bank account status notification
const generateBankAccountStatusNotification = (status, companyName, bankName, reason = null) => {
  const isApproved = status === 'approved';
  const statusText = isApproved ? 'Aprobada' : 'Rechazada';
  const statusClass = isApproved ? 'status-success' : 'status-error';
  
  const content = `
    <h2>Solicitud de apertura de cuenta ${statusText.toLowerCase()}</h2>
    <p>Hola,</p>
    <p>Te informamos sobre el estado de tu solicitud de apertura de cuenta bancaria.</p>
    <div class="highlight">
      <p><strong>Detalles:</strong></p>
      <p><strong>Empresa:</strong> ${companyName}</p>
      <p><strong>Banco:</strong> ${bankName}</p>
      <p><strong>Estado:</strong> <span class="status-badge ${statusClass}">${statusText}</span></p>
      ${reason ? `<p><strong>Observaciones:</strong> ${reason}</p>` : ''}
    </div>
    ${isApproved ? 
      '<p>¡Felicitaciones! Tu solicitud ha sido aprobada. Pronto el banco se contactará contigo para continuar con el proceso.</p>' :
      '<p>Lamentablemente, tu solicitud ha sido rechazada. Si tienes consultas sobre este resultado, puedes contactar al banco directamente.</p>'
    }
    <p>
      <a href="${process.env.FRONTEND_URL}/dashboard/finanzas" class="button">Ver Solicitudes</a>
    </p>
    <p>Saludos,<br>El equipo de Energialy</p>
  `;
  return getBaseEmailTemplate(content, `Solicitud de cuenta ${statusText.toLowerCase()} - Energialy`);
};

// Finance product notification
const generateFinanceProductNotification = (productName, companyName, status, amount = null, reason = null) => {
  const statusMap = {
    'requested': { text: 'Solicitado', class: 'status-info' },
    'approved': { text: 'Aprobado', class: 'status-success' },
    'rejected': { text: 'Rechazado', class: 'status-error' }
  };
  
  const statusInfo = statusMap[status] || { text: status, class: 'status-info' };
  
  const content = `
    <h2>Producto financiero ${statusInfo.text.toLowerCase()}</h2>
    <p>Hola,</p>
    <p>Te informamos sobre tu solicitud de producto financiero.</p>
    <div class="highlight">
      <p><strong>Detalles:</strong></p>
      <p><strong>Producto:</strong> ${productName}</p>
      <p><strong>Empresa:</strong> ${companyName}</p>
      ${amount ? `<p><strong>Monto:</strong> ${amount}</p>` : ''}
      <p><strong>Estado:</strong> <span class="status-badge ${statusInfo.class}">${statusInfo.text}</span></p>
      ${reason ? `<p><strong>Observaciones:</strong> ${reason}</p>` : ''}
    </div>
    ${status === 'approved' ? 
      '<p>¡Excelente! Tu solicitud ha sido aprobada. El banco se contactará contigo para finalizar el proceso.</p>' :
      status === 'rejected' ?
      '<p>Lamentablemente, tu solicitud ha sido rechazada. Si tienes consultas, puedes contactar al banco directamente.</p>' :
      '<p>Tu solicitud ha sido recibida y está siendo procesada. Te mantendremos informado sobre cualquier actualización.</p>'
    }
    <p>
      <a href="${process.env.FRONTEND_URL}/dashboard/finanzas" class="button">Ver Productos Financieros</a>
    </p>
    <p>Saludos,<br>El equipo de Energialy</p>
  `;
  return getBaseEmailTemplate(content, `Producto financiero ${statusInfo.text.toLowerCase()} - Energialy`);
};

// Simple admin notification template (no styling)
const generateAdminNotification = (title, message, details = {}) => {
  let content = `
    <h3>${title}</h3>
    <p>${message}</p>
  `;
  
  if (Object.keys(details).length > 0) {
    content += '<p><strong>Detalles:</strong></p><ul>';
    Object.entries(details).forEach(([key, value]) => {
      content += `<li><strong>${key}:</strong> ${value}</li>`;
    });
    content += '</ul>';
  }
  
  content += `<p>Fecha: ${new Date().toLocaleString('es-AR')}</p>`;
  
  return content;
};

module.exports = {
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
};
