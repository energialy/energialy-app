"use client";

import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  BooleanInput,
  ArrayInput,
  SimpleFormIterator,
  required
} from 'react-admin';

const transform = (data) => {
  console.log('[ProposalCreate] Original data:', data);
  
  const transformed = {
    totalAmount: parseFloat(data.totalAmount),
    serviceFee: data.serviceFee ? parseFloat(data.serviceFee) : 1,
    serviceAmount: parseFloat(data.serviceAmount),
    receiverAmount: parseFloat(data.receiverAmount),
    projectDuration: data.projectDuration,
    description: data.description,
    attachments: data.attachments || [],
    status: data.status || 'sent',
    isActive: data.isActive !== false,
    tenderId: data.TenderId,
    companyId: data.CompanyId,
  };
  
  console.log('[ProposalCreate] Transformed data:', transformed);
  return transformed;
};

export const ProposalCreate = () => (
  <Create title="Crear Nueva Propuesta" transform={transform}>
    <SimpleForm className="p-6 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información Básica */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Información Básica</h3>
        </div>

        <ReferenceInput 
          source="TenderId" 
          reference="tenders" 
          label="Licitación"
          className="w-full"
        >
          <SelectInput optionText="title" validate={[required()]} className="w-full" />
        </ReferenceInput>

        <ReferenceInput 
          source="CompanyId" 
          reference="companies" 
          label="Empresa"
          className="w-full"
        >
          <SelectInput optionText="name" validate={[required()]} className="w-full" />
        </ReferenceInput>

        <div className="md:col-span-2">
          <TextInput 
            source="description" 
            label="Descripción" 
            multiline 
            rows={4} 
            fullWidth 
            validate={[required()]} 
            className="w-full"
          />
        </div>

        {/* Montos */}
        <div className="md:col-span-2 mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Montos</h3>
        </div>

        <NumberInput 
          source="totalAmount" 
          label="Monto Total" 
          validate={[required()]} 
          className="w-full"
        />

        <NumberInput 
          source="serviceFee" 
          label="Tarifa de Servicio (%)" 
          defaultValue={1}
          className="w-full"
        />

        {/* <NumberInput 
          source="serviceAmount" 
          label="Monto del Servicio" 
          validate={[required()]} 
          className="w-full"
        />

        <NumberInput 
          source="receiverAmount" 
          label="Monto a Recibir" 
          validate={[required()]} 
          className="w-full"
        /> */}

        {/* Detalles del Proyecto */}
        <div className="md:col-span-2 mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Detalles del Proyecto</h3>
        </div>

        <SelectInput 
          source="projectDuration" 
          label="Duración del Proyecto"
          choices={[
            { id: 'Menos de una semana', name: 'Menos de una semana' },
            { id: 'Menos de un mes', name: 'Menos de un mes' },
            { id: 'De 1 a 3 meses', name: 'De 1 a 3 meses' },
            { id: 'De 3 a 6 meses', name: 'De 3 a 6 meses' },
            { id: 'Más de 6 meses', name: 'Más de 6 meses' },
          ]}
          validate={[required()]}
          className="w-full"
        />

        <SelectInput 
          source="status" 
          label="Estado"
          choices={[
            { id: 'sent', name: 'Enviada' },
            { id: 'accepted', name: 'Aceptada' },
            { id: 'declined', name: 'Rechazada' },
          ]}
          defaultValue="sent"
          className="w-full"
        />

        <div className="md:col-span-2">
          <BooleanInput 
            source="isActive" 
            label="Activa" 
            defaultValue={true}
          />
        </div>

        {/* Adjuntos */}
        <div className="md:col-span-2 mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Adjuntos</h3>
        </div>

        <div className="md:col-span-2">
          <ArrayInput source="attachments" label="URLs de Archivos Adjuntos" className="w-full">
            <SimpleFormIterator inline className="bg-gray-50 p-4 rounded">
              <TextInput source="" label="URL del archivo" className="w-full" />
            </SimpleFormIterator>
          </ArrayInput>
        </div>
      </div>
    </SimpleForm>
  </Create>
);
