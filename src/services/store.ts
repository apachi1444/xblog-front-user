import { configureStore, combineReducers } from '@reduxjs/toolkit';

import { api } from './apis';
import userReducer from './slices/userSlice';
import globalReducer from './slices/globalSlice';
import authReducer from './slices/auth/authSlice';
import articleReducer from './slices/articleSlice';
import storesReducer from './slices/stores/storeSlice';
import articlesReducer from './slices/articles/articleSlice';
import userDashboardReducer from './slices/userDashboardSlice';

const rootReducer = combineReducers({
  user: userReducer,
  article: articleReducer,
  userDashboard: userDashboardReducer,
  global: globalReducer,
  stores: storesReducer,
  articles: articlesReducer,
  auth: authReducer,
  [api.reducerPath]: api.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

