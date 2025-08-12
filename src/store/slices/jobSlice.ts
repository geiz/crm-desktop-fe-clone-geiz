import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { AppointmentStatus } from 'types/appointmentTypes';
import { Billing, Client } from 'types/client';
import { BaseItem, Note } from 'types/common';
import { EstimateCardItem } from 'types/estimateTypes';
import { InvoiceCardItem } from 'types/invoiceTypes';
import { IAppointment, Job, JobDetails, JobStatuses, StatusTime } from 'types/jobTypes';

export interface JobsState {
    id: Job['id'];
    details: JobDetails;
    client: Client;
    billing: Billing;
    appointments: IAppointment[];
    notes: Note[];
    tags: BaseItem[];
    files: BaseItem[];
    statuses: JobStatuses;
    estimates: EstimateCardItem[];
    invoice: InvoiceCardItem;
}

const jobSlice = createSlice({
    name: 'job',
    initialState: {} as JobsState,
    reducers: {
        setSelectedJob: (state, action: PayloadAction<Job>) => ({ ...state, ...action.payload }),
        clearSelectedJob: () => ({}) as JobsState,
        setTags: (state, action: PayloadAction<BaseItem[]>) => {
            state.tags = action.payload;
        },
        setFiles: (state, action: PayloadAction<BaseItem[]>) => {
            state.files = action.payload;
        },
        deleteNote: (state, action: PayloadAction<Note['id']>) => {
            state.notes = state.notes.filter(el => el.id !== action.payload);
        },
        addEditNote: (state, action: PayloadAction<Note>) => {
            const { id } = action.payload;
            state.notes = state.notes.some(note => note.id === id)
                ? state.notes.map(note => (note.id === id ? action.payload : note))
                : [...state.notes, action.payload];
        },
        updateSummary: (state, action: PayloadAction<string>) => {
            state.details = { ...state.details, summary: action.payload };
        },
        updateClientReducer: (state, action: PayloadAction<{ client: Partial<Client>; billing: Partial<Client> }>) => {
            state.client = { ...state.client, ...action.payload.client };
            state.billing = { ...state.billing, ...action.payload.billing };
        },
        // TODO: check if we have to remove this endpoint
        updateBillingReducer: (state, action: PayloadAction<{ data: Partial<Billing> }>) => {
            state.billing = { ...state.billing, ...action.payload.data };
        },
        toggleNotification: (state, action: PayloadAction<{ data: Partial<Client> | Partial<Billing>; section: 'client' | 'billing' }>) => {
            const { data, section } = action.payload;
            if (section === 'client') state.client = { ...state.client, ...data };
            else state.billing = { ...state.billing, ...data };
        },
        createAppointmentReducer: (state, action: PayloadAction<{ appointment: IAppointment; statuses: JobStatuses }>) => {
            state.appointments = [action.payload.appointment, ...state.appointments];
            state.statuses = action.payload.statuses;
        },
        updateAppointmentReducer: (state, action: PayloadAction<{ id: IAppointment['id']; data: Partial<IAppointment>; key?: string }>) => {
            const { id, data, key } = action.payload;
            state.appointments = state.appointments.map(a => {
                if (a.id !== id) return a;
                return key ? { ...a, [key]: data } : { ...a, ...data };
            });
        },
        updateScheduledTime: (state, action: PayloadAction<{ id: IAppointment['id']; data: StatusTime }>) => {
            const { id, data } = action.payload;
            state.appointments = state.appointments.map(a => (a.id !== id ? a : { ...a, statusTime: data }));
        },

        updateFullAppointmentReducer: (
            state,
            action: PayloadAction<{ id: IAppointment['id']; data: { appointment: IAppointment; statuses: Job['statuses'] } }>
        ) => {
            const { id, data } = action.payload;
            state.appointments = state.appointments.map(a => (a.id === id ? data.appointment : a));
            state.statuses = data.statuses;
        },

        updateAppointmentStatusReducer: (
            state,
            action: PayloadAction<{
                id: IAppointment['id'];
                data: IAppointment;
                status: AppointmentStatus;
            }>
        ) => {
            const { id, data, status } = action.payload;
            state.appointments = state.appointments.map(a => (a.id === id ? { ...a, ...data, status } : a));
        },

        updateJobStatuses: (state, action: PayloadAction<JobStatuses>) => {
            state.statuses = action.payload;
        },

        setEstimates: (state, action: PayloadAction<EstimateCardItem[]>) => {
            state.estimates = action.payload;
        },

        setInvoice: (state, action: PayloadAction<InvoiceCardItem>) => {
            state.invoice = action.payload;
        }
    }
});

export const {
    setSelectedJob,
    setTags,
    clearSelectedJob,
    setFiles,
    deleteNote,
    addEditNote,
    updateSummary,
    updateClientReducer,
    createAppointmentReducer,
    updateAppointmentReducer,
    updateAppointmentStatusReducer,
    updateJobStatuses,
    setEstimates,
    setInvoice,
    updateFullAppointmentReducer,
    updateScheduledTime,
    toggleNotification,
    updateBillingReducer
} = jobSlice.actions;

export default jobSlice.reducer;
