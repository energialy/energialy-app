"use client";

import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  BooleanInput,
  ReferenceArrayInput,
  SelectArrayInput,
  ArrayInput,
  SimpleFormIterator,
  required
} from 'react-admin';

const transform = (data) => {
  console.log('[TenderEdit] Original data:', data);
  
  // Transformar subcategoryIds a subcategories para el backend
  const transformed = {
    ...data,
    subcategories: data.subcategoryIds || data.subcategories || [],
    locationId: data.LocationId,
    companyId: data.CompanyId,
  };
  
  // Remover campos que no deben enviarse al backend
  delete transformed.subcategoryIds;
  delete transformed.LocationId;
  delete transformed.CompanyId;
  delete transformed.company;
  delete transformed.location;
  
  console.log('[TenderEdit] Transformed data:', transformed);
  return transformed;
};

export const TenderEdit = () => (
  <Edit title="Editar Licitación" transform={transform}>
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
          source="CompanyId" 
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
        
        <ReferenceInput 
          source="LocationId" 
          reference="locations" 
          label="Ubicación"
          className="w-full"
        >
          <SelectInput optionText="name" validate={[required()]} className="w-full" />
        </ReferenceInput>
        
        <div className="md:col-span-2">
          <ReferenceArrayInput 
            source="subcategoryIds" 
            reference="subcategories" 
            label="Subcategorías"
            className="w-full"
          >
            <SelectArrayInput optionText="name" validate={[required()]} className="w-full" />
          </ReferenceArrayInput>
        </div>
        
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
        
        <DateInput 
          source="validityDate" 
          label="Fecha de Validez" 
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
        
        {/* Presupuesto y Precios */}
        <div className="md:col-span-2 mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Presupuesto y Precios</h3>
        </div>
        
        <NumberInput 
          source="budget" 
          label="Presupuesto" 
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
          className="w-full"
        />
        
        <div className="md:col-span-2">
          <TextInput 
            source="priceUnit" 
            label="Unidad de Precio" 
            helperText="Ej: kilómetro, hora, día, etc. (requerido si priceType es 'per_unit')"
            fullWidth 
            className="w-full"
          />
        </div>
        
        {/* Configuración */}
        <div className="md:col-span-2 mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Configuración</h3>
        </div>
        
        <div className="flex gap-6">
          <BooleanInput 
            source="public" 
            label="Pública" 
          />
          <BooleanInput 
            source="showBudget" 
            label="Mostrar Presupuesto" 
          />
          <BooleanInput 
            source="isActive" 
            label="Activa" 
          />
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
          className="w-full"
        />
        
        {/* Campos Personalizados */}
        <div className="md:col-span-2 mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Campos Personalizados</h3>
        </div>
        
        <div className="md:col-span-2">
          <ArrayInput source="customFields" label="Campos Personalizados" className="w-full">
            <SimpleFormIterator inline className="bg-gray-50 p-4 rounded">
              <TextInput source="fieldName" label="Nombre del campo" className="mr-2" />
              <SelectInput 
                source="fieldType" 
                label="Tipo" 
                choices={[
                  { id: 'text', name: 'Texto' },
                  { id: 'number', name: 'Número' },
                  { id: 'date', name: 'Fecha' },
                  { id: 'select', name: 'Selección' },
                ]}
                className="mr-2"
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
          <ArrayInput source="servicePrices" label="Precios por Servicio" className="w-full">
            <SimpleFormIterator inline className="bg-gray-50 p-4 rounded">
              <TextInput source="serviceName" label="Nombre del servicio" className="mr-2" />
              <NumberInput source="price" label="Precio" className="mr-2" />
              <TextInput source="unit" label="Unidad" />
            </SimpleFormIterator>
          </ArrayInput>
        </div>
      </div>
    </SimpleForm>
  </Edit>
);
