"use client";

import React from 'react';
import { useRecordContext } from 'react-admin';

/**
 * ReadOnlyField - Componente para mostrar campos de solo lectura en formularios de React Admin
 * 
 * @param {string} source - El nombre del campo en el record
 * @param {string} label - La etiqueta a mostrar
 * @param {string} format - Tipo de formato: 'currency', 'number', 'text' (por defecto: 'text')
 * @param {string} currency - Código de moneda si format='currency' (por defecto: 'USD')
 */
const ReadOnlyField = ({ source, label, format = 'text', currency = 'USD' }) => {
  const record = useRecordContext();
  const value = record?.[source];
  
  const formatValue = (val) => {
    if (val === undefined || val === null) return '-';
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('es-ES', { 
          style: 'currency', 
          currency: currency 
        }).format(val);
      
      case 'number':
        return new Intl.NumberFormat('es-ES').format(val);
      
      default:
        return val;
    }
  };
  
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded text-gray-600">
        {formatValue(value)}
      </div>
    </div>
  );
};

export default ReadOnlyField;
