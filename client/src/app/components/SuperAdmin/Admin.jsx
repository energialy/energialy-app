"use client"

import { Admin, Resource, ListGuesser, EditGuesser, CreateGuesser, Layout } from "react-admin";
import dataProvider from "./ApiProviderUsers";
import UserRolesChart from "./RolesChart";
import TailAdminLayout from './TailAdminLayout';
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
        <Resource name="users" list={ListGuesser} edit={EditGuesser} create={Register} recordRepresentation="name"/>
        <Resource name="companies" list={ListGuesser} edit={EditGuesser} create={RegisterCompany}/>
        <Resource name="tenders" list={ListGuesser} edit={EditGuesser} />
        <Resource name="financeProducts" list={ListGuesser} edit={EditGuesser} />
        <Resource name="bankAccounts" list={ListGuesser} edit={EditGuesser} />
        <Resource name="categories" list={ListGuesser} edit={EditGuesser} />
        <Resource name="subcategories" list={ListGuesser} edit={EditGuesser} />
        <Resource name="locations" list={ListGuesser} edit={EditGuesser} />
        <Resource name="proposals" list={ListGuesser} edit={EditGuesser} />
        <Resource name="documents" list={ListGuesser} edit={EditGuesser} />
      </Admin>
    </TailAdminLayout>
  );
};

export default AdminApp;


