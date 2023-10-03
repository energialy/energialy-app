import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bankAccountApi = createApi({
  reducerPath: "bankAccount",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001" }),
  endpoints: (builder) => ({
    getBankAccounts: builder.query({
      query: () => "/bankAccounts",
    }),
    getBankAccountsById: builder.query({
      query: (id) => `/bankAccounts/${id}`,
    }),
  }),
});

export const { useGetBankAccountsQuery, useGetBankAccountsByIdQuery } = bankAccountApi;
