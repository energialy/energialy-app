"use client";

import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  EditButton,
  DeleteButton,
  CreateButton,
} from 'react-admin';

export const CategoryList = () => (
  <List>
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="name" label="Nombre" />
      <BooleanField source="isActive" label="Activa" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
