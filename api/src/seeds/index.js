const { conn } = require('../db');
const seedPermissions = require('./seedPermissions');

const runSeeds = async () => {
  try {
    console.log('🚀 Starting database seeding...');
    console.log('📊 Database connection string:', process.env.DB_HOST ? 'DB_HOST configured' : 'DB_HOST missing');
    
    // Sync database (create tables if they don't exist)
    console.log('🔄 Synchronizing database...');
    await conn.sync({ force: false });
    console.log('📊 Database synchronized successfully');

    // Run seeds
    await seedPermissions();

    console.log('🎉 All seeds completed successfully!');
    
    // Close database connection
    await conn.close();
    console.log('🔒 Database connection closed');
    
  } catch (error) {
    console.error('💥 Error running seeds:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

// Run seeds if this file is executed directly
if (require.main === module) {
  runSeeds();
}

module.exports = runSeeds;
