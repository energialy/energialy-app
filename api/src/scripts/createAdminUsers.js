const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
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

async function createAdminUser() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Admin user data
    const adminData = {
      id: uuidv4(),
      email: 'admin@energialy.com',
      firstName: 'Admin',
      lastName: 'Energialy',
      role: 'superAdmin',
      permissions: ['ALL'], // Super admin has all permissions
      isActive: true
    };

    // Hash the password
    const plainPassword = 'admin123456';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    adminData.hashedPassword = hashedPassword;

    console.log('Creating admin user with data:');
    console.log({
      id: adminData.id,
      email: adminData.email,
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      role: adminData.role,
      permissions: adminData.permissions,
      isActive: adminData.isActive
    });

    // Check if user already exists
    const [existingUser] = await sequelize.query(
      'SELECT id, email FROM "Users" WHERE email = :email',
      {
        replacements: { email: adminData.email },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (existingUser) {
      console.log('Admin user already exists:', existingUser);
      console.log('You can login with:');
      console.log('Email:', adminData.email);
      console.log('Password: admin123456');
      return;
    }

    // Insert the admin user
    await sequelize.query(`
      INSERT INTO "Users" (
        id, email, "hashedPassword", "firstName", "lastName", 
        role, permissions, "isActive", "createdAt", "updatedAt"
      ) VALUES (
        :id, :email, :hashedPassword, :firstName, :lastName,
        :role, ARRAY[:permission1], :isActive, NOW(), NOW()
      )
    `, {
      replacements: {
        id: adminData.id,
        email: adminData.email,
        hashedPassword: adminData.hashedPassword,
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        role: adminData.role,
        permission1: adminData.permissions[0], // 'ALL'
        isActive: adminData.isActive
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('Login credentials:');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password: admin123456');
    console.log('');
    console.log('You can now login at: http://localhost:3002/auth/login');
    
  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Also create a function to create a company admin user
async function createCompanyAdminUser() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // First, let's check if there are any companies
    const [companies] = await sequelize.query(
      'SELECT id, name FROM "Companies" LIMIT 5',
      { type: sequelize.QueryTypes.SELECT }
    );

    let companyId = null;
    if (companies.length > 0) {
      companyId = companies[0].id;
      console.log('Found existing company:', companies[0].name, 'ID:', companyId);
    } else {
      // Create a test company
      companyId = uuidv4();
      await sequelize.query(`
        INSERT INTO "Companies" (
          id, name, email, description, "createdAt", "updatedAt"
        ) VALUES (
          :id, :name, :email, :description, NOW(), NOW()
        )
      `, {
        replacements: {
          id: companyId,
          name: 'Empresa Test',
          email: 'test@empresa.com',
          description: 'Empresa de prueba para testing'
        }
      });
      console.log('Created test company with ID:', companyId);
    }

    // Company admin user data
    const companyAdminData = {
      id: uuidv4(),
      email: 'empresa@test.com',
      firstName: 'Usuario',
      lastName: 'Empresa',
      role: 'company_owner',
      permissions: ['INSTITUCIONAL', 'COMUNICACIONES', 'LICITACIONES', 'FINANZAS'],
      isActive: true,
      CompanyId: companyId
    };

    // Hash the password
    const plainPassword = 'empresa123';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    companyAdminData.hashedPassword = hashedPassword;

    console.log('Creating company admin user with data:');
    console.log({
      id: companyAdminData.id,
      email: companyAdminData.email,
      firstName: companyAdminData.firstName,
      lastName: companyAdminData.lastName,
      role: companyAdminData.role,
      permissions: companyAdminData.permissions,
      isActive: companyAdminData.isActive,
      CompanyId: companyAdminData.CompanyId
    });

    // Check if user already exists
    const [existingUser] = await sequelize.query(
      'SELECT id, email FROM "Users" WHERE email = :email',
      {
        replacements: { email: companyAdminData.email },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (existingUser) {
      console.log('Company admin user already exists:', existingUser);
      console.log('You can login with:');
      console.log('Email:', companyAdminData.email);
      console.log('Password: empresa123');
      return;
    }

    // Insert the company admin user
    await sequelize.query(`
      INSERT INTO "Users" (
        id, email, "hashedPassword", "firstName", "lastName", 
        role, permissions, "isActive", "CompanyId", "createdAt", "updatedAt"
      ) VALUES (
        :id, :email, :hashedPassword, :firstName, :lastName,
        :role, ARRAY[:perm1, :perm2, :perm3, :perm4], :isActive, :CompanyId, NOW(), NOW()
      )
    `, {
      replacements: {
        id: companyAdminData.id,
        email: companyAdminData.email,
        hashedPassword: companyAdminData.hashedPassword,
        firstName: companyAdminData.firstName,
        lastName: companyAdminData.lastName,
        role: companyAdminData.role,
        perm1: companyAdminData.permissions[0], // 'INSTITUCIONAL'
        perm2: companyAdminData.permissions[1], // 'COMUNICACIONES'
        perm3: companyAdminData.permissions[2], // 'LICITACIONES'
        perm4: companyAdminData.permissions[3], // 'FINANZAS'
        isActive: companyAdminData.isActive,
        CompanyId: companyAdminData.CompanyId
      }
    });

    console.log('✅ Company admin user created successfully!');
    console.log('');
    console.log('Company Owner Login credentials:');
    console.log('📧 Email:', companyAdminData.email);
    console.log('🔑 Password: empresa123');
    console.log('🏢 Company ID:', companyAdminData.CompanyId);
    console.log('');
    
  } catch (error) {
    console.error('❌ Failed to create company admin user:', error);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const userType = args[0] || 'both';

  console.log('🚀 Starting user creation script...');
  console.log('');

  if (userType === 'admin' || userType === 'both') {
    console.log('Creating super admin user...');
    await createAdminUser();
    console.log('');
  }

  if (userType === 'company' || userType === 'both') {
    console.log('Creating company owner user...');
    await createCompanyAdminUser();
    console.log('');
  }

  console.log('✨ Script completed!');
}

if (require.main === module) {
  main();
}

module.exports = { createAdminUser, createCompanyAdminUser };
