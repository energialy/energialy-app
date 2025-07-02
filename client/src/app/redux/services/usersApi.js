import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { urlProduction } from "@/app/data/dataGeneric";

export const usersApi = createApi({
  reducerPath: "users",
  baseQuery: fetchBaseQuery({ baseUrl: urlProduction }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
      providesTags: ['User'],
    }),
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
  }),
});

export const { 
  useGetUsersQuery,
  useGetUserByIdQuery,
} = usersApi;