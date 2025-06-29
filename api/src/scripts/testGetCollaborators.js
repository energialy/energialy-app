const { getCompanyCollaborators } = require('../controllers/collaboratorsController');

const testGetCollaborators = async () => {
  try {
    console.log('🧪 Testing getCompanyCollaborators...');

    // Use the same company ID from the previous test
    const companyId = '867d78c4-72f9-448b-8c98-9d7a396bb971';
    
    const collaborators = await getCompanyCollaborators(companyId);
    
    console.log('✅ Found collaborators:', collaborators.length);
    
    collaborators.forEach((collab, index) => {
      console.log(`👥 Collaborator ${index + 1}:`, {
        id: collab.id,
        email: collab.email,
        name: `${collab.firstName} ${collab.lastName}`,
        status: collab.status,
        role: collab.role,
        permissions: collab.permissions
      });
    });

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('❌ Error details:', error);
  } finally {
    process.exit(0);
  }
};

testGetCollaborators();
