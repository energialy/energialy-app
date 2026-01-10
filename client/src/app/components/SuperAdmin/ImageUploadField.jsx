"use client";

import React, { useState } from 'react';
import { useInput } from 'react-admin';
import axios from 'axios';

/**
 * Custom ImageUploadField component for React Admin
 * Uploads images to Cloudinary and stores the URL
 */
export const ImageUploadField = ({ source, label, helperText }) => {
  const { field } = useInput({ source });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(field.value || '');

  const uploadImage = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "energialy_users");
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dbraa6jpj/image/upload",
        data  
      );
      const file = res.data;
      console.log("Cloudinary upload response:", res);

      // Update the field value with the Cloudinary URL
      field.onChange(file.secure_url);
      setPreview(file.secure_url);
      setLoading(false);
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      setError('Error al subir la imagen. Por favor intente nuevamente.');
      setLoading(false);
    }
  };

  const handleRemove = () => {
    field.onChange('');
    setPreview('');
  };

  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      {helperText && (
        <p className="text-xs text-gray-500 mb-2">{helperText}</p>
      )}

      <div className="flex flex-col gap-4">
        {/* File Input */}
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={uploadImage}
            disabled={loading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-blue-600 text-sm">
            Subiendo imagen a Cloudinary...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Preview */}
        {preview && !loading && (
          <div className="relative inline-block">
            <img 
              src={preview} 
              alt={label} 
              className="max-w-xs max-h-48 rounded border border-gray-300"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}

        {/* Hidden input to store the URL */}
        <input type="hidden" {...field} />
      </div>
    </div>
  );
};

export default ImageUploadField;
