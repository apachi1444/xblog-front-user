
import type { Store } from 'src/types/store';
import type { Article } from 'src/types/article';
import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';


interface StoreState {
  stores: Store[];
  count: number;
  currentStore: Store | null;
}

const initialState: StoreState = {
  stores: [],
  count: 0,
  currentStore: null,
};

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    getStores: (state, action: PayloadAction<Store[]>) => {
      state.stores = action.payload;
      state.count = action.payload.length;
    },
    addStore: (state, action: PayloadAction<Store>) => {
      state.stores.push(action.payload);
      state.count += 1;
    },
    deleteStore: (state, action: PayloadAction<number>) => {
      state.stores = state.stores.filter(store => store.id !== action.payload) || [];
      state.count = state.stores.length;
    },
    setCurrentStore: (state, action: PayloadAction<Store>) => {
      state.currentStore = action.payload;
    },
    setArticlesForCurrentStore: (state, action: PayloadAction<Article[]>) => {
      if (state.currentStore) {
        state.currentStore.articles_list = action.payload.map(article => ({
          ...article,
        }));
      }
    },
  },
});

export const { getStores, addStore, deleteStore , setCurrentStore, setArticlesForCurrentStore } = storeSlice.actions;
export default storeSlice.reducer;
