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

async function runCustomFieldsMigration() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Read and execute the migration SQL
    const migrationSQL = fs.readFileSync(path.join(__dirname, 'add_custom_fields_and_pricing_to_tenders.sql'), 'utf8');
    
    console.log('Executing custom fields and pricing migration SQL...');
    
    await sequelize.query(migrationSQL);
    
    console.log('Custom fields and pricing migration completed successfully!');
    
    // Test that the columns were added correctly
    console.log('Testing new columns...');
    const [results] = await sequelize.query(`
      SELECT column_name, data_type, column_default, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'Tenders' 
      AND column_name IN ('customFields', 'priceType', 'priceUnit', 'servicePrices')
      ORDER BY column_name;
    `);
    
    console.log('New columns information:');
    console.table(results);
    
    // Test JSON columns functionality
    console.log('Testing JSON columns functionality...');
    const [jsonTest] = await sequelize.query(`
      SELECT 
        '[]'::jsonb as test_empty_array,
        '[{"type": "text", "label": "Test Field"}]'::jsonb as test_custom_field,
        '[{"name": "Service 1", "price": 100, "unit": "hour"}]'::jsonb as test_service_price;
    `);
    
    console.log('JSON functionality test:');
    console.table(jsonTest);
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  runCustomFieldsMigration();
}

module.exports = runCustomFieldsMigration;
