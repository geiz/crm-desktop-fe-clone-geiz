import { AdditionalContact } from './types';
import { isEqual, omit } from 'lodash';

import { EMAIL_PATTERN, INVALID_EMAIL_FORMAT, INVALID_INPUT, REQUIRED_FIELD } from 'constants/common';
import { ClientFormValues } from 'types/client';
import { SelectOption } from 'types/common';

export const emptyAddress = {
    streetAddress: '', // view only
    apartment: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    streetNumber: '',
    streetName: '',
    buzzer: ''
};

export const emptyClientValues = {
    category: 'INDIVIDUAL',
    contact: {
        name: '',
        phone: '',
        email: '',
        autocomplete: '', // validation only
        address: {
            ...emptyAddress,
            geoLocation: ''
        }
    },
    billing: {
        name: '',
        phone: '',
        email: '',
        autocomplete: '', // for validation only
        address: emptyAddress
    }
};

export const radioBtns: SelectOption[] = [
    { label: 'Individual', value: 'INDIVIDUAL' },
    { label: 'Business', value: 'BUSINESS' }
];

export const requiredComponentTypes = ['route', 'street_number', 'locality', 'postal_code', 'country'];

// getComponentFn funstions order is important - don't change it
export const getForrmatedAddressObject = (getComponentFn: (type: string) => string) => ({
    streetNumber: getComponentFn('street_number'),
    streetName: getComponentFn('route'),
    city: getComponentFn('locality') || getComponentFn('postal_town') || getComponentFn('sublocality_level_1'),
    state: getComponentFn('administrative_area_level_1') || getComponentFn('sublocality_level_1') || getComponentFn('sublocality'),
    zipCode: getComponentFn('postal_code'),
    country: getComponentFn('country') || getComponentFn('political'),
    streetAddress: `${getComponentFn('street_number')} ${getComponentFn('route')}`,
    buzzer: '',
    apartment: ''
});

export const isSameSections = (resp: ClientFormValues) => {
    const omitedClientAddress = omit(resp.contact.address, ['geoLocation', 'buzzer', 'id']);
    const omitedBillingAddress = omit(resp.billing.address, ['geoLocation', 'buzzer', 'id']);

    return isEqual({ ...resp.contact, address: omitedClientAddress }, { ...resp.billing, address: omitedBillingAddress });
};

export const validateEmailContact = (item: AdditionalContact) => {
    if (item.value.length > 0 && !EMAIL_PATTERN.test(item.value)) return INVALID_EMAIL_FORMAT;
    if (!item.value && item.note.trim()) return REQUIRED_FIELD;
    return false;
};

export const validatePhoneContact = (item: AdditionalContact) => {
    if (item.value.length > 0 && item.value.length < 14) return INVALID_INPUT;
    if (!item.value && item.note) return REQUIRED_FIELD;
    return false;
};
