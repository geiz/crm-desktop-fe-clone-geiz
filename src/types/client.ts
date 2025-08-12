import { AdditionalContact } from 'components/CustomerForm/types';

import { Address, Category, ContactType } from 'types/common';

export type BlockName = 'contact' | 'billing' | 'company';

export interface ClientFormValues {
    category?: string;
    contact: ClientFormSectionValues;
    billing: ClientFormSectionValues;
}

export interface ClientFormSectionValues {
    name: string;
    phone: string | null;
    email: string;
    autocomplete?: string; // for validation only
    timezone?: string; // company profile form
    address: Address;
}

export interface SearchClient {
    id: number;
    name: string;
    email: string;
    phone: string;
    addresses?: Address[];
    selectedAddressId?: number | null;
}

export interface ClientContact {
    id: number;
    type: ContactType;
    value: string;
}

export interface CreateClientResponse {
    id: number;
    name: string;
    category: Category;
    contacts: ClientContact[];
    additionalContacts: AdditionalContact[];
    addresses: Address[];
    billing: Billing;
}

export interface Billing {
    name: string;
    phone: string;
    email: string;
    address: Address;
    phoneNotification: boolean;
    emailNotification: boolean;
}
export interface Client extends Billing {
    id: number;
    additionalContacts: AdditionalContact[];
    billing: Billing;
}

export interface UpdateCustomerFormPayload {
    name?: string;
    phone?: string | null;
    email?: string;
    address?: Partial<Address>;
    contact?: {
        phone?: string;
        email?: string;
    };
    billing?: {
        name?: string;
        phone?: string | null;
        email?: string;
        address?: Partial<Address>;
    };
}

export interface CreateAddressFormValues {
    contact: {
        autocomplete: string;
        address: Address;
    };
}

export interface CreateAddressResponse {
    address: Address;
    billingAddress?: Billing;
}

export interface SearchSelectOption {
    value: string;
    label: string;
    type: 'client' | 'address';
    client: SearchClient;
    address?: Address;
}

export interface ContactField {
    icon: string;
    value: string;
}

export interface ContactData {
    name: ContactField;
    phone: ContactField;
    email: ContactField;
    address: ContactField;
}
