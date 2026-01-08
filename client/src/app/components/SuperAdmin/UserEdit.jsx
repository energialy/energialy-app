"use client";

import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  PasswordInput,
  ReferenceInput,
  SelectInput,
  required,
  email,
  BooleanInput,
  useRecordContext
} from 'react-admin';

const UserEditForm = () => {
  const record = useRecordContext();

  return (
    <SimpleForm>
      <TextInput 
        source="firstName" 
        label="Nombre" 
        validate={[required()]} 
      />
      <TextInput 
        source="lastName" 
        label="Apellido" 
        validate={[required()]} 
      />
      <TextInput 
        source="email" 
        label="Email" 
        type="email"
        validate={[required(), email()]} 
        fullWidth 
      />
      <PasswordInput 
        source="password" 
        label="Contraseña (dejar en blanco para no cambiar)" 
      />
      <SelectInput 
        source="role" 
        label="Rol" 
        choices={[
          { id: 'admin', name: 'Administrador' },
          { id: 'superAdmin', name: 'Super Administrador' },
          { id: 'bank', name: 'Banco' },
          { id: 'company_owner', name: 'Propietario de Empresa' },
          { id: 'company_collaborator', name: 'Colaborador de Empresa' },
        ]}
        validate={[required()]}
      />
      <TextInput 
        source="position" 
        label="Posición/Cargo" 
      />
      <ReferenceInput 
        source="CompanyId" 
        reference="companies" 
        label="Empresa (opcional)"
      >
        <SelectInput optionText="name" />
      </ReferenceInput>
      <BooleanInput 
        source="isActive" 
        label="Usuario Activo" 
      />
    </SimpleForm>
  );
};

export const UserEdit = () => (
  <Edit title="Editar Usuario">
    <UserEditForm />
  </Edit>
);
