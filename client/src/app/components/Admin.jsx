"use client"

import { Admin, Resource, ListGuesser, EditGuesser, CreateGuesser } from "react-admin";
import dataProvider from "./ApiProviderUsers";
import companyDataProvider from "./ApiProviderCompanies"; 
import tenderDataProvider from "./ApiProviderTenders"; 
// import ListGuesserWithLog from "./ListGuesserWithLog";

const AdminApp = () => {
  console.log("AdminApp renderizado");
  
  return (
    <Admin dataProvider={dataProvider}>
      <Resource name="users" list={ListGuesser} edit={EditGuesser} create={CreateGuesser}/>
      <Resource name="companies" list={ListGuesser} edit={EditGuesser} create={CreateGuesser}/>
      <Resource name="tenders" list={ListGuesser} edit={EditGuesser}/>
      <Resource name="comments" />
    </Admin>
  );
};

export default AdminApp;


















// import { Admin, Resource, ListGuesser, EditGuesser } from "react-admin";
// import jsonServerProvider from "ra-data-json-server";

// const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");

// const AdminApp = () => (
//   <Admin dataProvider={dataProvider}>
//     <Resource
//       name="users"
//       list={ListGuesser}
//       edit={EditGuesser}
//       recordRepresentation="name"
//     />
//     <Resource
//       name="posts"
//       list={ListGuesser}
//       edit={EditGuesser}
//       recordRepresentation="title"
//     />
//     <Resource name="comments" list={ListGuesser} edit={EditGuesser} />
//   </Admin>
// );

// export default AdminApp;