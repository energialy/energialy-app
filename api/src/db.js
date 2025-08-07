require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
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
  },
  retry: {
    match: [
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/
    ],
    max: 3
  }
});
const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

modelDefiners.forEach((model) => model(sequelize));
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

const { Users, Messages, Companies, Categories, Subcategories, Locations, Tenders, Proposals, Documents, BankAccounts, FinanceProducts, CompanyGallery, CertificationGallery, CompanyInvitations, Permissions, Notifications, TenderInvitations, Subscriptions, CompanySubscriptions } = sequelize.models;

Companies.hasMany(Users);
Users.belongsTo(Companies);

// Notifications relationships
Users.hasMany(Notifications);
Notifications.belongsTo(Users);

Users.hasMany(Messages, { foreignKey: 'senderId', as: 'sentMessages' });
Users.hasMany(Messages, { foreignKey: 'receiverId', as: 'receivedMessages' });

Messages.belongsTo(Users, { foreignKey: 'senderId', as: 'sender' });
Messages.belongsTo(Users, { foreignKey: 'receiverId', as: 'receiver' });

Companies.belongsToMany(Categories, { through: 'Companies_Categories' });
Categories.belongsToMany(Companies, { through: 'Companies_Categories' });

Companies.belongsToMany(Subcategories, { through: 'Companies_Subcategories' });
Subcategories.belongsToMany(Companies, { through: 'Companies_Subcategories' });

Categories.hasMany(Subcategories);
Subcategories.belongsTo(Categories);

Companies.belongsToMany(Locations, { through: 'Companies_Locations' });
Locations.belongsToMany(Companies, { through: 'Companies_Locations' });

Locations.hasMany(Tenders);
Tenders.belongsTo(Locations);

Companies.hasMany(Tenders);
Tenders.belongsTo(Companies);

Tenders.belongsToMany(Categories, { through: 'Tenders_Categories' });
Categories.belongsToMany(Tenders, { through: 'Tenders_Categories' });

Tenders.belongsToMany(Subcategories, { through: 'Tenders_Subcategories' });
Subcategories.belongsToMany(Tenders, { through: 'Tenders_Subcategories' });

Tenders.hasMany(Proposals);
Proposals.belongsTo(Tenders);

Companies.hasMany(Proposals);
Proposals.belongsTo(Companies);

Companies.hasMany(Documents);
Documents.belongsTo(Companies);

Companies.hasOne(BankAccounts);
BankAccounts.belongsTo(Companies);

BankAccounts.hasMany(FinanceProducts);
FinanceProducts.belongsTo(BankAccounts);

Companies.hasMany(CompanyGallery);
CompanyGallery.belongsTo(Companies);

Companies.hasMany(CertificationGallery);
CertificationGallery.belongsTo(Companies);

// Company Invitations relationships
Companies.hasMany(CompanyInvitations);
CompanyInvitations.belongsTo(Companies);

Users.hasMany(CompanyInvitations, { foreignKey: 'invitedBy', as: 'sentInvitations' });
CompanyInvitations.belongsTo(Users, { foreignKey: 'invitedBy', as: 'inviter' });

// User self-reference for invitation hierarchy
Users.hasMany(Users, { foreignKey: 'invitedBy', as: 'invitedUsers' });
Users.belongsTo(Users, { foreignKey: 'invitedBy', as: 'inviter' });

// TenderInvitations relationships
Tenders.hasMany(TenderInvitations);
TenderInvitations.belongsTo(Tenders);

Users.hasMany(TenderInvitations, { foreignKey: 'userId', as: 'receivedInvitations' });
TenderInvitations.belongsTo(Users, { foreignKey: 'userId', as: 'user' });

Users.hasMany(TenderInvitations, { foreignKey: 'invitedBy', as: 'sentTenderInvitations' });
TenderInvitations.belongsTo(Users, { foreignKey: 'invitedBy', as: 'invitedByUser' });

// Subscriptions relationships
Companies.hasMany(CompanySubscriptions);
CompanySubscriptions.belongsTo(Companies);

Subscriptions.hasMany(CompanySubscriptions);
CompanySubscriptions.belongsTo(Subscriptions);

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};
