const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Configuración de la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function runTenderInvitationsMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting TenderInvitations table migration...');
    
    // Leer el archivo SQL
    const migrationPath = path.join(__dirname, 'create_tender_invitations_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Ejecutar la migración
    await client.query(migrationSQL);
    
    console.log('✅ TenderInvitations table migration completed successfully');
    
    // Verificar que la tabla fue creada
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'TenderInvitations'
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 TenderInvitations table structure:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
    });
    
  } catch (error) {
    console.error('❌ Error running TenderInvitations migration:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  runTenderInvitationsMigration()
    .then(() => {
      console.log('🎉 Migration completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { runTenderInvitationsMigration };
