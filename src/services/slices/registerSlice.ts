import type { PayloadAction } from "@reduxjs/toolkit";

import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import hostname from "../config";

interface RegisterCredentials {
    name: string;
    email: string;
    avatar:string;
    password: string;
}

interface RegisterState {
    loading: boolean;
    success: boolean | null;
    error: string | null;
}

export const registerUser = createAsyncThunk<boolean, RegisterCredentials>(
    'user/registerUser',
    async (registerCredentials: RegisterCredentials) => {
        const response = await axios.post(`${hostname}/auth/register`, registerCredentials);
        return response.status === 201; // Assuming 201 status means success
    }
);

const initialState: RegisterState = {
    loading: false,
    success: null,
    error: null
};

const registerSlice = createSlice({
    name: 'register',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.success = null;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<boolean>) => {
                state.loading = false;
                state.success = action.payload;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.success = null;
                state.error = action.error.message || "Registration failed";
            });
    }
});

export default registerSlice.reducer;
