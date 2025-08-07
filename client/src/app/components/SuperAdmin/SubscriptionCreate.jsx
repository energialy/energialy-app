"use client";

import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  required
} from 'react-admin';

export const SubscriptionCreate = () => (
  <Create title="Crear Nueva Suscripción">
    <SimpleForm>
      <TextInput 
        source="name" 
        label="Nombre del Plan" 
        validate={[required()]} 
        fullWidth 
      />
      <TextInput 
        source="description" 
        label="Descripción" 
        multiline 
        rows={3} 
        fullWidth 
        validate={[required()]} 
      />
      <NumberInput 
        source="price" 
        label="Precio" 
        validate={[required()]} 
      />
      <TextInput 
        source="currency" 
        label="Moneda" 
        defaultValue="USD" 
        validate={[required()]} 
      />
      <NumberInput 
        source="duration" 
        label="Duración (días)" 
        validate={[required()]} 
        defaultValue={30}
      />
      <NumberInput 
        source="maxTenders" 
        label="Máximo de Licitaciones" 
        validate={[required()]} 
        defaultValue={10}
      />
      <NumberInput 
        source="maxProposals" 
        label="Máximo de Propuestas" 
        validate={[required()]} 
        defaultValue={50}
      />
      <BooleanInput 
        source="hasDocumentManagement" 
        label="Gestión de Documentos" 
        defaultValue={true} 
      />
      <BooleanInput 
        source="hasAdvancedReporting" 
        label="Reportes Avanzados" 
        defaultValue={false} 
      />
      <BooleanInput 
        source="hasPrioritySupport" 
        label="Soporte Prioritario" 
        defaultValue={false} 
      />
      <BooleanInput 
        source="isActive" 
        label="Plan Activo" 
        defaultValue={true} 
      />
      <TextInput 
        source="features" 
        label="Características (separadas por coma)" 
        multiline 
        rows={2} 
        fullWidth 
        helperText="Ej: Chat en tiempo real, Notificaciones push, etc."
      />
    </SimpleForm>
  </Create>
);
