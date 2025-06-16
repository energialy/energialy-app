# Sistema de Colaboradores - Energialy API

## 🚀 Nuevo Sistema Implementado

Se ha implementado un sistema completo de gestión de colaboradores que permite a las empresas:

### **Roles de Usuario**
- `company_owner`: Propietario de la empresa (acceso total)
- `company_collaborator`: Colaborador con permisos específicos
- `admin`, `superAdmin`, `bank`: Roles existentes sin cambios

### **Funcionalidades Principales**

#### 1. **Invitar Colaboradores**
```javascript
POST /api/collaborators/invite
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "colaborador@ejemplo.com",
  "firstName": "Juan",
  "lastName": "Pérez",
  "position": "Gerente de Proyectos",
  "permissions": [
    "tenders.view",
    "tenders.create",
    "proposals.view",
    "messages.respond"
  ]
}
```

#### 2. **Aceptar Invitación**
```javascript
POST /api/collaborators/accept-invitation
Content-Type: application/json

{
  "invitationToken": "abc123...",
  "password": "mi-contraseña-segura"
}
```

#### 3. **Gestionar Colaboradores**
```javascript
// Obtener colaboradores de la empresa
GET /api/collaborators/company-collaborators
Authorization: Bearer <token>

// Actualizar permisos
PUT /api/collaborators/permissions/:collaboratorId
Authorization: Bearer <token>
{
  "permissions": ["tenders.view", "messages.send"]
}

// Remover colaborador
DELETE /api/collaborators/:collaboratorId
Authorization: Bearer <token>
```

#### 4. **Ver Permisos Disponibles**
```javascript
GET /api/collaborators/permissions
Authorization: Bearer <token>
```

## 📋 Permisos Disponibles

### **Gestión de Empresa** (`company`)
- `company.profile.edit` - Editar Perfil de Empresa
- `company.profile.view` - Ver Perfil de Empresa
- `company.users.invite` - Invitar Colaboradores
- `company.users.manage` - Gestionar Colaboradores

### **Mensajería** (`messages`)
- `messages.send` - Enviar Mensajes
- `messages.view` - Ver Mensajes
- `messages.respond` - Responder Mensajes

### **Licitaciones** (`tenders`)
- `tenders.create` - Crear Licitación Propia
- `tenders.edit` - Editar Licitaciones
- `tenders.delete` - Eliminar Licitaciones
- `tenders.view` - Ver Licitaciones

### **Propuestas** (`proposals`)
- `proposals.create` - Enviar Propuestas
- `proposals.view` - Ver Propuestas
- `proposals.select` - Seleccionar Propuestas
- `proposals.edit` - Editar Propuestas

### **Finanzas** (`finance`)
- `finance.view` - Ver Información Financiera
- `finance.manage` - Gestionar Finanzas

### **Documentos** (`documents`)
- `documents.upload` - Subir Documentos
- `documents.view` - Ver Documentos
- `documents.delete` - Eliminar Documentos

### **Galería** (`gallery`)
- `gallery.upload` - Subir Imágenes
- `gallery.manage` - Gestionar Galería

### **Certificaciones** (`certifications`)
- `certifications.upload` - Subir Certificaciones
- `certifications.manage` - Gestionar Certificaciones

## 🔒 Middleware de Permisos

### Para usar en rutas existentes:
```javascript
const { checkPermission } = require('../middlewares/checkPermissions');

// Ejemplo: Solo usuarios con permiso para crear licitaciones
router.post('/tenders', verifyJWT, checkPermission('tenders.create'), createTender);

// Ejemplo: Solo propietarios de empresa
router.post('/invite', verifyJWT, checkCompanyOwnership, inviteCollaborator);
```

## 📧 Sistema de Invitaciones

1. **Invitación**: El propietario envía invitación por email
2. **Email**: Se envía email con link de activación (válido 7 días)
3. **Aceptación**: El invitado crea su contraseña
4. **Activación**: Usuario queda activo con permisos asignados

## 🗃️ Nuevas Tablas

### **Permissions**
- Lista de todos los permisos disponibles
- Organizados por categorías
- Pueden activarse/desactivarse

### **CompanyInvitations**
- Gestiona invitaciones pendientes
- Tokens de seguridad únicos
- Fecha de expiración automática

### **Users (Modificada)**
- Nuevos campos: `permissions`, `invitedBy`, `invitationStatus`
- Nuevos roles: `company_owner`, `company_collaborator`

## 🚀 Próximos Pasos

1. **Ejecutar migraciones**: Usar el archivo SQL proporcionado
2. **Actualizar rutas existentes**: Agregar middleware de permisos
3. **Frontend**: Implementar interfaces de gestión
4. **Testing**: Probar todos los flujos de invitación

## 📝 Notas de Seguridad

- ✅ Tokens de invitación únicos y seguros
- ✅ Invitaciones con expiración automática
- ✅ Validación de permisos en cada endpoint
- ✅ Separación clara entre roles y permisos
- ✅ Logs de actividad de invitaciones
