"use client";

import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  required,
} from 'react-admin';

export const LocationEdit = () => (
  <Edit title="Editar Ubicación">
    <SimpleForm>
      <TextInput 
        source="id" 
        label="ID" 
        disabled 
        fullWidth 
      />
      <TextInput 
        source="name" 
        label="Nombre" 
        validate={[required()]} 
        fullWidth 
      />
      <BooleanInput 
        source="isActive" 
        label="Activa" 
      />
    </SimpleForm>
  </Edit>
);
