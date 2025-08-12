import { ReactNode } from 'react';

export enum Role {
    TECHNICIAN = 'TECHNICIAN',
    ADMIN = 'ADMIN',
    DISPATCHER = 'DISPATCHER'
}
export interface BaseItem {
    id: number;
    name: string;
    createdAt?: number;
}

export enum Method {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

// TODO get rid of this type
interface GetParams {
    limit?: number;
    page?: number;
    sort?: string;
    order?: string;
    businessUnitId?: number;
    searchTerm?: string;
    typeId?: number;
    technicianIds?: string;
    state?: boolean; // notifications
    startDate?: number;
    endDate?: number;
    name?: string;
    paymentCardId?: number;
    exclude?: string; // for brands API
    sendNotification?: boolean;
    addressId?: string;
}

export interface RequestParams {
    url: string;
    method: Method;
    params?: GetParams;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
    allowDeleteResponse?: boolean;
    withPagination?: boolean;
}

export interface Pagination {
    page: number;
    count: number;
    total: number;
}

interface ApiResponseMeta {
    success: boolean;
    message?: string;
    code?: number;
    pagination?: Pagination;
}

export type PaginatedResponse<T> = {
    data: T;
    pagination: Pagination;
};

export interface ApiResponse<T> {
    meta: ApiResponseMeta;
    response?: T;
}

export interface Address {
    id?: number;
    streetAddress?: string;
    apartment: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    geoLocation?: string;
    streetName: string;
    streetNumber: string;
    buzzer?: string;
}

export enum Category {
    INDIVIDUAL = 'INDIVIDUAL',
    BUSINESS = 'BUSINESS'
}

export enum ContactType {
    EMAIL = 'EMAIL',
    PHONE = 'PHONE'
}

export interface NewNote {
    id: number;
    text: string;
}

export interface Note extends NewNote {
    createdAt: number;
}

export interface FileImg extends BaseItem {
    url: string;
    size?: number;
}

/**
 * number in seconds utc-0
 */
export type DateTimeType = number;

export interface SelectOption {
    value: number | string;
    label: string;
}

export interface AppointmentFormValues {
    description: string;
    appointmentTypeId: SelectOption | string;
    technicianIds: SelectOption[] | string;
    scheduledStart: DateTimeType;
    scheduledEnd: DateTimeType;
}

export interface Company {
    id?: number; // form doesn't need id value
    image: string;
    name: string;
    autocomplete?: string;
    address: Address;
    phone: string;
    email: string;
    timezone: string;
}

export interface IAw {
    scheduledStart: number;
    scheduledEnd: number;
}

export interface DropdownOption {
    label: string | ReactNode;
    onClick: () => void;
}
