"use client";
import { Edit } from 'react-admin';
import UpdateCompany from '../UpdateCompany';

export const CompanyEdit = () => {
  return (
    <Edit>
      <UpdateCompany />
    </Edit>
  );
};

export default CompanyEdit;
