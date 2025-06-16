require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, SSL_MODE } = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}${SSL_MODE}`, {
  logging: false,
  native: false,
  dialectModule: require('pg'),
});

// Define Permissions model temporarily
const Permissions = sequelize.define('Permissions', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

const seedPermissionsOnly = async () => {
  try {
    console.log('🌱 Seeding permissions only...');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Create Permissions table if it doesn't exist
    await Permissions.sync();
    console.log('📊 Permissions table synchronized');

    const permissions = [
      // Company Management Permissions
      {
        name: 'company.profile.edit',
        displayName: 'Editar Perfil de Empresa',
        description: 'Permite editar la información del perfil de la empresa',
        category: 'company'
      },
      {
        name: 'company.profile.view',
        displayName: 'Ver Perfil de Empresa',
        description: 'Permite ver la información del perfil de la empresa',
        category: 'company'
      },
      {
        name: 'company.users.invite',
        displayName: 'Invitar Colaboradores',
        description: 'Permite invitar nuevos colaboradores a la empresa',
        category: 'company'
      },
      {
        name: 'company.users.manage',
        displayName: 'Gestionar Colaboradores',
        description: 'Permite gestionar permisos y eliminar colaboradores',
        category: 'company'
      },
      
      // Messages/Chat Permissions
      {
        name: 'messages.send',
        displayName: 'Enviar Mensajes',
        description: 'Permite enviar mensajes vía chat',
        category: 'messages'
      },
      {
        name: 'messages.view',
        displayName: 'Ver Mensajes',
        description: 'Permite ver mensajes recibidos',
        category: 'messages'
      },
      {
        name: 'messages.respond',
        displayName: 'Responder Mensajes',
        description: 'Permite responder mensajes vía chat',
        category: 'messages'
      },

      // Tender Management Permissions
      {
        name: 'tenders.create',
        displayName: 'Crear Licitación Propia',
        description: 'Permite crear nuevas licitaciones para la empresa',
        category: 'tenders'
      },
      {
        name: 'tenders.edit',
        displayName: 'Editar Licitaciones',
        description: 'Permite editar licitaciones existentes de la empresa',
        category: 'tenders'
      },
      {
        name: 'tenders.delete',
        displayName: 'Eliminar Licitaciones',
        description: 'Permite eliminar licitaciones de la empresa',
        category: 'tenders'
      },
      {
        name: 'tenders.view',
        displayName: 'Ver Licitaciones',
        description: 'Permite ver licitaciones de la empresa y externas',
        category: 'tenders'
      },

      // Proposal Management Permissions
      {
        name: 'proposals.create',
        displayName: 'Enviar Propuestas',
        description: 'Permite enviar propuestas en licitaciones externas',
        category: 'proposals'
      },
      {
        name: 'proposals.view',
        displayName: 'Ver Propuestas',
        description: 'Permite ver propuestas enviadas y recibidas',
        category: 'proposals'
      },
      {
        name: 'proposals.select',
        displayName: 'Seleccionar Propuestas',
        description: 'Permite seleccionar propuestas de proveedores en licitaciones propias',
        category: 'proposals'
      },
      {
        name: 'proposals.edit',
        displayName: 'Editar Propuestas',
        description: 'Permite editar propuestas enviadas',
        category: 'proposals'
      },

      // Financial Permissions
      {
        name: 'finance.view',
        displayName: 'Ver Información Financiera',
        description: 'Permite ver información financiera y de facturación',
        category: 'finance'
      },
      {
        name: 'finance.manage',
        displayName: 'Gestionar Finanzas',
        description: 'Permite gestionar cuentas bancarias y productos financieros',
        category: 'finance'
      },

      // Document Management Permissions
      {
        name: 'documents.upload',
        displayName: 'Subir Documentos',
        description: 'Permite subir documentos a la empresa',
        category: 'documents'
      },
      {
        name: 'documents.view',
        displayName: 'Ver Documentos',
        description: 'Permite ver documentos de la empresa',
        category: 'documents'
      },
      {
        name: 'documents.delete',
        displayName: 'Eliminar Documentos',
        description: 'Permite eliminar documentos de la empresa',
        category: 'documents'
      },

      // Gallery Management Permissions
      {
        name: 'gallery.upload',
        displayName: 'Subir Imágenes',
        description: 'Permite subir imágenes a la galería de la empresa',
        category: 'gallery'
      },
      {
        name: 'gallery.manage',
        displayName: 'Gestionar Galería',
        description: 'Permite gestionar imágenes de la galería',
        category: 'gallery'
      },

      // Certification Management Permissions
      {
        name: 'certifications.upload',
        displayName: 'Subir Certificaciones',
        description: 'Permite subir certificaciones y homologaciones',
        category: 'certifications'
      },
      {
        name: 'certifications.manage',
        displayName: 'Gestionar Certificaciones',
        description: 'Permite gestionar certificaciones y homologaciones',
        category: 'certifications'
      },
    ];

    let inserted = 0;
    let skipped = 0;

    // Insert permissions
    for (const permission of permissions) {
      const [created, wasCreated] = await Permissions.findOrCreate({
        where: { name: permission.name },
        defaults: permission
      });
      
      if (wasCreated) {
        inserted++;
        console.log(`✅ Created permission: ${permission.name}`);
      } else {
        skipped++;
        console.log(`⏭️  Skipped existing permission: ${permission.name}`);
      }
    }

    console.log('🎉 Permissions seeding completed successfully!');
    console.log(`📊 Total permissions: ${permissions.length}`);
    console.log(`✅ Inserted: ${inserted}`);
    console.log(`⏭️  Skipped: ${skipped}`);

    await sequelize.close();
    console.log('🔒 Database connection closed');

  } catch (error) {
    console.error('❌ Error seeding permissions:', error.message);
    console.error('Stack trace:', error.stack);
    throw error;
  }
};

// Run if this file is executed directly
if (require.main === module) {
  seedPermissionsOnly();
}

module.exports = seedPermissionsOnly;
