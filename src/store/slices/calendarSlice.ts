import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { getTechniciansWithColor, convertAppointmentsToEvents } from 'utils/calendarUtils';
import { Appointment, AppointmentFilter, Event, Technician } from 'types/appointmentTypes';

interface AppointmentsState {
    appointments: Appointment[];
    technicians: Technician[];
    events: Event[];
    statuses: string[];
    filter: AppointmentFilter;
    isLoading: boolean;
    error: string | null;
    viewPreference?: 'calendar' | 'schedule';
}

interface UpdateAppointmentPayload {
    id: number;
    startDate: number;
    endDate: number;
    technicians: Technician[];
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
        updateAppointment: (state, action: PayloadAction<{
            id: number;
            startDate: number;
            endDate: number;
            technicianIds: number[];
        }>) => {
            const { id, startDate, endDate, technicianIds } = action.payload;
            const appointmentIndex = state.appointments.findIndex(a => a.id === id);

            if (appointmentIndex !== -1) {

                const updatedAppointment = {
                    ...state.appointments[appointmentIndex],
                    startDate,
                    endDate,
                    technicians: state.technicians.filter(
                        (t): t is Technician & { id: number } =>
                            t.id != null && technicianIds.includes(t.id)
                    ),
                };

                state.appointments[appointmentIndex] = updatedAppointment;

                // Regenerate events after update
                const techniciansWithColor = getTechniciansWithColor(state.technicians);
                state.events = convertAppointmentsToEvents(state.appointments, techniciansWithColor);
            }
        },

        // Add view preference
        setViewPreference: (state, action: PayloadAction<'calendar' | 'schedule'>) => {
            state.viewPreference = action.payload;
        }
    }
});

export const {
    setFilter, setIsLoading, setError, setCalendarData, setSelectedDate, setEvents, updateEvent,
    updateAppointment,
    setViewPreference
} = calendarSlice.actions;

export default calendarSlice.reducer;
