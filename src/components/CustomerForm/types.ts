import { ClientContact } from 'types/client';

export interface GoogleAddressComponent {
    componentType: string;
    componentName: {
        text: string;
    };
}

export interface AddressSelectOption {
    label: string;
    value: string;
}

export interface AdditionalContact extends ClientContact {
    note: string;
}
