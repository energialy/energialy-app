"use client";

import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  BooleanInput,
  ReferenceInput,
  SelectInput,
  required,
} from 'react-admin';

export const SubcategoryCreate = () => (
  <Create title="Crear Nueva Subcategoría">
    <SimpleForm>
      <TextInput 
        source="name" 
        label="Nombre" 
        validate={[required()]} 
        fullWidth 
      />
      <ReferenceInput 
        source="categoryId" 
        reference="categories" 
        label="Categoría"
      >
        <SelectInput optionText="name" validate={[required()]} />
      </ReferenceInput>
      <BooleanInput 
        source="isActive" 
        label="Activa" 
        defaultValue={true} 
      />
    </SimpleForm>
  </Create>
);
