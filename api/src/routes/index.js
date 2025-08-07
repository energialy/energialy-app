const { Router } = require('express');

const registerRouter = require('./register');
const authRouter = require('./auth');
const refreshRouter = require('./refresh');
const logoutRouter = require('./logout');
const verifyJWT = require('../middlewares/verifyJWT');
const usersRouter = require('./resources/usersRouter');
const companiesRouter = require('./resources/companiesRouter');
const categoriesRouter = require('./resources/categoriesRouter');
const subcategoriesRouter = require('./resources/subcategoriesRouter');
const locationsRouter = require('./resources/locationsRouter');
const tendersRouter = require('./resources/tendersRouter');
const proposalsRouter = require('./resources/proposalsRouter');
const documentsRouter = require('./resources/documentsRouter');
const bankAccountsRouter = require('./resources/bankAccountsRouter');
const financeProductsRouter = require('./resources/financeProductsRouter');
const inviteCompaniesRouter = require('./resources/inviteCompaniesRouter');
const messagesRouter = require('./resources/messagesRouter');
const galleryRouter = require('./resources/CompanyGalleryRouter');
const certificationRouter = require('./resources/certificationGalleryRouter');
const subscriptionsRouter = require('./resources/subscriptionsRouter');
const companySubscriptionsRouter = require('./resources/companySubscriptionsRouter');
const collaboratorsRouter = require('./collaborators');
const notificationsRouter = require('./notifications');
const tenderInvitationsRouter = require('./tenderInvitations');
const router = Router();

// Auth Server
router.use('/register', registerRouter);
router.use('/auth', authRouter);
router.use('/refresh', refreshRouter);
router.use('/logout', logoutRouter);

// Collaborators routes (some public, some protected)
router.use('/collaborators', collaboratorsRouter);

// Notifications routes (protected)
router.use('/notifications', notificationsRouter);

// Resource Server
// router.use(verifyJWT);
router.use('/users', usersRouter);
router.use('/messages', messagesRouter);
router.use('/companies', companiesRouter);
router.use('/categories', categoriesRouter);
router.use('/subcategories', subcategoriesRouter);
router.use('/locations', locationsRouter);
router.use('/tenders', tendersRouter);
router.use('/tenders', tenderInvitationsRouter); // Para las rutas de invitaciones
router.use('/proposals', proposalsRouter);
router.use('/documents', documentsRouter);
router.use('/bankAccounts', bankAccountsRouter);
router.use('/financeProducts', financeProductsRouter);

router.use('/inviteCompanies', inviteCompaniesRouter);

router.use('/gallery', galleryRouter);
router.use('/certification', certificationRouter);

// Subscription management routes
router.use('/subscriptions', subscriptionsRouter);
router.use('/companySubscriptions', companySubscriptionsRouter);

module.exports = router;
