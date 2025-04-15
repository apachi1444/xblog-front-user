
import type { Store } from 'src/types/store';
import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface StoreState {
  stores: Store[];
  count: number;
}

const initialState: StoreState = {
  stores: [],
  count: 0
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
    deleteStore: (state, action: PayloadAction<string>) => {
      state.stores = state.stores.filter(store => store.id !== action.payload) || [];
      state.count = state.stores.length;
    },
  },
});

export const { getStores, addStore, deleteStore } = storeSlice.actions;
export default storeSlice.reducer;