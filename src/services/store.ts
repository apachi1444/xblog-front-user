import { configureStore } from '@reduxjs/toolkit';

import { api } from './apis';
import globalReducer from './slices/globalSlice';
import authReducer from './slices/auth/authSlice';
import storesReducer from './slices/stores/storeSlice';
import bannersReducer from './slices/banners/bannerSlice';
import articlesReducer from './slices/articles/articleSlice';
import subscriptionReducer from './slices/subscription/subscriptionSlice';

// Configure Redux store with DevTools support
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
    getDefaultMiddleware({
      // Add any middleware customization here
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(api.middleware),
  // Enable Redux DevTools extension with additional configuration
  devTools: {
    name: 'XBlog App',
    trace: true,
    traceLimit: 25,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

