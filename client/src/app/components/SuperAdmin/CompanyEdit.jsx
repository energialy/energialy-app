"use client";

import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  ReferenceArrayInput,
  SelectArrayInput,
  required,
  ImageInput,
  ImageField,
} from 'react-admin';

const transform = (data) => {
  console.log('[CompanyEdit] Original data:', data);
  console.log('[CompanyEdit] profilePicture type:', typeof data.profilePicture, data.profilePicture);
  console.log('[CompanyEdit] bannerPicture type:', typeof data.bannerPicture, data.bannerPicture);
  
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
    organizationType: data.organizationType,
    userId: data.userId,
  };
  
  // Solo incluir imágenes si son strings (URLs), no objetos File
  // ImageInput devuelve objetos cuando se carga nueva imagen, pero el backend espera URLs
  // Si no se cambió la imagen, mantener la URL existente
  if (data.profilePicture) {
    if (typeof data.profilePicture === 'string') {
      transformed.profilePicture = data.profilePicture;
    } else if (typeof data.profilePicture === 'object' && data.profilePicture.src) {
      // Si es un objeto con src (imagen ya existente), mantener la URL
      transformed.profilePicture = data.profilePicture.src;
    }
  }
  if (data.bannerPicture) {
    if (typeof data.bannerPicture === 'string') {
      transformed.bannerPicture = data.bannerPicture;
    } else if (typeof data.bannerPicture === 'object' && data.bannerPicture.src) {
      // Si es un objeto con src (imagen ya existente), mantener la URL
      transformed.bannerPicture = data.bannerPicture.src;
    }
  }
  
  console.log('[CompanyEdit] Transformed data:', transformed);
  return transformed;
};

export const CompanyEdit = () => (
  <Edit title="Editar Empresa" transform={transform}>
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
                console.log('[CompanyEdit] SelectInput record:', record);
                if (!record) return '';
                const firstName = record.firstName || '';
                const lastName = record.lastName || '';
                const fullName = record.fullName || `${firstName} ${lastName}`.trim();
                const email = record.email || '';
                const display = fullName ? `${fullName} (${email})` : email;
                console.log('[CompanyEdit] Display text:', display);
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
          <ImageInput 
            source="profilePicture" 
            label="Foto de Perfil" 
            accept="image/*"
            className="w-full"
          >
            <ImageField source="src" title="title" />
          </ImageInput>
        </div>
        
        <div className="md:col-span-2">
          <ImageInput 
            source="bannerPicture" 
            label="Banner" 
            accept="image/*"
            className="w-full"
          >
            <ImageField source="src" title="title" />
          </ImageInput>
        </div>
        
      </div>
    </SimpleForm>
  </Edit>
);

export default CompanyEdit;
