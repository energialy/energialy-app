"use client"

import { Admin, Resource, Layout } from "react-admin";
import dataProvider from "./ApiProviderUsers";
import UserRolesChart from "./RolesChart";
import TailAdminLayout from './TailAdminLayout';

// Import new components
import { UserList } from './UserList';
import { UserCreate } from './UserCreate';
import { CompanyList } from './CompanyList';
import { CompanyCreate } from './CompanyCreate';
import { TenderList } from './TenderList';
import { TenderCreate } from './TenderCreate';
import { TenderEdit } from './TenderEdit';
import { SubscriptionList } from './SubscriptionList';
import { SubscriptionCreate } from './SubscriptionCreate';
import { CompanySubscriptionList } from './CompanySubscriptionList';
import { CompanySubscriptionCreate } from './CompanySubscriptionCreate';
import { AdminChat } from './AdminChat';

// Legacy components
import Register from '../Register'; 
import RegisterCompany from '../RegisterCompany'

// Custom layout que oculta el sidebar de React Admin
const CustomReactAdminLayout = (props) => (
  <Layout 
    {...props} 
    sidebar={() => null} // Ocultar sidebar de React Admin
    appBar={() => null} // Ocultar appbar de React Admin
  />
);

const AdminApp = () => {
  console.log("AdminApp renderizado");
 
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <TailAdminLayout>
      <Admin 
        dataProvider={dataProvider}
        layout={CustomReactAdminLayout}
      >
        <Resource name="Dashboard" list={UserRolesChart} />
        
        {/* User Management */}
        <Resource 
          name="users" 
          list={UserList} 
          create={UserCreate} 
          edit={Register}
          recordRepresentation="name"
        />
        
        {/* Company Management */}
        <Resource 
          name="companies" 
          list={CompanyList} 
          create={CompanyCreate} 
          edit={RegisterCompany}
        />
        
        {/* Tender Management with full CRUD */}
        <Resource 
          name="tenders" 
          list={TenderList} 
          create={TenderCreate} 
          edit={TenderEdit} 
        />
        
        {/* Subscription Management */}
        <Resource 
          name="subscriptions" 
          list={SubscriptionList} 
          create={SubscriptionCreate} 
        />
        
        {/* Company-Subscription Assignment */}
        <Resource 
          name="companySubscriptions" 
          list={CompanySubscriptionList} 
          create={CompanySubscriptionCreate} 
        />
        
        {/* Admin Chat */}
        <Resource name="chat" list={AdminChat} />
        
        {/* Other Resources */}
        <Resource name="financeProducts" />
        <Resource name="bankAccounts" />
        <Resource name="categories" />
        <Resource name="subcategories" />
        <Resource name="locations" />
        <Resource name="proposals" />
        <Resource name="documents" />
      </Admin>
    </TailAdminLayout>
  );
};

export default AdminApp;


