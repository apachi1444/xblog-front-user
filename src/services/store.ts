import { configureStore } from '@reduxjs/toolkit';

import { api } from './apis';
import globalReducer from './slices/globalSlice';
import authReducer from './slices/auth/authSlice';
import storesReducer from './slices/stores/storeSlice';
import articlesReducer from './slices/articles/articleSlice';
import subscriptionReducer from './slices/subscription/subscriptionSlice';
import bannersReducer from './slices/banners/bannerSlice';

export const store = configureStore({
  reducer: {
    global: globalReducer,
    stores: storesReducer,
    articles: articlesReducer,
    auth: authReducer,
    subscription: subscriptionReducer,
    banners: bannersReducer,
    [api.reducerPath]: api.reducer,
  },
  // Add the api middleware to enable caching, invalidation, polling, etc.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

