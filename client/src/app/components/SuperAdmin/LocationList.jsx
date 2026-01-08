"use client";

import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  EditButton,
  DeleteButton,
} from 'react-admin';

export const LocationList = () => (
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
