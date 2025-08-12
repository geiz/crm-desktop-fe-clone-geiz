import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { JobType } from 'types/settingsTypes';

interface JobTypesState {
    jobTypes: JobType[] | null;
    page: number;
    scrollTop: number;
    total: number;
}

const initialState: JobTypesState = {
    jobTypes: [],
    page: 0,
    scrollTop: 0,
    total: 0
};

const jobTypesSlice = createSlice({
    name: 'jobTypes',
    initialState,
    reducers: {
        storeJobTypes: (state, action: PayloadAction<JobType[]>) => {
            state.jobTypes = action.payload;
        },
        clearJobTypesSlice: state => {
            state.jobTypes = null;
        },
        updateJobTypes: (state, action: PayloadAction<JobType>) => {
            const { id } = action.payload;
            if (state.jobTypes) state.jobTypes = state.jobTypes.map(el => (el.id === id ? action.payload : el));
        },
        addJobTypes: (state, action: PayloadAction<JobType>) => {
            if (state.jobTypes) state.jobTypes = [...state.jobTypes, action.payload];
            else state.jobTypes = [action.payload];
        },
        setJobTypesPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setJobTypesScrollTop: (state, action: PayloadAction<number>) => {
            state.scrollTop = action.payload;
        },
        setJobTypesTotal: (state, action: PayloadAction<number>) => {
            state.total = action.payload;
        }
    }
});

export const { storeJobTypes, clearJobTypesSlice, updateJobTypes, addJobTypes, setJobTypesPage, setJobTypesScrollTop, setJobTypesTotal } =
    jobTypesSlice.actions;

export default jobTypesSlice.reducer;
