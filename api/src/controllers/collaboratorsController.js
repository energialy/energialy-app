const { Users, Companies, CompanyInvitations, Permissions } = require('../db');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { sendCollaboratorInvitationEmail } = require('../services/resend');
const FRONTEND_URL = process.env.FRONTEND_URL;

const inviteCollaborator = async (email, permissions, firstName, lastName, position, inviterUserId, companyId) => {
  try {
    console.log('🔄 Starting invitation process for:', { email, companyId, inviterUserId });

    // Check if user already exists
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      console.log('❌ User already exists:', email);
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
      console.log('❌ Pending invitation already exists:', email);
      throw new Error('There is already a pending invitation for this email');
    }

    // Generate invitation token
    const invitationToken = crypto.randomBytes(32).toString('hex');
    console.log('🔑 Generated invitation token for:', email);

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
    console.log('✅ Invitation created with ID:', invitation.id);

    // Get company info for email
    const company = await Companies.findByPk(companyId);
    const inviter = await Users.findByPk(inviterUserId);
    
    if (!company) {
      console.log('❌ Company not found:', companyId);
      throw new Error('Company not found');
    }
    
    if (!inviter) {
      console.log('❌ Inviter not found:', inviterUserId);
      throw new Error('Inviter not found');
    }

    console.log('📧 Preparing to send email to:', email);
    console.log('📧 Company:', company.name);
    console.log('📧 Inviter:', inviter.firstName + ' ' + inviter.lastName);

    // Send invitation email
    await sendCollaboratorInvitationEmail(
      email, 
      firstName || 'Usuario', 
      company.name,
      inviter.firstName + ' ' + inviter.lastName,
      invitationToken,
      FRONTEND_URL // Pasar la URL del frontend explícitamente
    );

    console.log('✅ Email sent successfully to:', email);

    return {
      success: true,
      message: 'Invitation sent successfully',
      invitationId: invitation.id
    };

  } catch (error) {
    console.error('❌ Error in inviteCollaborator:', error);
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
    // Get active collaborators from Users table
    const activeCollaborators = await Users.findAll({
      where: { 
        CompanyId: companyId,
        role: ['company_owner', 'company_collaborator']
      },
      attributes: ['id', 'email', 'firstName', 'lastName', 'position', 'role', 'permissions', 'isActive', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    // Get pending invitations from CompanyInvitations table
    const pendingInvitations = await CompanyInvitations.findAll({
      where: { 
        companyId: companyId,
        status: 'pending'
      },
      attributes: ['id', 'email', 'firstName', 'lastName', 'position', 'permissions', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    // Format active collaborators
    const formattedActiveCollaborators = activeCollaborators.map(collab => ({
      id: collab.id,
      email: collab.email,
      firstName: collab.firstName,
      lastName: collab.lastName,
      position: collab.position,
      role: collab.role,
      permissions: collab.permissions,
      isActive: collab.isActive,
      status: 'accepted', // Change from 'active' to 'accepted' to match frontend
      createdAt: collab.createdAt
    }));

    // Format pending invitations
    const formattedPendingInvitations = pendingInvitations.map(invitation => ({
      id: invitation.id,
      email: invitation.email,
      firstName: invitation.firstName,
      lastName: invitation.lastName,
      position: invitation.position,
      role: 'company_collaborator',
      permissions: invitation.permissions,
      isActive: true,
      status: 'pending',
      createdAt: invitation.createdAt
    }));

    // Combine both arrays
    const allCollaborators = [...formattedActiveCollaborators, ...formattedPendingInvitations];
    
    // Sort by creation date (newest first)
    allCollaborators.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return allCollaborators;
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
