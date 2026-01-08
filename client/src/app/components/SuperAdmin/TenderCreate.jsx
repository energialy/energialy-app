"use client";

import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  DateInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  BooleanInput,
  ReferenceArrayInput,
  SelectArrayInput,
  required,
  ArrayInput,
  SimpleFormIterator,
} from 'react-admin';

const transform = (data) => {
  console.log('[TenderCreate] Original data:', data);
  
  // Transformar los datos al formato esperado por el backend
  const transformed = {
    title: data.title,
    description: data.description,
    contractType: data.contractType,
    majorSector: data.majorSector,
    projectDuration: data.projectDuration,
    budget: data.budget,
    validityDate: data.validityDate,
    locationId: data.locationId,
    subcategories: data.subcategories || [],
    companyId: data.companyId,
    address: data.address,
    public: data.public !== false, // Default true
    showBudget: data.showBudget !== false, // Default true
    status: data.status || 'published',
    isActive: data.isActive !== false, // Default true
    customFields: data.customFields || [],
    priceType: data.priceType || 'fixed',
    priceUnit: data.priceUnit,
    servicePrices: data.servicePrices || [],
  };
  
  console.log('[TenderCreate] Transformed data:', transformed);
  return transformed;
};

export const TenderCreate = () => (
  <Create title="Crear Nueva Licitación" transform={transform}>
    <SimpleForm className="p-6 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información Básica */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Información Básica</h3>
        </div>
        
        <div className="md:col-span-2">
          <TextInput 
            source="title" 
            label="Título" 
            validate={[required()]} 
            fullWidth 
            className="w-full"
          />
        </div>
        
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
        
        <ReferenceInput 
          source="companyId" 
          reference="companies" 
          label="Empresa"
          className="w-full"
        >
          <SelectInput optionText="name" validate={[required()]} className="w-full" />
        </ReferenceInput>
        
        <SelectInput 
          source="contractType" 
          label="Tipo de Contrato"
          choices={[
            { id: 'Licitación área (Licitación pública de área)', name: 'Licitación área' },
            { id: 'Servicio completo (Desarrollo total de un proyecto)', name: 'Servicio completo' },
            { id: 'Individual (Servicio específico en un proyecto)', name: 'Individual' },
          ]}
          validate={[required()]}
          className="w-full"
        />
        
        {/* Clasificación */}
        <div className="md:col-span-2 mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Clasificación</h3>
        </div>
        
        <SelectInput 
          source="majorSector" 
          label="Sector Principal"
          choices={[
            { id: 'Upstream', name: 'Upstream' },
            { id: 'Midstream', name: 'Midstream' },
            { id: 'Downstream', name: 'Downstream' },
          ]}
          validate={[required()]}
          className="w-full"
        />
        
        <ReferenceArrayInput 
          source="subcategories" 
          reference="subcategories" 
          label="Subcategorías"
          className="w-full"
        >
          <SelectArrayInput optionText="name" validate={[required()]} className="w-full" />
        </ReferenceArrayInput>
        
        {/* Ubicación y Duración */}
        <div className="md:col-span-2 mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Ubicación y Duración</h3>
        </div>
        
        <ReferenceInput 
          source="locationId" 
          reference="locations" 
          label="Ubicación"
          className="w-full"
        >
          <SelectInput optionText="name" validate={[required()]} className="w-full" />
        </ReferenceInput>
        
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
        
        <div className="md:col-span-2">
          <TextInput 
            source="address" 
            label="Dirección" 
            fullWidth 
            className="w-full"
          />
        </div>
        
        {/* Detalles Financieros */}
        <div className="md:col-span-2 mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Detalles Financieros</h3>
        </div>
        
        <NumberInput 
          source="budget" 
          label="Presupuesto" 
          validate={[required()]} 
          className="w-full"
        />
        
        <DateInput 
          source="validityDate" 
          label="Fecha de Validez" 
          validate={[required()]} 
          className="w-full"
        />
        
        <SelectInput 
          source="priceType" 
          label="Tipo de Precio"
          choices={[
            { id: 'fixed', name: 'Precio Fijo' },
            { id: 'per_unit', name: 'Por Unidad' },
          ]}
          defaultValue="fixed"
          className="w-full"
        />
        
        <TextInput 
          source="priceUnit" 
          label="Unidad de Precio" 
          helperText="Ej: kilómetro, hora, día, etc."
          className="w-full"
        />
        
        {/* Configuración */}
        <div className="md:col-span-2 mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Configuración</h3>
        </div>
        
        <SelectInput 
          source="status" 
          label="Estado"
          choices={[
            { id: 'published', name: 'Publicada' },
            { id: 'expired', name: 'Expirada' },
            { id: 'working', name: 'En progreso' },
            { id: 'completed', name: 'Completada' },
            { id: 'cancelled', name: 'Cancelada' },
          ]}
          defaultValue="published"
          className="w-full"
        />
        
        <div className="flex gap-4">
          <BooleanInput 
            source="public" 
            label="Pública" 
            defaultValue={true} 
          />
          <BooleanInput 
            source="showBudget" 
            label="Mostrar Presupuesto" 
            defaultValue={true} 
          />
          <BooleanInput 
            source="isActive" 
            label="Activa" 
            defaultValue={true} 
          />
        </div>
        
        {/* Campos Personalizados */}
        <div className="md:col-span-2 mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Campos Personalizados</h3>
        </div>
        
        <div className="md:col-span-2">
          <ArrayInput source="customFields" label="Campos Adicionales" className="w-full">
            <SimpleFormIterator inline className="bg-gray-50 p-4 rounded">
              <TextInput source="fieldName" label="Nombre del campo" className="w-full" />
              <SelectInput 
                source="fieldType" 
                label="Tipo" 
                choices={[
                  { id: 'text', name: 'Texto' },
                  { id: 'number', name: 'Número' },
                  { id: 'date', name: 'Fecha' },
                  { id: 'select', name: 'Selección' },
                ]}
                className="w-full"
              />
              <BooleanInput source="required" label="Requerido" />
            </SimpleFormIterator>
          </ArrayInput>
        </div>
        
        {/* Precios por Servicio */}
        <div className="md:col-span-2 mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Precios por Servicio</h3>
        </div>
        
        <div className="md:col-span-2">
          <ArrayInput source="servicePrices" label="Servicios y Precios" className="w-full">
            <SimpleFormIterator inline className="bg-gray-50 p-4 rounded">
              <TextInput source="serviceName" label="Nombre del servicio" className="w-full" />
              <NumberInput source="price" label="Precio" className="w-full" />
              <TextInput source="unit" label="Unidad" className="w-full" />
            </SimpleFormIterator>
          </ArrayInput>
        </div>
      </div>
    </SimpleForm>
  </Create>
);
