import { configureStore } from '@reduxjs/toolkit';

import { useDispatch, useSelector, useStore } from 'react-redux';

import authReducer from 'store/slices/authSlice';
import calendarReducer from 'store/slices/calendarSlice';
import employeesReducer from 'store/slices/employeesSlice';
import estimateReducer from 'store/slices/estimateSlice';
import invoiceReducer from 'store/slices/invoiceSlice';
import jobReducer from 'store/slices/jobSlice';
import jobTypesReducer from 'store/slices/jobTypesSlice';
import materialsReducer from 'store/slices/materialsSlice';
import priceBookReducer from 'store/slices/priceBookSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        job: jobReducer,
        calendar: calendarReducer,
        estimate: estimateReducer,
        invoice: invoiceReducer,
        employees: employeesReducer,
        priceBook: priceBookReducer,
        materials: materialsReducer,
        jobTypes: jobTypesReducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: true
        })
});

type RootState = ReturnType<typeof store.getState>;
type AppStore = typeof store;
type AppDispatch = typeof store.dispatch;

export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
