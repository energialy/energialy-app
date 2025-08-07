"use client";

import React from 'react';
import { Card, CardContent, CardHeader } from 'react-admin';

export const AdminChat = () => {
  return (
    <Card>
      <CardHeader title="Chat General - Super Admin" />
      <CardContent>
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          border: '2px dashed #ccc', 
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <h3>🚧 En Desarrollo</h3>
          <p>
            El chat general para comunicación directa con usuarios estará disponible 
            cuando implementemos el nuevo dashboard de administrador.
          </p>
          <p>
            <strong>Funcionalidades planeadas:</strong>
          </p>
          <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
            <li>Chat en tiempo real con usuarios</li>
            <li>Lista de usuarios activos</li>
            <li>Historial de conversaciones</li>
            <li>Notificaciones de mensajes</li>
            <li>Respuestas rápidas predefinidas</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
