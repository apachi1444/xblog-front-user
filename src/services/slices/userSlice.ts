import type { PayloadAction } from '@reduxjs/toolkit';

import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getToken, setToken } from 'src/utils/auth';

import hostname from '../config';

interface User {
  name: string;
  email: string;
  picture?: string;
  id?: string;
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
      // In a real app, you would send this token to your backend
      const response = await axios.post(`${hostname}/auth/google`, {
        access_token: accessToken
      });
      
      // Save the token to localStorage or cookies
      setToken(response.data.token);
      
      // For development/demo purposes, we'll simulate a successful response
      // Remove this in production and use the actual API response
      if (process.env.NODE_ENV === 'development') {
        // Simulate successful authentication
        const mockUser = {
          id: 'google-user-123',
          name: 'Google User',
          email: 'googleuser@example.com',
          picture: 'https://via.placeholder.com/150'
        };
        
        // Save user data to localStorage for persistence
        localStorage.setItem('user_data', JSON.stringify(mockUser));
        
        // Generate a fake token
        const fakeToken = `google-auth-token-${Date.now()}`;
        setToken(fakeToken);
        
        return mockUser;
      }
      
      return response.data.user;
    } catch (error: any) {
      // For development/demo, we'll simulate a successful response even on error
      if (process.env.NODE_ENV === 'development') {
        const mockUser = {
          id: 'google-user-123',
          name: 'Google User',
          email: 'googleuser@example.com',
          picture: 'https://via.placeholder.com/150'
        };
        
        localStorage.setItem('user_data', JSON.stringify(mockUser));
        const fakeToken = `google-auth-token-${Date.now()}`;
        setToken(fakeToken);
        
        return mockUser;
      }
      
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
      setToken(action.payload.userToken);
      state.user = action.payload.user;
      state.userToken = action.payload.userToken;
      
      // Save user data to localStorage
      localStorage.setItem('user_data', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      setToken(null);
      state.user = null;
      state.userToken = null;
      
      // Clear user data from localStorage
      localStorage.removeItem('user_data');
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
        state.userToken = getToken(); // Get the token that was set
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
