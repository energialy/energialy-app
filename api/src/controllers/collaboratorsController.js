const { Users, Companies, CompanyInvitations, Permissions } = require('../db');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { sendCollaboratorInvitationEmail } = require('../services/resend');

const inviteCollaborator = async (email, permissions, firstName, lastName, position, inviterUserId, companyId) => {
  try {
    // Check if user already exists
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Check if there's already a pending invitation
    const existingInvitation = await CompanyInvitations.findOne({
      where: { 
        email, 
        companyId,
        status: 'pending'
      }
    });

    if (existingInvitation) {
      throw new Error('There is already a pending invitation for this email');
    }

    // Generate invitation token
    const invitationToken = crypto.randomBytes(32).toString('hex');

    // Create invitation
    const invitation = await CompanyInvitations.create({
      email,
      invitationToken,
      permissions,
      invitedBy: inviterUserId,
      companyId,
      firstName,
      lastName,
      position,
      status: 'pending'
    });

    // Get company info for email
    const company = await Companies.findByPk(companyId);
    const inviter = await Users.findByPk(inviterUserId);

    // Send invitation email
    await sendCollaboratorInvitationEmail(
      email, 
      firstName || 'Usuario', 
      company.name,
      inviter.firstName + ' ' + inviter.lastName,
      invitationToken
    );

    return {
      success: true,
      message: 'Invitation sent successfully',
      invitationId: invitation.id
    };

  } catch (error) {
    throw new Error(`Failed to invite collaborator: ${error.message}`);
  }
};

const acceptInvitation = async (invitationToken, password) => {
  try {
    // Find invitation
    const invitation = await CompanyInvitations.findOne({
      where: { 
        invitationToken,
        status: 'pending'
      },
      include: [{ model: Companies }]
    });

    if (!invitation) {
      throw new Error('Invalid or expired invitation token');
    }

    // Check if invitation is expired
    if (new Date() > invitation.expiresAt) {
      await invitation.update({ status: 'expired' });
      throw new Error('Invitation has expired');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await Users.create({
      email: invitation.email,
      hashedPassword,
      firstName: invitation.firstName,
      lastName: invitation.lastName,
      position: invitation.position,
      role: 'company_collaborator',
      permissions: invitation.permissions,
      invitedBy: invitation.invitedBy,
      invitationStatus: 'accepted',
      CompanyId: invitation.companyId
    });

    // Update invitation status
    await invitation.update({ status: 'accepted' });

    return {
      success: true,
      message: 'Invitation accepted successfully',
      userId: newUser.id
    };

  } catch (error) {
    throw new Error(`Failed to accept invitation: ${error.message}`);
  }
};

const getCompanyCollaborators = async (companyId) => {
  try {
    const collaborators = await Users.findAll({
      where: { 
        CompanyId: companyId,
        role: ['company_owner', 'company_collaborator']
      },
      attributes: ['id', 'email', 'firstName', 'lastName', 'position', 'role', 'permissions', 'isActive', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    return collaborators;
  } catch (error) {
    throw new Error(`Failed to get collaborators: ${error.message}`);
  }
};

const updateCollaboratorPermissions = async (collaboratorId, newPermissions, companyId) => {
  try {
    const collaborator = await Users.findOne({
      where: { 
        id: collaboratorId,
        CompanyId: companyId,
        role: 'company_collaborator'
      }
    });

    if (!collaborator) {
      throw new Error('Collaborator not found');
    }

    await collaborator.update({ permissions: newPermissions });

    return {
      success: true,
      message: 'Permissions updated successfully'
    };

  } catch (error) {
    throw new Error(`Failed to update permissions: ${error.message}`);
  }
};

const removeCollaborator = async (collaboratorId, companyId) => {
  try {
    const collaborator = await Users.findOne({
      where: { 
        id: collaboratorId,
        CompanyId: companyId,
        role: 'company_collaborator'
      }
    });

    if (!collaborator) {
      throw new Error('Collaborator not found');
    }

    await collaborator.update({ isActive: false });

    return {
      success: true,
      message: 'Collaborator removed successfully'
    };

  } catch (error) {
    throw new Error(`Failed to remove collaborator: ${error.message}`);
  }
};

const getAllPermissions = async () => {
  try {
    const permissions = await Permissions.findAll({
      where: { isActive: true },
      order: [['category', 'ASC'], ['displayName', 'ASC']]
    });

    // Group permissions by category
    const groupedPermissions = permissions.reduce((acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }
      acc[permission.category].push({
        name: permission.name,
        displayName: permission.displayName,
        description: permission.description
      });
      return acc;
    }, {});

    return groupedPermissions;
  } catch (error) {
    throw new Error(`Failed to get permissions: ${error.message}`);
  }
};

const validateInvitation = async (invitationToken) => {
  try {
    // Find invitation with company and inviter data
    const invitation = await CompanyInvitations.findOne({
      where: { 
        invitationToken,
        status: 'pending'
      },
      include: [
        { 
          model: Companies,
          attributes: ['name', 'id']
        }
      ]
    });

    if (!invitation) {
      throw new Error('Invitation not found or has expired');
    }

    // Get inviter data
    const inviter = await Users.findByPk(invitation.invitedBy, {
      attributes: ['firstName', 'lastName']
    });

    return {
      email: invitation.email,
      firstName: invitation.firstName,
      lastName: invitation.lastName,
      permissions: invitation.permissions,
      companyName: invitation.Company.name,
      inviterName: inviter ? `${inviter.firstName} ${inviter.lastName}` : 'Usuario'
    };

  } catch (error) {
    throw new Error(`Failed to validate invitation: ${error.message}`);
  }
};

module.exports = {
  inviteCollaborator,
  acceptInvitation,
  getCompanyCollaborators,
  updateCollaboratorPermissions,
  removeCollaborator,
  getAllPermissions,
  validateInvitation
};
