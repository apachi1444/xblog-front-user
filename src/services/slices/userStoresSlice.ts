import type { PayloadAction } from '@reduxjs/toolkit';

import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getToken } from 'src/utils/auth';

interface StoreState {
  stores: never[] | null; // Use a more generic type or define your structure later
  loading: boolean;
  error: string | null;
}

// Async thunk to fetch user stores
export const getStores = createAsyncThunk<never[], void, { rejectValue: string }>(
  'userStores/getStores',
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const hostname = ""
      const response = await axios.get(`${hostname}/stores`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to fetch stores'
      );
    }
  }
);

const initialState: StoreState = {
  stores: null,
  loading: false,
  error: null,
};

const userStoresSlice = createSlice({
  name: 'userStores',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStores.fulfilled, (state, action: PayloadAction<never[]>) => {
        state.loading = false;
        state.stores = action.payload;
      })
      .addCase(getStores.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch stores';
      });
  },
});

// Export the actions
export const { clearError } = userStoresSlice.actions;

// Export the reducer
export default userStoresSlice.reducer;
