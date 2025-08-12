"use client";

import React, { useState, useEffect } from 'react';
import { useDataProvider } from 'react-admin';
import { TableCard, DonutChartCard, BarChartCard } from '../ui';

export const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const dataProvider = useDataProvider();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await dataProvider.getList('companies', {
          pagination: { page: 1, perPage: 100 },
          sort: { field: 'id', order: 'ASC' }
        });
        setCompanies(data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [dataProvider]);

  const tableColumns = [
    { 
      header: 'ID', 
      accessor: 'id' 
    },
    { 
      header: 'Empresa', 
      accessor: 'name', 
      type: 'avatar' 
    },
    { 
      header: 'Email', 
      accessor: 'email' 
    },
    { 
      header: 'Teléfono', 
      accessor: 'phone' 
    },
    { 
      header: 'Suscripción', 
      accessor: 'subscription',
      type: 'status'
    },
    { 
      header: 'Estado', 
      accessor: 'status',
      type: 'status'
    }
  ];

  // Transform companies data for the table
  const transformedCompanies = companies.map(company => ({
    id: company.id,
    name: company.name || 'Empresa Sin Nombre',
    email: company.email || 'Sin email',
    phone: company.phone || 'Sin teléfono',
    subscription: company.subscription || 'free',
    status: 'Active'
  }));

  // Prepare subscription distribution for donut chart
  const subscriptionCounts = {};
  companies.forEach(company => {
    const subscription = company.subscription || 'free';
    subscriptionCounts[subscription] = (subscriptionCounts[subscription] || 0) + 1;
  });

  const subscriptionData = Object.keys(subscriptionCounts).map(subscription => ({
    name: subscription.charAt(0).toUpperCase() + subscription.slice(1),
    value: subscriptionCounts[subscription]
  }));

  // Prepare monthly registrations data (mock data)
  const monthlyRegistrations = [
    { name: 'Ene', value: 12 },
    { name: 'Feb', value: 19 },
    { name: 'Mar', value: 15 },
    { name: 'Abr', value: 22 },
    { name: 'May', value: 18 },
    { name: 'Jun', value: 25 },
    { name: 'Jul', value: 28 },
    { name: 'Ago', value: 20 },
    { name: 'Sep', value: 24 },
    { name: 'Oct', value: 30 },
    { name: 'Nov', value: 26 },
    { name: 'Dic', value: 18 }
  ];

  const handleRowClick = (company) => {
    console.log('Company clicked:', company);
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
          Gestión de Empresas
        </h2>
        
        <div className="flex gap-3">
          <button className="inline-flex items-center justify-center rounded-md bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
            <span className="mr-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.8">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.0001 1.04167C5.52016 1.04167 1.87516 4.68667 1.87516 9.16667C1.87516 13.6467 5.52016 17.2917 10.0001 17.2917C14.4801 17.2917 18.1251 13.6467 18.1251 9.16667C18.1251 4.68667 14.4801 1.04167 10.0001 1.04167Z"
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
            Registrar Empresa
          </button>
          
          <button className="inline-flex items-center justify-center rounded-md border border-primary px-10 py-4 text-center font-medium text-primary hover:bg-opacity-90 lg:px-8 xl:px-10">
            Exportar
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
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
                {companies.length}
              </h4>
              <span className="text-sm font-medium">Total Empresas</span>
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-meta-3">
              12.5%
              <svg
                className="fill-meta-3"
                width="10"
                height="11"
                viewBox="0 0 10 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
                  fill=""
                />
              </svg>
            </span>
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
                {companies.filter(c => c.subscription === 'plus').length}
              </h4>
              <span className="text-sm font-medium">Suscripción Plus</span>
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-meta-3">
              8.2%
              <svg
                className="fill-meta-3"
                width="10"
                height="11"
                viewBox="0 0 10 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
                  fill=""
                />
              </svg>
            </span>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <svg
              className="fill-primary dark:fill-white"
              width="22"
              height="16"
              viewBox="0 0 22 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.918762 11 0.918762C17.8063 0.918762 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156Z"
                fill=""
              />
            </svg>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {companies.filter(c => c.subscription === 'base').length}
              </h4>
              <span className="text-sm font-medium">Suscripción Base</span>
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-meta-3">
              5.7%
              <svg
                className="fill-meta-3"
                width="10"
                height="11"
                viewBox="0 0 10 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
                  fill=""
                />
              </svg>
            </span>
          </div>
        </div>

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
                {companies.filter(c => !c.subscription || c.subscription === 'free').length}
              </h4>
              <span className="text-sm font-medium">Suscripción Free</span>
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-meta-1">
              -1.3%
              <svg
                className="fill-meta-1"
                width="10"
                height="11"
                viewBox="0 0 10 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.64284 7.69237L9.09102 4.33987L10 5.22362L5 10.0849L0 5.22362L0.908973 4.33987L4.35716 7.69237V0.0848701H5.64284V7.69237Z"
                  fill=""
                />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6 2xl:gap-7.5">
        {/* Monthly Registrations Chart */}
        <div className="md:col-span-8">
          <BarChartCard
            title="Registros Mensuales de Empresas"
            data={monthlyRegistrations}
            dataKey="value"
            height={300}
          />
        </div>

        {/* Subscription Distribution */}
        <div className="md:col-span-4">
          <DonutChartCard
            title="Distribución de Suscripciones"
            data={subscriptionData}
            centerValue={`${companies.length}`}
            centerLabel="Total Empresas"
            height={250}
          />
        </div>
      </div>

      {/* Companies Table */}
      <TableCard
        title="Lista de Empresas"
        data={transformedCompanies}
        columns={tableColumns}
        onRowClick={handleRowClick}
        showSearch={true}
        showFilter={true}
        searchPlaceholder="Buscar empresas..."
      />
    </div>
  );
};
