"use client"

import { Admin, Resource, Layout } from "react-admin";
import { useEffect, useState } from "react";

import dataProvider from "./ApiProviderUsers";
import UserRolesChart from "./RolesChart";
import TailAdminLayout from './TailAdminLayout';

// Import new components
import { UserList } from './UserListTailAdmin';
import { UserCreate } from './UserCreate';
import { UserEdit } from './UserEdit';
import { CompanyList } from './CompanyListTailAdmin';
import { CompanyCreate } from './CompanyCreate';
import { TenderList } from './TenderListTailAdmin';
import { TenderCreate } from './TenderCreate';
import { TenderEdit } from './TenderEdit';
import { SubscriptionList } from './SubscriptionList';
import { SubscriptionCreate } from './SubscriptionCreate';
import { CompanySubscriptionList } from './CompanySubscriptionList';
import { CompanySubscriptionCreate } from './CompanySubscriptionCreate';
import { AdminChat } from './AdminChat';
import { CategoryList } from './CategoryList';
import { CategoryCreate } from './CategoryCreate';
import { CategoryEdit } from './CategoryEdit';
import { SubcategoryList } from './SubcategoryList';
import { SubcategoryCreate } from './SubcategoryCreate';
import { SubcategoryEdit } from './SubcategoryEdit';
import { LocationList } from './LocationList';
import { LocationCreate } from './LocationCreate';
import { LocationEdit } from './LocationEdit';
import { ProposalList } from './ProposalListTailAdmin';
import { ProposalCreate } from './ProposalCreate';
import { ProposalEdit } from './ProposalEdit';

// Legacy components
// import Register from '../Register'; 
import RegisterCompany from '../RegisterCompany'
// import UpdateCompany from '../UpdateCompany'
import CompanyEdit from './CompanyEdit';

// Custom layout que oculta el sidebar de React Admin
const CustomReactAdminLayout = (props) => (
  <Layout 
    {...props} 
    sidebar={() => null} // Ocultar sidebar de React Admin
    appBar={() => null} // Ocultar appbar de React Admin
  />
);

const AdminApp = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  console.log("AdminApp renderizado");

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
          edit={UserEdit}
          recordRepresentation="name"
        />
        
        {/* Company Management */}
        <Resource 
          name="companies" 
          list={CompanyList} 
          create={CompanyCreate} 
          edit={CompanyEdit}
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
        
        {/* Categories Management */}
        <Resource 
          name="categories" 
          list={CategoryList} 
          create={CategoryCreate} 
          edit={CategoryEdit}
        />
        
        {/* Subcategories Management */}
        <Resource 
          name="subcategories" 
          list={SubcategoryList} 
          create={SubcategoryCreate} 
          edit={SubcategoryEdit}
        />
        
        {/* Locations Management */}
        <Resource 
          name="locations" 
          list={LocationList} 
          create={LocationCreate} 
          edit={LocationEdit}
        />
        
        {/* Proposals Management */}
        <Resource 
          name="proposals" 
          list={ProposalList} 
          create={ProposalCreate} 
          edit={ProposalEdit}
        />
        
        {/* Other Resources */}
        <Resource name="financeProducts" />
        <Resource name="bankAccounts" />
        <Resource name="documents" />
      </Admin>
    </TailAdminLayout>
  );
};

export default AdminApp;


