import { AppointmentStatus } from 'types/appointmentTypes';
import { Billing, Client, SearchSelectOption } from 'types/client';
import { BaseItem, Category, IAw, Note, SelectOption } from 'types/common';

export interface JobStatuses {
    status: JobStatus;
    done: number;
    booked: number;
}

export interface JobDetails {
    createdAt: number;
    leadSource: BaseItem;
    category: Category;
    businessUnit: BaseItem;
    typeName: string;
    brands: (BaseItem | string)[];
    summary: string;
    reasonNote?: string;
}

export interface StatusTime {
    scheduledStart: number;
    scheduledEnd: number;
    dispatched: null | number;
    inProgress: null | number;
    completed: null | number;
    onHold: null | number;
    cancelled: null | number;
}

export interface IAppointment {
    id: number;
    publicId: string;
    technicians: BaseItem[];
    type: BaseItem;
    description: string;
    statusTime: StatusTime;
    status: AppointmentStatus;
    reasonNote?: string;
}

export interface Job {
    id: number;
    details: JobDetails;
    client: Client;
    billing: Billing;
    appointments: IAppointment[];
    notes: Note[];
    tags: BaseItem[];
    files: BaseItem[];
    statuses: JobStatuses;
}

export enum JobStatus {
    SCHEDULED = 'SCHEDULED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
    IN_PROGRESS = 'IN_PROGRESS',
    ON_HOLD = 'ON_HOLD'
}

export interface JobValues {
    businessUnit: SelectOption | null;
    jobType: SelectOption | null;
    appointmentType: SelectOption | null;
    leadSource: SelectOption | null;
    brands: SelectOption[];
    category: Category;
    summary: string;
    technicians: SelectOption[] | null;
    tags: SelectOption[];
    notes: string;
    files: Record<string, string | number>[];
    phoneNotification: boolean;
    emailNotification: boolean;
    selectedClient: SearchSelectOption | null;
    searchTerm: string;
    aw: IAw | null;
}

export interface CancelFormValues {
    cancelReasonId: number | null;
    reasonNote: string;
    applyCancellationFee: boolean;
}

export type NotificationKeys = 'phoneNotification' | 'emailNotification';

export interface JobCreationPayload {
    clientId: number;
    businessUnitId: string | number | undefined;
    typeName: string | undefined;
    leadSourceId: string | number | undefined;
    brands: string[];
    category: Category;

    summary: string;
    notes: string;
    addressId: number;
    tags: (number | string)[];
    files: Record<string, string | number>[];
    emailNotification: boolean;
    phoneNotification: boolean;
    appointment: {
        appointmentTypeId: string | number | undefined;
        technicianIds: (string | number)[];
        scheduledStart: number;
        scheduledEnd: number;
    };
}
