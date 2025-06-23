const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, SSL_MODE } = process.env;

// Create sequelize instance with the same configuration as the main app
const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}${SSL_MODE}`, {
  logging: console.log, // Enable logging to see what's happening
  native: false,
  dialectModule: require('pg'),
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

async function runMigration() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');    // Read and execute the migration SQL
    const migrationSQL = fs.readFileSync(path.join(__dirname, 'alter_token_columns_to_text.sql'), 'utf8');
    
    console.log('Executing migration SQL:');
    console.log(migrationSQL);
    
    await sequelize.query(migrationSQL);
    
    console.log('Migration completed successfully!');
    
    // Test that the columns now accept TEXT
    console.log('Testing column types...');
    const [results] = await sequelize.query(`
      SELECT column_name, data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name IN ('Users', 'CompanyInvitations') 
      AND column_name IN ('refreshToken', 'resetToken', 'invitationToken')
      ORDER BY table_name, column_name;
    `);
    
    console.log('Column information after migration:');
    console.table(results);
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  runMigration();
}

module.exports = runMigration;
