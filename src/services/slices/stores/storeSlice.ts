
import type { Store } from 'src/types/store';
import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface StoreState {
  stores: Store[];
}

const initialState: StoreState = {
  stores: [],
};

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    getStores: (state , {payload : stores}) => {
      state.stores  = stores
    },
    addStore: (state, { payload: store }) => {
      state.stores.push(store);
    },
    deleteStore: (state, action: PayloadAction<string>) => {
      state.stores = state.stores.filter(store => store.id !== action.payload) || [];
    },
  },
});

export const { getStores } = storeSlice.actions;
export default storeSlice.reducer;