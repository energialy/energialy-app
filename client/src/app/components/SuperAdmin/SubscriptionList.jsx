"use client";

import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  DeleteButton,
  CreateButton,
  TopToolbar,
  NumberField,
  ReferenceField,
  useRecordContext,
  BooleanField,
  ShowButton
} from 'react-admin';

const SubscriptionListActions = () => (
  <TopToolbar>
    <CreateButton />
  </TopToolbar>
);

const SubscriptionRowActions = () => {
  const record = useRecordContext();
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <ShowButton record={record} />
      <EditButton record={record} />
      <DeleteButton 
        record={record} 
        confirmTitle="Eliminar Suscripción"
        confirmContent="¿Estás seguro de que quieres eliminar esta suscripción?"
      />
    </div>
  );
};

export const SubscriptionList = () => (
  <List actions={<SubscriptionListActions />} title="Gestión de Suscripciones">
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="name" label="Nombre del Plan" />
      <TextField source="description" label="Descripción" />
      <NumberField source="price" label="Precio" />
      <TextField source="currency" label="Moneda" />
      <TextField source="duration" label="Duración (días)" />
      <NumberField source="maxTenders" label="Máx. Licitaciones" />
      <NumberField source="maxProposals" label="Máx. Propuestas" />
      <BooleanField source="isActive" label="Activa" />
      <DateField source="createdAt" label="Creada" />
      <SubscriptionRowActions />
    </Datagrid>
  </List>
);
