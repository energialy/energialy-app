"use client";

import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  ReferenceInput,
  SelectInput,
  required,
} from 'react-admin';

const transform = (data) => {
  console.log('[SubcategoryEdit] Original data:', data);
  
  // Transformar CategoryId a categoryId para el backend
  const transformed = {
    ...data,
    categoryId: data.CategoryId,
  };
  
  // Remover campos que no deben enviarse
  delete transformed.CategoryId;
  delete transformed.parentCategory;
  
  console.log('[SubcategoryEdit] Transformed data:', transformed);
  return transformed;
};

export const SubcategoryEdit = () => (
  <Edit title="Editar Subcategoría" transform={transform}>
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
      <ReferenceInput 
        source="CategoryId" 
        reference="categories" 
        label="Categoría"
      >
        <SelectInput optionText="name" validate={[required()]} />
      </ReferenceInput>
      <BooleanInput 
        source="isActive" 
        label="Activa" 
      />
    </SimpleForm>
  </Edit>
);
