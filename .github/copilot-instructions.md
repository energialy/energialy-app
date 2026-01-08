# Energialy - AI Coding Instructions

## Project Overview
Energialy is an Oil & Gas marketplace for tenders (licitaciones) built as a full-stack application with:
- **Backend API**: Node.js/Express REST API with PostgreSQL + Sequelize ORM
- **Frontend**: Next.js 14 with Redux Toolkit for state management
- **Real-time**: Socket.IO for messaging between companies
- **Deployment**: Vercel (both API and client)

## Architecture & Data Flow

### Three-Tier Controller Pattern
The API follows a strict separation: **Routes → Handlers → Controllers**
- **Routes** (`api/src/routes/`): Define endpoints and attach middleware
- **Handlers** (`api/src/handlers/`): Handle HTTP request/response, extract data, call controllers
- **Controllers** (`api/src/controllers/`): Business logic, database operations, return data

Example flow for tenders:
```
GET /tenders → tendersRouter → getTendersHandler → getAllTenders controller → returns cleaned data
```

### Database Architecture
Sequelize models in `api/src/models/` with relationships defined in `api/src/db.js`. Key entities:
- `Companies` ↔ `Users` (one-to-many)
- `Tenders` ↔ `Proposals` (one-to-many)
- `Tenders` ↔ `Categories`/`Subcategories` (many-to-many through join tables)
- `Users` ↔ `Notifications` (one-to-many)
- `TenderInvitations` for collaborative tender system

### Authentication & Authorization
JWT-based with access/refresh tokens:
- **verifyJWT middleware** (`api/src/middlewares/verifyJWT.js`): Validates Bearer token, attaches `req.user`, `req.userId`, `req.userRole`, `req.companyId`
- **checkPermission middleware** (`api/src/middlewares/checkPermissions.js`): Role-based access control
  - `superAdmin` and `admin`: Full access
  - Company users: Permission array (`INSTITUCIONAL`, `COMUNICACIONES`, `LICITACIONES`, `FINANZAS`)
- Access token in headers: `Authorization: Bearer <token>`
- Refresh token in HTTP-only cookie

### Frontend State Management
Redux Toolkit with feature-based slices:
- **Slices**: `userSlice`, `tenderSlice`, `companieSlice` in `client/src/app/redux/features/`
- **RTK Query services**: API endpoints in `client/src/app/redux/services/` (e.g., `companiesApi.js`, `ProposalApi.js`)
- **Usage pattern**: Components use `useSelector` to read state, `useDispatch` for actions
- **API base URL**: `process.env.NEXT_PUBLIC_BASE_URL` (configured per environment)

### Real-time Messaging (Socket.IO)
- Server: `api/src/server.js` initializes Socket.IO with user authentication
- Client connects with `companyId`, stored in `userSockets` map
- Events: `authenticate`, `sendMessage`, `message` (received)
- Used for company-to-company communication in marketplace

## Development Workflows

### Local Development Setup
```bash
# Backend (from api/)
npm install
# Create .env with: DB_USER, DB_PASSWORD, DB_HOST=localhost:5432, DB_NAME=energialy
# SSL_MODE leave empty, BASE_URL=http://localhost:3000
# Generate secrets: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
npm start  # Runs on :3001

# Frontend (from client/)
npm install
npm run dev  # Runs on :3000
```

### Database Operations
- **Migrations**: Manual SQL scripts in `api/src/migrations/` - run via psql or pgAdmin
- **Seeds**: `npm run seed` (full seed), `npm run seed:permissions` (permissions only)
- **Sync**: `index.js` uses `{ force: true }` in development (recreates tables), `{ force: false }` in production

### Key Scripts (API)
- `npm start`: Nodemon for hot reload
- `npm run migrate:tender-invitations`: Run specific migration via Node script
- `npm run test:invitations`: Test invitation system

## Project-Specific Conventions

### Data Cleaning Pattern
Controllers return "cleaned" data objects to standardize API responses. See `cleanTenders()` in `tendersController.js`:
- Maps Sequelize models to clean objects
- Handles both arrays and single objects
- Includes related data (company, location, subcategories, proposals)
- Always include `customFields`, `priceType`, `servicePrices` for tenders (new pricing features)

### File Uploads (Cloudinary)
- **Service**: `api/src/middlewares/cloudinaryService.js`
- Functions: `handleUpload` (single), `handleUploadFiles` (multiple)
- Uses buffer streams, returns `{ public_id, url }`
- Models with galleries: `CompanyGallery`, `CertificationGallery`

### Email Notifications (Resend)
- **Service**: `api/src/services/notificationService.js`
- `NotificationService` class handles all email sending
- Templates in `emailTemplates.js`
- Env var: `RESEND_API_KEY`, `ADMIN_EMAIL`
- Notifications also stored in DB via `Notifications` model

### Frontend Image Handling
Next.js Image domains configured in `next.config.js`:
- Cloudinary: `res.cloudinary.com/energialy/**` and `/dbraa6jpj/**`
- Always use `next/image` for external images

### Path Aliases
The project uses `@/` alias for cleaner imports:
- **Configuration**: Both `jsconfig.json` and `tsconfig.json` map `@/*` to `./src/*`
- **Usage**: `import { Component } from '@/app/components/Component'`
- **Applies to**: All files in `client/src/` directory
- Always use `@/` instead of relative paths (`../../`) for better maintainability

### Error Handling Pattern
```javascript
// Handler level
try {
  const result = await controller();
  res.status(200).json(result);
} catch (error) {
  res.status(error.status || 500).json({ error: error.message });
}
```

### Frontend API Calls
- **Pattern**: Axios with token from sessionStorage/localStorage
- **Helper**: `getAccessToken()` from `client/src/app/Func/sessionStorage.js`
- **Headers**: Always include `Authorization: Bearer ${token}` and `Content-Type: application/json`

## Common Patterns

### Adding New Resources
1. Create Sequelize model in `api/src/models/`
2. Define relationships in `api/src/db.js`
3. Create controller in `api/src/controllers/`
4. Create handler in `api/src/handlers/`
5. Create router in `api/src/routes/resources/`
6. Register router in `api/src/routes/index.js`
7. Optional: Add middleware (verifyJWT, checkPermission)

### Working with Permissions
- Permissions stored as array in Users table
- Check via `checkPermission('LICITACIONES')` middleware
- Available permissions: `INSTITUCIONAL`, `COMUNICACIONES`, `LICITACIONES`, `FINANZAS`, `ALL` (for admins)

### Tender System Features
- Custom fields support: `customFields` JSONB array
- Pricing types: `fixed` (single budget) or `per_service` (servicePrices array)
- Invitation system: `TenderInvitations` for private/collaborative tenders
- Status flow: Draft → Active → In Progress → Completed

## Testing & Debugging
- Console logging is extensive - check terminal output for auth/permission flows
- Socket.IO connection logs show real-time activity
- Database sync errors logged on startup
- Frontend: Check browser console for token/API issues
