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
  ReferenceField,
  useRecordContext,
  BooleanField,
  ShowButton
} from 'react-admin';

const CompanySubscriptionListActions = () => (
  <TopToolbar>
    <CreateButton />
  </TopToolbar>
);

const CompanySubscriptionRowActions = () => {
  const record = useRecordContext();
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <ShowButton record={record} />
      <EditButton record={record} />
      <DeleteButton 
        record={record} 
        confirmTitle="Remover Suscripción"
        confirmContent="¿Estás seguro de que quieres remover esta suscripción de la empresa?"
      />
    </div>
  );
};

export const CompanySubscriptionList = () => (
  <List actions={<CompanySubscriptionListActions />} title="Suscripciones de Empresas">
    <Datagrid>
      <TextField source="id" label="ID" />
      <ReferenceField source="companyId" reference="companies" label="Empresa">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="subscriptionId" reference="subscriptions" label="Plan">
        <TextField source="name" />
      </ReferenceField>
      <DateField source="startDate" label="Fecha Inicio" />
      <DateField source="endDate" label="Fecha Fin" />
      <BooleanField source="isActive" label="Activa" />
      <TextField source="status" label="Estado" />
      <DateField source="createdAt" label="Asignada" />
      <CompanySubscriptionRowActions />
    </Datagrid>
  </List>
);
