"use client";

import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  BooleanInput,
  required,
} from 'react-admin';

export const LocationCreate = () => (
  <Create title="Crear Nueva Ubicación" redirect="list">
    <SimpleForm>
      <TextInput 
        source="name" 
        label="Nombre" 
        validate={[required()]} 
        fullWidth 
      />
      <BooleanInput 
        source="isActive" 
        label="Activa" 
        defaultValue={true} 
      />
    </SimpleForm>
  </Create>
);
