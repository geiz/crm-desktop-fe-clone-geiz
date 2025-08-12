import { Views } from 'react-big-calendar';

import { Address, IAw } from 'types/common';

export interface Appointment {
    id: number;
    startDate: number;
    endDate: number;
    jobId: number;
    phone: string;
    address: Address;
    clientName: string;
    technicians: Technician[];
    status: AppointmentStatus;
}

export interface Technician {
    id: number | null;
    name: string;
    color: string;
}

export enum AppointmentStatus {
    SCHEDULED = 'SCHEDULED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
    IN_PROGRESS = 'IN_PROGRESS',
    DISPATCHED = 'DISPATCHED',
    ON_HOLD = 'ON_HOLD'
}

export interface AppointmentFilter {
    startDate: number;
    endDate: number;
    selectedDate: number;
    statuses: AppointmentStatus[];
    technicianIds: Technician['id'][];
}

export interface calendarAppointmentProps {
    startDate: number;
    endDate: number;
}

export interface Event {
    title: string;
    start: number | Date;
    end: number | Date;
    resource: {
        appointmentId: number;
        technicians: Technician[];
        color: string;
        status: AppointmentStatus;
        endDate: number;
        jobId: number;
    };
}

export interface MoreEvent {
    id: string;
    title: string;
    start: number | Date;
    end: number | Date;
    resource: {
        isMoreButton: boolean;
        hiddenEvents: MoreEvent[];
        date: string;
    };
}

export type ViewType = (typeof Views)[keyof typeof Views];

export interface StatusCard {
    name: AppointmentStatus;
    changeTo?: AppointmentStatus;
    time: number | IAw | null;
}
