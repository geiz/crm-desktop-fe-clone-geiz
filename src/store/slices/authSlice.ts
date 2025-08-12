import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { User } from 'types/userTypes';

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    timezone: string;
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: {} as AuthState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
        setTimezone: (state, action: PayloadAction<string>) => {
            state.timezone = action.payload;
        },
        logout: state => {
            state.accessToken = null;
            state.user = null;
            state.timezone = '';
        }
    }
});

export const { setAccessToken, logout, setUser, setTimezone } = authSlice.actions;

export default authSlice.reducer;
