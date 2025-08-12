import { apiRequest } from './apiUtils';

import { parametrizeURL } from './utils';
import { APPOINTMENTS_ENDPOINTS, SETTINGS_ENDPOINTS } from 'constants/endpoints';
import { Appointment, Technician, calendarAppointmentProps } from 'types/appointmentTypes';
import { AppointmentFormValues, BaseItem, Method, SelectOption } from 'types/common';
import { IAppointment, Job, JobStatuses } from 'types/jobTypes';

const formatAppointmentPayload = (data: AppointmentFormValues) => ({
    technicianIds: Array.isArray(data.technicianIds) ? data.technicianIds.map(el => el.value) : [],
    scheduledStart: data.scheduledStart,
    scheduledEnd: data.scheduledEnd,
    appointmentTypeId: (data.appointmentTypeId as SelectOption).value,
    description: data.description
});

export const getCalendarAppointments = (data: calendarAppointmentProps) => {
    return apiRequest<{
        appointments: Appointment[];
        technicians: Technician[];
    }>({
        url: APPOINTMENTS_ENDPOINTS.getCalendarAppointments,
        method: Method.GET,
        params: { ...data }
    });
};

export const createAppointment = (data: AppointmentFormValues, jobId: number) => {
    return apiRequest<{ appointment: IAppointment; statuses: JobStatuses }>({
        url: parametrizeURL(APPOINTMENTS_ENDPOINTS.postAppointment, { jobId }),
        method: Method.POST,
        data: formatAppointmentPayload(data)
    });
};

export const updateAppointment = (data: AppointmentFormValues, action: 'resume' | 'removeHold', appointmentId: number) => {
    return apiRequest<{ appointment: IAppointment; statuses: Job['statuses'] }>({
        url: parametrizeURL(APPOINTMENTS_ENDPOINTS[action], { appointmentId }),
        method: Method.PUT,
        data: formatAppointmentPayload(data)
    });
};

export const updateAppointmentStatus = (appointmentId: string, data: Partial<IAppointment>) => {
    return apiRequest<{ appointment: IAppointment; statuses: Job['statuses'] }>({
        url: parametrizeURL(APPOINTMENTS_ENDPOINTS.updateStatus, { appointmentId }),
        method: Method.PUT,
        data
    });
};

export const updateAppointmentType = (appointmentId: string, typeId: number) => {
    return apiRequest<BaseItem>({
        url: parametrizeURL(APPOINTMENTS_ENDPOINTS.updateType, { appointmentId }),
        method: Method.PUT,
        params: { typeId }
    });
};

export const getAllAppointmentTypes = (limit?: number) => {
    return apiRequest<BaseItem[]>({ url: SETTINGS_ENDPOINTS.appointmentTypes, method: Method.GET, params: { limit } });
};

export const updateAppointmentTechnician = (appointmentId: number, technicianIds: number[]) => {
    return apiRequest<BaseItem>({
        url: parametrizeURL(APPOINTMENTS_ENDPOINTS.updateTechnician, { appointmentId }),
        method: Method.PUT,
        params: { technicianIds: technicianIds.join(',') }
    });
};

export const updateAppointmentDescription = (appointmentId: number, description: string) => {
    return apiRequest<Partial<IAppointment>>({
        url: parametrizeURL(APPOINTMENTS_ENDPOINTS.updateDescription, { appointmentId }),
        method: Method.PUT,
        data: { description }
    });
};

export const updateAppointmentAw = (appointmentId: number, data: Record<string, number>, sendNotification?: boolean) => {
    return apiRequest<IAppointment['statusTime']>({
        url: parametrizeURL(APPOINTMENTS_ENDPOINTS.updateAw, { appointmentId }),
        method: Method.PUT,
        data,
        params: { sendNotification }
    });
};
