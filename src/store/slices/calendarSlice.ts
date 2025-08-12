import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

import { Appointment, AppointmentFilter, Event, Technician } from 'types/appointmentTypes';

interface AppointmentsState {
    appointments: Appointment[];
    technicians: Technician[];
    events: Event[];
    statuses: string[];
    filter: AppointmentFilter;
    isLoading: boolean;
    error: string | null;
}

export const calendarSlice = createSlice({
    name: 'appointments',
    initialState: {
        appointments: [],
        technicians: [],
        events: [],
        statuses: [],
        isLoading: false,
        error: null,
        filter: {
            startDate: dayjs().startOf('month').unix(),
            endDate: dayjs().endOf('month').unix(),
            selectedDate: dayjs().unix(),
            statuses: [],
            technicianIds: []
        }
    } as AppointmentsState,
    reducers: {
        setSelectedDate: (state, action: PayloadAction<Date>) => {
            state.filter = {
                ...state.filter,
                selectedDate: dayjs(action.payload).unix(),
                startDate: dayjs(action.payload).startOf('month').unix(),
                endDate: dayjs(action.payload).endOf('month').unix()
            };
        },
        setFilter: (state, action: PayloadAction<AppointmentFilter>) => {
            state.filter = action.payload;
        },
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setEvents: (state, action: PayloadAction<Event[]>) => {
            state.events = action.payload;
        },
        updateEvent: (state, action: PayloadAction<{ appointmentId: Appointment['id']; data: Partial<Event> }>) => {
            const { appointmentId, data } = action.payload;
            state.events = state.events.map(event => (event.resource.appointmentId === appointmentId ? { ...event, ...data } : event));
        },
        setCalendarData: (
            state,
            action: PayloadAction<{
                appointments: Appointment[];
                technicians: Technician[];
                events: Event[];
                statuses: string[];
            }>
        ) => {
            state.appointments = action.payload.appointments;
            state.technicians = action.payload.technicians;
            state.events = action.payload.events;
            state.statuses = action.payload.statuses;
            state.isLoading = false;
            state.error = null;
        },
        updateAppointment(state, action: PayloadAction<{ id: number; startDate: number; endDate: number }>) {
            const { id, startDate, endDate } = action.payload;
            const appointment = state.appointments.find(a => a.id === id);
            if (appointment) {
                appointment.startDate = startDate;
                appointment.endDate = endDate;
            }
        }
    }
});

export const { setFilter, setIsLoading, setError, setCalendarData, setSelectedDate, setEvents, updateAppointment, updateEvent } =
    calendarSlice.actions;

export default calendarSlice.reducer;
