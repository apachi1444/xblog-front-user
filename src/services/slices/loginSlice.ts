
import { createSlice } from "@reduxjs/toolkit";


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

const initialState: UserState = {
    loading: false,
    user: null,
    error: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
});

export default userSlice.reducer;
