import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./features/userSlice";
import companieReducer from "./features/companieSlice";
import tenderReducer from "./features/tenderSlice";
import { locationApi } from "./services/locationApi";
import { companiesApi } from "./services/companiesApi";
import { categoriesApi } from "./services/categoriesApi";
import { tendersApi } from "./services/tendersApi";
import { proposalsApi } from "./services/ProposalApi";
import { bankAccountApi } from "./services/bankAccountApi";
import { financeProductsApi } from "./services/financeProductsApi";
import { usersApi } from "./services/usersApi";



const store = configureStore({
  reducer: {
    user: userReducer,
    company: companieReducer,
    tender: tenderReducer,
    [locationApi.reducerPath]: locationApi.reducer,
    [companiesApi.reducerPath]: companiesApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [tendersApi.reducerPath]: tendersApi.reducer,
    [proposalsApi.reducerPath]: proposalsApi.reducer,
    [bankAccountApi.reducerPath]: bankAccountApi.reducer,
    [financeProductsApi.reducerPath]: financeProductsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      locationApi.middleware,
      companiesApi.middleware,
      categoriesApi.middleware,
      tendersApi.middleware,
      proposalsApi.middleware,
      bankAccountApi.middleware,
      financeProductsApi.middleware,
      usersApi.middleware
    ),
});

export default store