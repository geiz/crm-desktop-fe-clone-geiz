import { ClientFormSectionValues } from './client';

import { BaseItem, DateTimeType, Role, SelectOption } from 'types/common';

export interface ApiMethods {
    fetch: (page: number, limit: number) => Promise<SettingsDataResponse>;
    create: (data: Record<string, string>) => Promise<BaseItem>;
    update: (id: number, data: Record<string, string>) => Promise<void>;
    delete: (id: number) => Promise<void>;
}

export type SettingsModalType = 'add' | 'edit' | 'confirm-delete';

export interface Field {
    key: string;
    label: string;
    placeholder?: string;
    type?: string;
}

export interface SidebarRoute {
    name: string;
    path: string;
}

export interface SettingsNavItem {
    name: string;
    routes: SidebarRoute[];
}

export enum EmployeeStatus {
    INVITED = 'INVITED',
    ACTIVE = 'ACTIVE',
    DEACTIVATED = 'DEACTIVATED'
}

export interface MaterialPriceFormValues {
    name: string;
    businessUnit: SelectOption | null;
    description: string;
    price: number | string;
    duration?: string;
}

export interface Material extends BaseItem {
    price: number | string;
    description: string;
    businessUnitId: BaseItem['id'];
}

export enum EmployeeAction {
    deactivate = 'deactivate',
    activate = 'activate',
    reinvite = 'reinvite',
    delete = 'delete'
}

export interface Employee {
    id: number;
    name: string;
    email: string;
    status: EmployeeStatus;
    role: Role;
    phone: string;
    slackHandle?: string;
    createdAt: DateTimeType;
    technician?: {
        hourlyRate: string;
        loadRate: string;
        businessUnitId?: number;
        businessUnit?: {
            id: number;
            name: string;
        };
        areas?: {
            primary?: Area;
            nearby: Area[];
            excluded: Area[];
        };
        schedule?: TechnicianSchedule[];
        scheduleSpecifics?: string;
        brands?: {
            supported: Brand[];
            unsupported: Brand[];
        };
        appliances?: {
            individuals: Appliance[];
            businesses: Appliance[];
        };
        customSettings?: {
            [key: string]: string | string[] | boolean | number;
        };
    };
}

export interface EmployeeFormValues {
    id: number;
    name: string;
    email: string;
    status: EmployeeStatus;
    role: SelectOption | string;
    phone: string;
    slackHandle?: string;
    technician: {
        hourlyRate: string;
        loadRate: string;
        businessUnit: SelectOption | string | null;
        areas?: {
            primary?: Area | null;
            nearby: Area[];
            excluded: Area[];
        };
        schedule?: TechnicianSchedule[];
        scheduleSpecifics?: string;
        brands?: {
            supported: SelectOption[];
            unsupported: SelectOption[];
        };
        appliances?: {
            individuals: SelectOption[];
            businesses: SelectOption[];
        };
        customSettings?: CustomFieldsData;
    };
}

export interface PriceBook extends Material {
    duration: string;
}

export interface CompanyDocument {
    text: string;
    name: string;
    title: string;
}
export interface CompanyFormValues {
    company: ClientFormSectionValues;
}

export interface EmployeeStatusAction {
    label: string;
    action: (user: Employee) => void;
    icon?: string; // means it is icon button in edit page
    isRedIcon?: boolean;
}

export type EmployeeStatusActions = {
    [key in EmployeeStatus]: EmployeeStatusAction[];
};

export interface Area {
    id: number;
    name: string;
    zipCode: string;
    country?: string;
}

export interface Brand {
    id: number;
    name: string;
}

export interface Appliance {
    id: number;
    name: string;
}

export interface License {
    id: number;
    name: string;
}

export interface TechnicianSchedule {
    id?: number;
    dayOfWeek: number; // 1-7, 1 = Monday, 7 = Sunday
    enabled: boolean;
    maxJobs: number;
    workTime?: {
        start: string; // HH:mm
        end: string; // HH:mm
    };
    preferredWorkTimeEnabled?: boolean;
    preferredWorkTime?: {
        start: string; // HH:mm
        end: string; // HH:mm
    };
}

export interface GeocodeResponse {
    latt: string;
    longt: string;
    standard?: {
        staddress: string;
        stnumber: string;
        prov: string;
        city: string;
        confidence: string;
    };
    postal: string;
    error?: {
        code: string;
        description: string;
    };
    suggestion?: any;
}

export interface JobType extends BaseItem {
    service: BaseItem;
    component?: BaseItem | null;
    summary: string;
}

export interface JobTypesFormValues {
    serviceType: SelectOption | null;
    componentType?: SelectOption | null;
    summary: string;
}

export interface TaxRatesFormValues {
    name: SelectOption | string;
    ratePercent: number | string;
}

export interface TaxRate extends BaseItem {
    ratePercent: number | string;
}

export type ToggleField = {
    name: string;
    type: 'toggle';
    value: boolean;
};

export type MultiselectField = {
    name: string;
    type: 'multiselect';
    value: string[];
    options?: SelectOption[];
};

export type CustomField = ToggleField | MultiselectField;

export type CustomFieldsData = {
    [key: string]: CustomField['value'];
};

export type CustomFieldsRequest = CustomFieldsData;
export type CustomFieldsResponse = CustomFieldsData;
