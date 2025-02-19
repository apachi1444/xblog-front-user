import type { PayloadAction } from '@reduxjs/toolkit';

import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import hostname from '../config';

interface Store {
  store_url: string;
  store_password: string;
  store_username: string;
}

interface StoreState {
  store: Store | null;
  loading: boolean;
  error: string | null;
}

export const connectStore = createAsyncThunk<Store, { storeData: Partial<Store> }, { rejectValue: string }>(
  'store/connectStore',
  async (storeData, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.post(`${hostname}/stores`, storeData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to connect store'
      );
    }
  }
);

const initialState: StoreState = {
  store: null,
  loading: false,
  error: null,
};

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(connectStore.fulfilled, (state, action: PayloadAction<Store>) => {
        state.loading = false;
        state.store = action.payload;
      })
      .addCase(connectStore.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to connect store';
      });
  },
});

// Export the actions
export const { clearError } = storeSlice.actions;

// Export the reducer
export default storeSlice.reducer;
function getToken() {
  throw new Error('Function not implemented.');
}

