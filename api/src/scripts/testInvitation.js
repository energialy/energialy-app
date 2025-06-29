const { Users, Companies, CompanyInvitations } = require('../db');
const { inviteCollaborator } = require('../controllers/collaboratorsController');

const testInvitation = async () => {
  try {
    console.log('🧪 Starting invitation test...');

    // Check environment variables
    console.log('🔍 Checking environment variables...');
    console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    console.log('FRONTEND_URL:', process.env.FRONTEND_URL);

    // Find first company and user for testing
    const company = await Companies.findOne();
    const user = await Users.findOne({
      where: { role: ['admin', 'company_owner'] }
    });

    if (!company) {
      console.log('❌ No company found');
      return;
    }

    if (!user) {
      console.log('❌ No user found');
      return;
    }

    console.log('🏢 Using company:', company.name, '(ID:', company.id, ')');
    console.log('👤 Using user:', user.firstName, user.lastName, '(ID:', user.id, ')');

    // Test invitation
    const testEmail = 'test@example.com';
    const result = await inviteCollaborator(
      testEmail,
      ['INSTITUCIONAL', 'COMUNICACIONES'],
      'Test',
      'User',
      'Colaborador de prueba',
      user.id,
      company.id
    );

    console.log('✅ Invitation result:', result);

    // Check if invitation was created
    const invitation = await CompanyInvitations.findOne({
      where: { email: testEmail, companyId: company.id }
    });

    console.log('📋 Invitation record:', invitation ? 'Found' : 'Not found');
    if (invitation) {
      console.log('📋 Invitation details:', {
        id: invitation.id,
        email: invitation.email,
        status: invitation.status,
        createdAt: invitation.createdAt
      });
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('❌ Error details:', error);
  } finally {
    process.exit(0);
  }
};

testInvitation();
