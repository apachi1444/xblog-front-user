import { configureStore, combineReducers } from '@reduxjs/toolkit';

import userReducer from "./slices/userSlice";
import globalReducer from './slices/globalSlice';
import wp_storeReducer from "./slices/storeSlice";
import articleReducer from "./slices/articleSlice";
import userStoresReducer from "./slices/userStoresSlice";
import userDashboardReducer from "./slices/userDashboardSlice";

export const store = configureStore({
  reducer : combineReducers({
    userStores:userStoresReducer,
    wp_store:wp_storeReducer,
    user: userReducer,
    article: articleReducer,
    userDashboard: userDashboardReducer,
    global: globalReducer,
  })
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
