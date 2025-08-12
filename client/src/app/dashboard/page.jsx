'use client';
import { useState, useEffect } from 'react';
import getLocalStorage from '../Func/localStorage';
import CompanyDashboardNew from './components/CompanyDashboardNew';

function DasboardPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = getLocalStorage();
    if (!user) {
      window.location.href = '/';
    }
    setUser(user);
  }, []);

  return (
    <div className="min-h-screen bg-gray-1 dark:bg-boxdark-2 dark:text-bodydark">
      {!user ? (
        <div className="flex h-screen items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      ) : user.role !== 'bank' ? (
        <CompanyDashboardNew user={user} />
      ) : (
        <div className="flex h-screen items-center justify-center">
          <div className="rounded-sm border border-stroke bg-white p-10 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h2 className="text-title-md font-semibold text-black dark:text-white">
              Dashboard de Banco
            </h2>
            <p className="mt-3 text-black dark:text-white">
              Funcionalidad en desarrollo
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DasboardPage;
