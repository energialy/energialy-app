"use client"
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,PieChart, Pie, Cell} from 'recharts';
import { useDataProvider, Loading } from 'react-admin';
import AdminDashboard from './AdminDashboard';

const COLORS = {
  free: '#3C50E0',
  base: '#10B981',
  plus: '#FFBA00',
};

const UserRolesChart = () => {
  const [userData, setUserData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [tendersData, setTendersData] = useState([]);
  const [tendersStatusData, setTendersStatusData] = useState([]);
  const [bankAccountsData, setBankAccountsData] = useState([]);
  const [bankAccountsStatusData, setBankAccountsStatusData] = useState([]);
  const [financeProductsData, setFinanceProductsData] = useState([]);
  
  const dataProvider = useDataProvider();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: userData } = await dataProvider.getList('users', {});

        const userRoleCounts = {};
        userData.forEach(user => {
          const role = user.role;
          if (userRoleCounts[role]) {
            userRoleCounts[role]++;
          } else {
            userRoleCounts[role] = 1;
          }
        });
        const userDataWithCount = Object.keys(userRoleCounts).map(role => ({
          role,
          count: userRoleCounts[role]
        }));
        setUserData(userDataWithCount);


        const { data: companyData } = await dataProvider.getList('companies', {});

        const companySubscriptionCounts = {};
        companyData.forEach(company => {
          const subscription = company.subscription;
          if (companySubscriptionCounts[subscription]) {
            companySubscriptionCounts[subscription]++;
          } else {
            companySubscriptionCounts[subscription] = 1;
          }
        });
        const companyDataWithCount = Object.keys(companySubscriptionCounts).map(subscription => ({
          name: subscription,
          value: companySubscriptionCounts[subscription]
        }));
        setCompanyData(companyDataWithCount);


        const { data: tendersData } = await dataProvider.getList('tenders', {});
        const tendersPublicCounts = {};
        tendersData.forEach(tender => {
          const publicStatus = tender.public;
          if (tendersPublicCounts[publicStatus]) {
            tendersPublicCounts[publicStatus]++;
          } else {
            tendersPublicCounts[publicStatus] = 1;
          }
        });
        const tendersDataWithCount = Object.keys(tendersPublicCounts).map(publicStatus => ({
          name: publicStatus,
          value: tendersPublicCounts[publicStatus]
        }));
        setTendersData(tendersDataWithCount);

        const tendersStatusCounts = {};
        tendersData.forEach(tender => {
          const status = tender.status;
          if (tendersStatusCounts[status]) {
            tendersStatusCounts[status]++;
          } else {
            tendersStatusCounts[status] = 1;
          }
        });
        const tendersStatusDataWithCount = Object.keys(tendersStatusCounts).map(status => ({
          name: status,
          value: tendersStatusCounts[status]
        }));
        setTendersStatusData(tendersStatusDataWithCount);



        const { data: bankAccountsData } = await dataProvider.getList('bankAccounts', {});
        const bankAccountsStatusCounts = {};
        bankAccountsData.forEach(account => {
          const status = account.status;
          if (bankAccountsStatusCounts[status]) {
            bankAccountsStatusCounts[status]++;
          } else {
            bankAccountsStatusCounts[status] = 1;
          }
        });
        const bankAccountsDataWithCount = Object.keys(bankAccountsStatusCounts).map(status => ({
          name: status,
          value: bankAccountsStatusCounts[status]
        }));
        setBankAccountsData(bankAccountsDataWithCount);


        const { data: financeProductsData } = await dataProvider.getList('financeProducts', {});
        const productsStatusCounts = {};

        financeProductsData.forEach(product => {
          const productName = product.productName;
          const status = product.status;

          if (!productsStatusCounts[productName]) {
            productsStatusCounts[productName] = {
              'sent': 0,
              'accepted': 0,
              'declined': 0
            };
          }

          productsStatusCounts[productName][status]++;
        });

        const chartData = Object.keys(productsStatusCounts).map(productName => ({
          productName,
          'sent': productsStatusCounts[productName]['sent'],
          'accepted': productsStatusCounts[productName]['accepted'],
          'declined': productsStatusCounts[productName]['declined']
        }));

        setFinanceProductsData(chartData);

        } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dataProvider]);

  if (userData.length === 0 || companyData.length === 0 ) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Stats */}
      <AdminDashboard />

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
        
        {/* Users by Role Chart */}
        <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mb-5">
            <h5 className="text-xl font-semibold text-black dark:text-white">
              Usuarios por Rol
            </h5>
          </div>
          <div className="flex justify-center">
            <BarChart width={400} height={300} data={userData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="role" />
              <YAxis />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#24303F',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#ffffff'
                }}
              />
              <Legend />
              <Bar dataKey="count" fill="#3C50E0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </div>
        </div>

        {/* Companies by Subscription Chart */}
        <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mb-5">
            <h5 className="text-xl font-semibold text-black dark:text-white">
              Empresas por Suscripción
            </h5>
          </div>
          <div className="flex justify-center">
            <PieChart width={400} height={300}>
              <Pie
                data={companyData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
                labelLine={false}
              >
                {companyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#24303F',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#ffffff'
                }}
              />
              <Legend />
            </PieChart>
          </div>
        </div>

        {/* Tenders Status Chart */}
        <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mb-5">
            <h5 className="text-xl font-semibold text-black dark:text-white">
              Estado de Licitaciones
            </h5>
          </div>
          <div className="flex justify-center">
            <PieChart width={400} height={300}>
              <Pie 
                data={tendersStatusData} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={80} 
                fill="#10B981" 
                label 
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#24303F',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#ffffff'
                }}
              />
              <Legend />
            </PieChart>
          </div>
        </div>

        {/* Finance Products Chart */}
        <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mb-5">
            <h5 className="text-xl font-semibold text-black dark:text-white">
              Productos Financieros
            </h5>
          </div>
          <div className="flex justify-center">
            <BarChart width={400} height={300} data={financeProductsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="productName" />
              <YAxis />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#24303F',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#ffffff'
                }}
              />
              <Legend />
              <Bar dataKey="sent" stackId="a" fill="#3C50E0" radius={[2, 2, 0, 0]} />
              <Bar dataKey="accepted" stackId="a" fill="#10B981" radius={[2, 2, 0, 0]} />
              <Bar dataKey="declined" stackId="a" fill="#DC3545" radius={[2, 2, 0, 0]} />
            </BarChart>
          </div>
        </div>

      </div>

      {/* Additional Charts Row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
        
        {/* Bank Accounts Chart */}
        <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mb-5">
            <h5 className="text-xl font-semibold text-black dark:text-white">
              Cuentas Bancarias
            </h5>
          </div>
          <div className="flex justify-center">
            <PieChart width={400} height={300}>
              <Pie 
                data={bankAccountsData} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={80} 
                fill="#FFBA00" 
                label 
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#24303F',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#ffffff'
                }}
              />
              <Legend />
            </PieChart>
          </div>
        </div>

        {/* Tenders Public Status Chart */}
        <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mb-5">
            <h5 className="text-xl font-semibold text-black dark:text-white">
              Licitaciones Públicas
            </h5>
          </div>
          <div className="flex justify-center">
            <PieChart width={400} height={300}>
              <Pie 
                data={tendersData} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={80} 
                fill="#259AE6" 
                label 
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#24303F',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#ffffff'
                }}
              />
              <Legend />
            </PieChart>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserRolesChart;