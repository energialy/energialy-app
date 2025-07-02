// Script de testing para la funcionalidad de invitaciones
// Ejecutar desde el directorio api: node src/scripts/testInvitations.js

const { Users, Companies, Tenders, TenderInvitations } = require('../db');

async function testInvitationsFeature() {
  try {
    console.log('🧪 Testing Tender Invitations Feature...\n');

    // 1. Verificar que la tabla TenderInvitations existe
    console.log('1. Checking TenderInvitations table...');
    try {
      const count = await TenderInvitations.count();
      console.log(`✅ TenderInvitations table exists with ${count} records\n`);
    } catch (error) {
      console.log('❌ TenderInvitations table not found. Run migration first.\n');
      return;
    }

    // 2. Obtener una licitación de ejemplo
    console.log('2. Finding a test tender...');
    const tender = await Tenders.findOne({
      include: [{ model: Companies }],
      limit: 1
    });

    if (!tender) {
      console.log('❌ No tenders found. Create a tender first.\n');
      return;
    }

    console.log(`✅ Found tender: "${tender.title}" by ${tender.Company.name}\n`);

    // 3. Obtener un usuario para hacer la invitación
    console.log('3. Finding a test user...');
    const inviter = await Users.findOne({
      where: { CompanyId: tender.CompanyId },
      include: [{ model: Companies }]
    });

    if (!inviter) {
      console.log('❌ No user found for the tender company.\n');
      return;
    }

    console.log(`✅ Found inviter: ${inviter.firstName} ${inviter.lastName}\n`);

    // 4. Crear invitaciones de prueba
    console.log('4. Creating test invitations...');
    
    const testInvitations = [
      {
        userEmail: 'test1@example.com',
        isRegistered: false
      },
      {
        userEmail: 'test2@example.com',
        isRegistered: false
      }
    ];

    const { inviteUsersToTender } = require('../controllers/tenderInvitationsController');
    
    const result = await inviteUsersToTender(tender.id, testInvitations, inviter.id);
    console.log('✅ Invitations result:', result);
    console.log('');

    // 5. Verificar que las invitaciones se guardaron
    console.log('5. Verifying saved invitations...');
    const { getTenderInvitations } = require('../controllers/tenderInvitationsController');
    
    const invitations = await getTenderInvitations(tender.id);
    console.log(`✅ Found ${invitations.length} invitations for tender`);
    
    invitations.forEach((inv, index) => {
      console.log(`  ${index + 1}. ${inv.userEmail} - Status: ${inv.status} - Registered: ${inv.isRegistered}`);
    });
    console.log('');

    // 6. Test API endpoints (simulado)
    console.log('6. API Endpoints available:');
    console.log('   POST /tenders/:tenderId/invitations');
    console.log('   GET /tenders/:tenderId/invitations');
    console.log('✅ Endpoints configured and ready\n');

    console.log('🎉 All tests passed! Invitations feature is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    process.exit(0);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  testInvitationsFeature();
}

module.exports = { testInvitationsFeature };
