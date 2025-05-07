import type { PayloadAction } from "@reduxjs/toolkit";

import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import hostname from "../config";

interface User {

    id: string;
    name: string;
    email: string;
    // Add other properties as needed
}

interface UserState {
    loading: boolean;
    user: User | null;
    error: string | null;
}

interface UserCredentials {
    email: string;
    password: string;
}

export const loginUser = createAsyncThunk<User, UserCredentials>(
    'user/loginUser',
    async (userCredentials: UserCredentials) => {
        const request = await axios.post(`${hostname}/auth/login`, userCredentials);
        const response = await request.data.token_access;
        localStorage.setItem('xblog_access_token_v2', response);
        console.log(response);
        return response;
    }
);

const initialState: UserState = {
    loading: false,
    user: null,
    error: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.user = null;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                console.log(action.error.message);
                if (action.error.message === 'Request failed with status code 400') {
                    state.error = 'Invalid Credentials';
                } else {
                    state.error = action.error.message ?? "";
                }
            });
    }
});

export default userSlice.reducer;
