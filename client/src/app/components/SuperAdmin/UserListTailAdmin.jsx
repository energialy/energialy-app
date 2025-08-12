"use client";

import React, { useState, useEffect } from 'react';
import { useDataProvider } from 'react-admin';
import { TableCard } from '../ui';

export const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const dataProvider = useDataProvider();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await dataProvider.getList('users', {
          pagination: { page: 1, perPage: 100 },
          sort: { field: 'id', order: 'ASC' }
        });
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [dataProvider]);

  const tableColumns = [
    { 
      header: 'ID', 
      accessor: 'id' 
    },
    { 
      header: 'Usuario', 
      accessor: 'fullName', 
      type: 'avatar' 
    },
    { 
      header: 'Email', 
      accessor: 'email' 
    },
    { 
      header: 'Rol', 
      accessor: 'role',
      type: 'status'
    },
    { 
      header: 'Posición', 
      accessor: 'position' 
    },
    { 
      header: 'Empresa', 
      accessor: 'companyName' 
    },
    { 
      header: 'Estado', 
      accessor: 'status',
      type: 'status'
    }
  ];

  // Transform users data for the table
  const transformedUsers = users.map(user => ({
    id: user.id,
    fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Usuario Sin Nombre',
    email: user.email || 'Sin email',
    role: user.role || 'user',
    position: user.position || 'Sin posición',
    companyName: user.CompanyId ? 'Empresa Asignada' : 'Sin empresa',
    status: 'Active'
  }));

  const handleRowClick = (user) => {
    console.log('User clicked:', user);
    // Aquí puedes agregar navegación o modal de detalles
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Gestión de Usuarios
        </h2>
        
        <div className="flex gap-3">
          <button className="inline-flex items-center justify-center rounded-md bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
            <span className="mr-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.8">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.0001 1.04167C5.52016 1.04167 1.87516 4.68667 1.87516 9.16667C1.87516 13.6467 5.52016 17.2917 10.0001 17.2917C14.4801 17.2917 18.1251 13.6467 18.1251 9.16667C18.1251 4.68667 14.4801 1.04167 10.0001 1.04167ZM10.0001 15.625C6.44183 15.625 3.5418 12.725 3.5418 9.16667C3.5418 5.60833 6.44183 2.70833 10.0001 2.70833C13.5585 2.70833 16.4585 5.60833 16.4585 9.16667C16.4585 12.725 13.5585 15.625 10.0001 15.625Z"
                    fill="currentColor"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.99935 5.20833C9.53902 5.20833 9.16602 5.58133 9.16602 6.04167V9.16667C9.16602 9.62701 9.53902 10 9.99935 10H12.4993C12.9597 10 13.3327 9.62701 13.3327 9.16667C13.3327 8.70634 12.9597 8.33334 12.4993 8.33334H10.8327V6.04167C10.8327 5.58133 10.4597 5.20833 9.99935 5.20833Z"
                    fill="currentColor"
                  />
                </g>
              </svg>
            </span>
            Crear Usuario
          </button>
          
          <button className="inline-flex items-center justify-center rounded-md border border-primary px-10 py-4 text-center font-medium text-primary hover:bg-opacity-90 lg:px-8 xl:px-10">
            Exportar
          </button>
        </div>
      </div>

      {/* Users Table */}
      <TableCard
        title="Lista de Usuarios"
        data={transformedUsers}
        columns={tableColumns}
        onRowClick={handleRowClick}
        showSearch={true}
        showFilter={true}
        searchPlaceholder="Buscar usuarios..."
      />

      {/* Statistics Cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <svg
              className="fill-primary dark:fill-white"
              width="22"
              height="18"
              viewBox="0 0 22 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751Z"
                fill=""
              />
            </svg>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {users.length}
              </h4>
              <span className="text-sm font-medium">Total Usuarios</span>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <svg
              className="fill-primary dark:fill-white"
              width="20"
              height="22"
              viewBox="0 0 20 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.7531 16.4312C10.3781 16.4312 9.27808 15.3312 9.27808 13.9562C9.27808 12.5812 10.3781 11.4812 11.7531 11.4812C13.1281 11.4812 14.2281 12.5812 14.2281 13.9562C14.2281 15.3312 13.1281 16.4312 11.7531 16.4312Z"
                fill=""
              />
            </svg>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {users.filter(u => u.role === 'admin').length}
              </h4>
              <span className="text-sm font-medium">Administradores</span>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <svg
              className="fill-primary dark:fill-white"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.1063 18.0469L19.3875 3.23126C19.2157 1.71876 17.9438 0.584381 16.3969 0.584381H5.56878C4.05628 0.584381 2.78441 1.71876 2.57816 3.23126L0.859406 18.0469C0.756281 18.9063 1.03128 19.7313 1.61566 20.3844C2.20003 21.0375 2.99066 21.3813 3.85003 21.3813H18.1157C18.975 21.3813 19.8 21.0031 20.35 20.3844C20.9 19.7656 21.2094 18.9063 21.1063 18.0469Z"
                fill=""
              />
            </svg>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {users.filter(u => u.role === 'user').length}
              </h4>
              <span className="text-sm font-medium">Usuarios Regulares</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
