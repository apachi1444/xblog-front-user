import type { PayloadAction } from '@reduxjs/toolkit';

import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getToken } from 'src/utils/auth';

import hostname from '../config';



interface User {
  name: string;
  email: string;
}

interface UserState {
  userToken: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const fetchUser = createAsyncThunk<User, void, { rejectValue: string }>(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.get(`${hostname}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user data'
      );
    }
  }
);

const initialState: UserState = {
  user: null,
  userToken: null,
  loading: false,
  error: null,
};

export const authenticateWithGoogle = createAsyncThunk(
  'user/authenticateWithGoogle',
  async (accessToken: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${hostname}/auth/google`, {
        access_token: accessToken
      });
      
      // Store the token
      localStorage.setItem('access_token', response.data.token);
      
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Authentication failed');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ user: User; userToken: string }>
    ) => {
      state.user = action.payload.user;
      state.userToken = action.payload.userToken;
    },
    logout: (state) => {
      state.user = null;
      state.userToken = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user data';
      })
      .addCase(authenticateWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authenticateWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(authenticateWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export the actions
export const { clearError, logout, login } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
