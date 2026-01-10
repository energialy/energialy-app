"use client";

import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  ReferenceArrayInput,
  SelectArrayInput,
  required,
} from 'react-admin';
import ImageUploadField from './ImageUploadField';

const transform = (data) => {
  console.log('[CompanyCreate] Original data:', data);
  
  // Transformar los datos al formato esperado por el backend
  const transformed = {
    name: data.name,
    description: data.description,
    locations: data.locations || [],
    subcategories: data.subcategories || [],
    foundationYear: data.foundationYear,
    annualRevenue: data.annualRevenue,
    employeeCount: data.employeeCount,
    cuit: data.cuit,
    profilePicture: data.profilePicture || null,
    bannerPicture: data.bannerPicture || null,
    organizationType: data.organizationType,
    userId: data.userId,
  };
  
  console.log('[CompanyCreate] Transformed data:', transformed);
  return transformed;
};

export const CompanyCreate = () => (
  <Create title="Crear Nueva Empresa" transform={transform}>
    <SimpleForm className="p-6 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Información Básica */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Información Básica</h3>
        </div>
        
        <div className="md:col-span-2">
          <TextInput 
            source="name" 
            label="Nombre de la Empresa" 
            validate={[required()]} 
            fullWidth 
            className="w-full"
          />
        </div>
        
        <div className="md:col-span-2">
          <TextInput 
            source="description" 
            label="Descripción de la Empresa" 
            multiline 
            rows={4} 
            fullWidth 
            validate={[required()]} 
            className="w-full"
          />
        </div>
        
        <NumberInput 
          source="foundationYear" 
          label="Año de Fundación" 
          validate={[required()]} 
          helperText="Ej: 1990"
          className="w-full"
        />
        
        <TextInput 
          source="cuit" 
          label="CUIT de la Empresa" 
          validate={[required()]} 
          className="w-full"
        />
        
        {/* Tipo de Organización y Datos Financieros */}
        <div className="md:col-span-2 mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Tipo de Organización y Datos</h3>
        </div>
        
        <SelectInput 
          source="organizationType" 
          label="Tipo de Organización"
          choices={[
            { id: 'Organismo Público', name: 'Organismo Público' },
            { id: 'Operadora', name: 'Operadora' },
            { id: 'PyME', name: 'PyME' },
            { id: 'Cámara/Cluster/Federación', name: 'Cámara/Cluster/Federación' },
            { id: 'Profesional independiente', name: 'Profesional independiente' },
            { id: 'Servicios especiales', name: 'Servicios especiales' },
          ]}
          validate={[required()]}
          className="w-full"
        />
        
        <SelectInput 
          source="annualRevenue" 
          label="Ingresos Anuales"
          choices={[
            { id: 'No Revelado', name: 'No Revelado' },
            { id: '0 - 10M U$S', name: '0 - 10M U$S' },
            { id: '10M - 100M U$D', name: '10M - 100M U$D' },
            { id: '100M - 1B U$S', name: '100M - 1B U$S' },
            { id: '+1B U$S', name: '+1B U$S' },
          ]}
          validate={[required()]}
          className="w-full"
        />
        
        <SelectInput 
          source="employeeCount" 
          label="Cantidad de Empleados"
          choices={[
            { id: 'Menos de 50 empleados', name: 'Menos de 50 empleados' },
            { id: 'De 50 a 200 empleados', name: 'De 50 a 200 empleados' },
            { id: 'De 200 a 1000 empleados', name: 'De 200 a 1000 empleados' },
            { id: 'De 1000 a 5000 empleados', name: 'De 1000 a 5000 empleados' },
            { id: 'Mas de 5000 empleados', name: 'Mas de 5000 empleados' },
          ]}
          validate={[required()]}
          className="w-full"
        />
        
        {/* Ubicación y Categorías */}
        <div className="md:col-span-2 mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Ubicación y Categorías</h3>
        </div>
        
        <ReferenceArrayInput 
          source="locations" 
          reference="locations" 
          label="Ubicaciones"
          className="w-full"
        >
          <SelectArrayInput optionText="name" validate={[required()]} className="w-full" />
        </ReferenceArrayInput>
        
        <ReferenceArrayInput 
          source="subcategories" 
          reference="subcategories" 
          label="Subcategorías"
          className="w-full"
        >
          <SelectArrayInput optionText="name" validate={[required()]} className="w-full" />
        </ReferenceArrayInput>
        
        {/* Usuario Asociado */}
        <div className="md:col-span-2 mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Usuario Asociado</h3>
        </div>
        
        <div className="md:col-span-2">
          <ReferenceInput 
            source="userId" 
            reference="users" 
            label="Usuario Propietario"
            className="w-full"
            sort={{ field: 'email', order: 'ASC' }}
          >
            <SelectInput 
              optionText={(record) => {
                console.log('[CompanyCreate] SelectInput record:', record);
                if (!record) return '';
                const firstName = record.firstName || '';
                const lastName = record.lastName || '';
                const fullName = record.fullName || `${firstName} ${lastName}`.trim();
                const email = record.email || '';
                const display = fullName ? `${fullName} (${email})` : email;
                console.log('[CompanyCreate] Display text:', display);
                return display;
              }}
              validate={[required()]} 
              className="w-full" 
            />
          </ReferenceInput>
        </div>
        
        {/* Imágenes */}
        <div className="md:col-span-2 mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Imágenes</h3>
        </div>
        
        <div className="md:col-span-2">
          <ImageUploadField
            source="profilePicture"
            label="Foto de Perfil"
            helperText="Seleccione una imagen para subir a Cloudinary"
          />
        </div>
        
        <div className="md:col-span-2">
          <ImageUploadField
            source="bannerPicture"
            label="Banner"
            helperText="Seleccione una imagen para subir a Cloudinary"
          />
        </div>
        
      </div>
    </SimpleForm>
  </Create>
);
