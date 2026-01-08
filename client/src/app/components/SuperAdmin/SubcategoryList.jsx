"use client";

import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  ReferenceField,
  EditButton,
  DeleteButton,
} from 'react-admin';

export const SubcategoryList = () => (
  <List>
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="name" label="Nombre" />
      <ReferenceField source="CategoryId" reference="categories" label="Categoría">
        <TextField source="name" />
      </ReferenceField>
      <BooleanField source="isActive" label="Activa" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
