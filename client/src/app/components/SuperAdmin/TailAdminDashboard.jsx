"use client"
import React, { useState, useEffect } from 'react';
import { useDataProvider, Loading } from 'react-admin';
import { 
  StatCard, 
  BarChartCard, 
  DonutChartCard, 
  AreaChartCard, 
  TableCard, 
  ProgressCard, 
  MetricsGrid 
} from '../ui';

const TailAdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    users: [],
    companies: [],
    tenders: [],
    bankAccounts: [],
    financeProducts: []
  });
  
  const dataProvider = useDataProvider();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [
          { data: users },
          { data: companies },
          { data: tenders },
          { data: bankAccounts },
          { data: financeProducts }
        ] = await Promise.all([
          dataProvider.getList('users', {}),
          dataProvider.getList('companies', {}),
          dataProvider.getList('tenders', {}),
          dataProvider.getList('bankAccounts', {}),
          dataProvider.getList('financeProducts', {})
        ]);

        setDashboardData({
          users,
          companies,
          tenders,
          bankAccounts,
          financeProducts
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataProvider]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  // Prepare metrics data
  const metricsData = [
    {
      title: "Customers",
      value: dashboardData.users.length.toLocaleString(),
      percentage: "11.01%",
      trend: "up",
      icon: (
        <svg
          className="fill-primary dark:fill-white"
          width="22"
          height="18"
          viewBox="0 0 22 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
            fill=""
          />
        </svg>
      )
    },
    {
      title: "Orders",
      value: dashboardData.tenders.length.toLocaleString(),
      percentage: "9.05%",
      trend: "down",
      icon: (
        <svg
          className="fill-primary dark:fill-white"
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21.1063 18.0469L19.3875 3.23126C19.2157 1.71876 17.9438 0.584381 16.3969 0.584381H5.56878C4.05628 0.584381 2.78441 1.71876 2.57816 3.23126L0.859406 18.0469C0.756281 18.9063 1.03128 19.7313 1.61566 20.3844C2.20003 21.0375 2.99066 21.3813 3.85003 21.3813H18.1157C18.975 21.3813 19.8 21.0031 20.35 20.3844C20.9 19.7656 21.2094 18.9063 21.1063 18.0469ZM19.2157 19.3531C18.9407 19.6625 18.5625 19.8344 18.15 19.8344H3.85003C3.43753 19.8344 3.05941 19.6625 2.78441 19.3531C2.50941 19.0438 2.37191 18.6313 2.44066 18.2188L4.12503 3.43751C4.19378 2.71563 4.81253 2.16563 5.56878 2.16563H16.4313C17.1875 2.16563 17.8063 2.71563 17.875 3.43751L19.5938 18.2531C19.6282 18.6656 19.4907 19.0438 19.2157 19.3531Z"
            fill=""
          />
        </svg>
      )
    }
  ];

  // Prepare monthly sales data for bar chart
  const monthlySalesData = [
    { name: 'Jan', value: 165 },
    { name: 'Feb', value: 390 },
    { name: 'Mar', value: 180 },
    { name: 'Apr', value: 280 },
    { name: 'May', value: 165 },
    { name: 'Jun', value: 175 },
    { name: 'Jul', value: 280 },
    { name: 'Aug', value: 90 },
    { name: 'Sep', value: 195 },
    { name: 'Oct', value: 355 },
    { name: 'Nov', value: 280 },
    { name: 'Dec', value: 90 }
  ];

  // Prepare statistics data for area chart
  const statisticsData = [
    { name: 'Apr', value: 155 },
    { name: 'May', value: 165 },
    { name: 'Jun', value: 145 },
    { name: 'Jul', value: 175 },
    { name: 'Aug', value: 190 },
    { name: 'Sep', value: 215 },
    { name: 'Oct', value: 220 }
  ];

  // Prepare subscription distribution for donut chart
  const subscriptionCounts = {};
  dashboardData.companies.forEach(company => {
    const subscription = company.subscription || 'free';
    subscriptionCounts[subscription] = (subscriptionCounts[subscription] || 0) + 1;
  });

  const subscriptionData = Object.keys(subscriptionCounts).map(subscription => ({
    name: subscription.charAt(0).toUpperCase() + subscription.slice(1),
    value: subscriptionCounts[subscription]
  }));

  // Prepare recent orders table data
  const recentOrders = dashboardData.tenders.slice(0, 5).map((tender, index) => ({
    dealId: `DE${124321 + index}`,
    customer: tender.title || 'Unnamed Tender',
    email: 'customer@example.com',
    product: 'Software License',
    dealValue: '$18,50.34',
    closeDate: '2024-06-15',
    status: tender.status === 'active' ? 'Complete' : 'Pending',
    action: 'Delete'
  }));

  const tableColumns = [
    { header: 'Deal ID', accessor: 'dealId' },
    { header: 'Customer', accessor: 'customer', type: 'avatar' },
    { header: 'Product/Service', accessor: 'product' },
    { header: 'Deal Value', accessor: 'dealValue' },
    { header: 'Close Date', accessor: 'closeDate' },
    { header: 'Status', accessor: 'status', type: 'status' },
    { header: 'Action', accessor: 'action' }
  ];

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {/* Metrics Grid */}
      <MetricsGrid metrics={metricsData} className="mb-6" />

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6 2xl:gap-7.5 mb-6">
        {/* Monthly Sales Chart */}
        <div className="md:col-span-8">
          <BarChartCard
            title="Monthly Sales"
            data={monthlySalesData}
            dataKey="value"
            height={350}
          />
        </div>

        {/* Monthly Target Progress */}
        <div className="md:col-span-4">
          <ProgressCard
            title="Monthly Target"
            subtitle="Target you've set for each month"
            percentage={75.55}
            targetValue="20K"
            currentValue="20K"
            todayValue="20K"
          />
        </div>
      </div>

      {/* Statistics and Table Row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6 2xl:gap-7.5 mb-6">
        {/* Statistics Area Chart */}
        <div className="md:col-span-8">
          <AreaChartCard
            title="Statistics"
            subtitle="Target you've set for each month"
            data={statisticsData}
            dataKey="value"
            height={350}
            showTabs={true}
            tabs={[
              { label: 'Overview', active: true },
              { label: 'Sales', active: false },
              { label: 'Revenue', active: false }
            ]}
          />
        </div>

        {/* Recent Orders Table */}
        <div className="md:col-span-4">
          <TableCard
            title="Recent Orders"
            data={recentOrders}
            columns={tableColumns}
            showSearch={true}
            showFilter={true}
            searchPlaceholder="Search..."
          />
        </div>
      </div>

      {/* Subscription Distribution */}
      {subscriptionData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 2xl:gap-7.5">
          <DonutChartCard
            title="Company Subscriptions"
            data={subscriptionData}
            centerValue={`${dashboardData.companies.length}`}
            centerLabel="Total Companies"
            height={300}
          />
        </div>
      )}
    </div>
  );
};

export default TailAdminDashboard;
