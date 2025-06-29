# Sistema de Notificaciones Energialy

## 🎯 Descripción

Sistema completo de notificaciones para la plataforma Energialy que incluye:

- **Notificaciones en la plataforma**: Almacenadas en base de datos y mostradas en tiempo real
- **Emails estilizados**: Plantillas profesionales con diseño responsive 
- **Notificaciones al admin**: Copias automáticas para monitoreo
- **API REST completa**: Endpoints para gestionar todas las notificaciones

## 📧 Tipos de Notificaciones Implementadas

### ✅ Con Estilo (Usuarios/Empresas + Copia al Admin)

1. **Mensajes de Chat** - Cuando recibe un mensaje vía chat
2. **Nueva Cuenta** - Cuando crea una nueva cuenta 
3. **Licitación Publicada** - Cuando publica una licitación
4. **Propuesta Recibida** - Cuando recibe una propuesta
5. **Propuesta Aceptada** - Cuando acepta una propuesta
6. **Contrato Adjudicado** - Cuando es contratado
7. **Proyecto Completado** - Cuando completa una licitación
8. **Licitación Cancelada** - Cuando anula una licitación aceptada
9. **Cuenta Bancaria Aprobada/Rechazada** - Estados de apertura de cuenta
10. **Producto Financiero** - Solicitud/Aprobación/Rechazo de productos financieros

### 📋 Sin Estilo (Solo Admin)

1. **Solicitud de Apertura de Cuenta** - Cuando un usuario solicita apertura
2. **Estado de Cuenta Bancaria** - Cuando se aprueba/rechaza
3. **Solicitud de Producto Financiero** - Cuando un usuario solicita
4. **Estado de Producto Financiero** - Cuando se aprueba/rechaza

## 🚀 Instalación

### 1. Backend

#### Instalar dependencias (ya existentes)
```bash
# Las dependencias ya están instaladas:
# - sequelize (ORM)
# - resend (emails)
# - jsonwebtoken (auth)
```

#### Crear tabla de notificaciones
```bash
# Ejecutar en PostgreSQL:
psql -d your_database -f api/src/migrations/create_notifications_table.sql
```

#### Variables de entorno
```bash
# Agregar al archivo .env:
ADMIN_EMAIL=admin@energialy.ar
FRONTEND_URL=http://localhost:3002
RESEND_API_KEY=tu_clave_existente
```

### 2. Frontend

#### Componente de notificaciones
```jsx
// Ya creado en:
// client/src/app/components/Notifications.jsx

// Importar en tu layout o navbar:
import Notifications from '@/app/components/Notifications';

// Usar en el componente:
<Notifications />
```

#### Página completa de notificaciones
```jsx
// Ya creada en:
// client/src/app/dashboard/notifications/page.jsx
// Accesible en: /dashboard/notifications
```

## 🔧 Uso en Controladores

### Ejemplo 1: Registro de Usuario
```javascript
const notificationService = require('../services/notificationService');

const registerUser = async (userData) => {
  // 1. Crear usuario
  const newUser = await Users.create(userData);
  
  // 2. Enviar notificación de bienvenida
  try {
    await notificationService.notifyNewAccount({
      userId: newUser.id,
      userName: `${newUser.firstName} ${newUser.lastName}`,
      companyName: 'Energialy'
    });
  } catch (error) {
    console.error('Error sending welcome notification:', error);
    // No fallar el registro si falla la notificación
  }
  
  return newUser;
};
```

### Ejemplo 2: Envío de Mensaje
```javascript
const sendMessage = async (messageData) => {
  // 1. Crear mensaje
  const message = await Messages.create(messageData);
  
  // 2. Notificar al receptor
  const sender = await Users.findByPk(messageData.senderId, {
    include: [{ model: Companies }]
  });
  
  if (sender && sender.Company) {
    await notificationService.notifyChatMessage({
      recipientUserId: messageData.receiverId,
      senderName: `${sender.firstName} ${sender.lastName}`,
      senderCompanyName: sender.Company.name,
      messagePreview: messageData.content.substring(0, 100),
      conversationId: message.id
    });
  }
  
  return message;
};
```

### Ejemplo 3: Publicar Licitación
```javascript
const publishTender = async (tenderData, userId) => {
  // 1. Crear licitación
  const tender = await Tenders.create(tenderData);
  
  // 2. Notificar publicación
  const user = await Users.findByPk(userId, {
    include: [{ model: Companies }]
  });
  
  if (user && user.Company) {
    await notificationService.notifyTenderPublished({
      userId: userId,
      tenderTitle: tender.title,
      companyName: user.Company.name,
      tenderAmount: tender.budget,
      tenderId: tender.id
    });
  }
  
  return tender;
};
```

## 🎨 API Endpoints

### Obtener notificaciones del usuario
```http
GET /api/notifications
Authorization: Bearer {token}

Query params:
- page: número de página (default: 1)
- limit: límite por página (default: 20) 
- unreadOnly: solo no leídas (true/false)
```

### Obtener contador de no leídas
```http
GET /api/notifications/unread-count
Authorization: Bearer {token}
```

### Marcar notificación como leída
```http
PATCH /api/notifications/{id}/read
Authorization: Bearer {token}
```

### Marcar todas como leídas
```http
PATCH /api/notifications/mark-all-read
Authorization: Bearer {token}
```

## 🧪 Testing

### Ejecutar pruebas del sistema
```bash
cd api
node src/scripts/testNotificationSystem.js
```

### Probar invitación de colaboradores
```bash
cd api  
node src/scripts/testInvitation.js
```

## 📁 Archivos Creados/Modificados

### Backend
```
api/src/
├── models/Notifications.js                    # Modelo de notificaciones
├── services/notificationService.js            # Servicio principal
├── services/emailTemplates.js                 # Plantillas de email (modificado)
├── controllers/notificationsController.js     # Controlador
├── handlers/notificationsHandler.js           # Handlers HTTP
├── routes/notifications.js                    # Rutas API
├── migrations/create_notifications_table.sql  # Migración DB
├── scripts/testNotificationSystem.js          # Script de pruebas
└── examples/notification-integration-examples.js # Ejemplos
```

### Frontend
```
client/src/app/
├── components/Notifications.jsx               # Componente dropdown
└── dashboard/notifications/page.jsx           # Página completa
```

## 🎯 Funcionalidades

### ✅ Implementado
- [x] Modelo de notificaciones en DB
- [x] Servicio completo de notificaciones  
- [x] 10+ tipos de notificaciones con emails estilizados
- [x] Notificaciones simples para admin
- [x] API REST completa
- [x] Componente frontend con dropdown
- [x] Página completa de notificaciones
- [x] Sistema de filtros y paginación
- [x] Contador de no leídas en tiempo real
- [x] Integración con sistema de emails existente

### 🔄 Pendiente (implementar según necesidad)
- [ ] WebSockets para notificaciones en tiempo real
- [ ] Notificaciones push en móvil
- [ ] Configuración de preferencias de usuario
- [ ] Notificaciones por categorías
- [ ] Digest semanal por email

## 💡 Notas Importantes

1. **Emails en desarrollo**: El sistema detecta emails de prueba (example.com, test.com) y los omite en desarrollo
2. **Fallback**: Si falla el envío de email, no falla la operación principal
3. **Performance**: Las notificaciones se almacenan localmente y se sincronizan con el servidor
4. **Escalabilidad**: El sistema está preparado para manejar miles de notificaciones por usuario
5. **Seguridad**: Todas las rutas de notificaciones requieren autenticación JWT

## 🆘 Resolución de Problemas

### Los emails no se envían
1. Verificar RESEND_API_KEY en .env
2. Verificar que el email no sea de dominio de prueba
3. Revisar logs del servidor para errores

### Las notificaciones no aparecen en frontend
1. Verificar que el token JWT esté válido
2. Revisar la consola del navegador para errores
3. Verificar que la tabla notifications exista en DB

### Error al crear notificaciones
1. Verificar que la migración de DB se ejecutó correctamente
2. Verificar que el modelo está importado en db.js
3. Revisar relaciones entre User y Notifications

## 🚀 Siguiente Paso

Para integrar completamente el sistema:

1. **Ejecutar migración de DB**
2. **Agregar variables de entorno**  
3. **Importar componente en navbar**
4. **Integrar notificaciones en controladores existentes**
5. **Probar con el script de testing**

¡El sistema está listo para usar! 🎉
