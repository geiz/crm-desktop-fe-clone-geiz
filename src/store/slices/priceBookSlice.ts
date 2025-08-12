import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { PriceBook } from 'types/settingsTypes';

interface PriceBookState {
    services: PriceBook[] | null;
    page: number;
    scrollTop: number;
    total: number;
}

const initialState: PriceBookState = {
    services: [],
    page: 0,
    scrollTop: 0,
    total: 0
};

const priceBookSlice = createSlice({
    name: 'priceBook',
    initialState,
    reducers: {
        getAllServicesReducer: (state, action: PayloadAction<PriceBook[]>) => {
            state.services = action.payload;
        },
        clearPriceBookSlice: state => {
            state.services = null;
        },
        updateServiceReducer: (state, action: PayloadAction<PriceBook>) => {
            const { id } = action.payload;
            if (state.services) state.services = state.services.map(el => (el.id === id ? action.payload : el));
        },
        createServiceReducer: (state, action: PayloadAction<PriceBook>) => {
            if (state.services) state.services = [...state.services, action.payload];
            else state.services = [action.payload];
        },
        setPriceBookPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setPriceBookScrollTop: (state, action: PayloadAction<number>) => {
            state.scrollTop = action.payload;
        },
        setPriceBookTotal: (state, action: PayloadAction<number>) => {
            state.total = action.payload;
        }
    }
});

export const {
    getAllServicesReducer,
    clearPriceBookSlice,
    updateServiceReducer,
    createServiceReducer,
    setPriceBookPage,
    setPriceBookScrollTop,
    setPriceBookTotal
} = priceBookSlice.actions;

export default priceBookSlice.reducer;
