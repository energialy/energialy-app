const { Users, Companies, Tenders, TenderInvitations } = require('../db');
const { sendTenderInvitationEmail } = require('../services/resend');

const inviteUsersToTender = async (tenderId, invitations, inviterUserId) => {
  try {
    console.log('🔄 Starting tender invitation process for:', { tenderId, invitations: invitations.length });

    // Verificar que la licitación existe y pertenece al usuario
    const tender = await Tenders.findByPk(tenderId, {
      include: [{ model: Companies }]
    });

    if (!tender) {
      throw new Error('Tender not found');
    }

    const inviter = await Users.findByPk(inviterUserId, {
      include: [{ model: Companies }]
    });

    if (!inviter || inviter.CompanyId !== tender.CompanyId) {
      throw new Error('Unauthorized to invite users to this tender');
    }

    const results = [];

    for (const invitation of invitations) {
      try {
        const { userEmail, isRegistered } = invitation;

        // Verificar si ya existe una invitación para este email
        const existingInvitation = await TenderInvitations.findOne({
          where: {
            tenderId: tenderId,
            userEmail: userEmail
          }
        });

        if (existingInvitation) {
          results.push({
            email: userEmail,
            status: 'already_invited',
            message: 'Usuario ya invitado previamente'
          });
          continue;
        }

        let userId = null;
        let userName = 'Usuario';

        if (isRegistered) {
          // Buscar el usuario registrado
          const user = await Users.findOne({ where: { email: userEmail } });
          if (user) {
            userId = user.id;
            userName = `${user.firstName} ${user.lastName}`;
          }
        }

        // Crear registro de invitación en la base de datos
        await TenderInvitations.create({
          tenderId: tenderId,
          userEmail: userEmail,
          userId: userId,
          isRegistered: !!userId,
          status: 'invited',
          invitedBy: inviterUserId
        });

        // Enviar email de invitación
        await sendTenderInvitationEmail(
          userEmail,
          userName,
          tender.title,
          tender.Company.name,
          `${inviter.firstName} ${inviter.lastName}`,
          tender.id,
          isRegistered ? 'registered' : 'unregistered'
        );

        results.push({
          email: userEmail,
          name: userName,
          status: 'sent',
          type: isRegistered ? 'registered_user' : 'email'
        });

      } catch (emailError) {
        console.error(`Error processing invitation for ${invitation.userEmail}:`, emailError);
        results.push({
          email: invitation.userEmail,
          status: 'failed',
          error: emailError.message,
          type: invitation.isRegistered ? 'registered_user' : 'email'
        });
      }
    }

    console.log('✅ Tender invitations processed:', results);

    return {
      success: true,
      message: 'Invitations processed successfully',
      results
    };

  } catch (error) {
    console.error('❌ Error in inviteUsersToTender:', error);
    throw new Error(`Failed to send tender invitations: ${error.message}`);
  }
};

const getTenderInvitations = async (tenderId) => {
  try {
    console.log('🔍 Getting tender invitations for tender:', tenderId);

    // Verificar que la licitación existe
    const tender = await Tenders.findByPk(tenderId, {
      include: [{ model: Companies }]
    });

    if (!tender) {
      throw new Error('Tender not found');
    }

    // Obtener todas las invitaciones para esta licitación
    const invitations = await TenderInvitations.findAll({
      where: { tenderId },
      include: [
        {
          model: Users,
          as: 'user',
          required: false,
          include: [{ model: Companies }]
        },
        {
          model: Users,
          as: 'invitedByUser',
          attributes: ['firstName', 'lastName']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log('✅ Found invitations:', invitations.length);

    return invitations;

  } catch (error) {
    console.error('❌ Error in getTenderInvitations:', error);
    throw new Error(`Failed to get tender invitations: ${error.message}`);
  }
};

module.exports = {
  inviteUsersToTender,
  getTenderInvitations
};
