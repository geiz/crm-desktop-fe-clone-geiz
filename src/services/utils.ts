import { omit } from 'lodash';

import { AdditionalContact } from 'components/CustomerForm/types';

import { Client, ClientFormSectionValues } from 'types/client';
import { ContactType } from 'types/common';
import { formatAddress } from 'utils/formatAddress';
import maskToDigitString from 'utils/maskToDigitString';
import phoneToMaskString from 'utils/phoneToMaskString';

/**
 * Utility function used for adding params to API URLs only
 */
export const parametrizeURL = (url: string, params: Record<string, string | number>, process = encodeURIComponent) =>
    Object.keys(params).reduce((result, name) => result.replace(`{${name}}`, process(params[name])), url);

export const mockCall = <T>(response: T, success: boolean | undefined = true, timeout: number | undefined = 2000) =>
    new Promise<T>((resolve, reject) => {
        setTimeout(() => {
            if (success) {
                resolve(response);
            } else {
                reject(new Error('Error'));
            }
        }, timeout);
    });

export const formatNewContacsForPayload = (arr: AdditionalContact[]) =>
    arr
        .filter(el => el.value)
        .map(el => {
            const contact = omit(el, ['id']);
            return contact.type === ContactType.PHONE ? { ...contact, value: maskToDigitString(contact.value) } : contact;
        });

export const formatOldContactsForPayload = (arr: AdditionalContact[]) =>
    arr.filter(el => el.value).map(el => (el.type === ContactType.PHONE ? { ...el, value: maskToDigitString(el.value) } : el));

export const formatResponseForCustomerForm = (res: Client) => {
    return {
        contact: {
            name: res.name,
            phone: phoneToMaskString(res.phone || ''),
            email: res.email,
            autocomplete: formatAddress(res.address), // validation only
            address: { ...res.address, streetAddress: `${res.address.streetNumber} ${res.address.streetName}` }
        },
        billing: {
            name: res.billing.name,
            phone: res.billing.phone ? phoneToMaskString(res.billing.phone) : '',
            email: res.billing.email,
            autocomplete: formatAddress(res.billing.address), // for validation only
            address: {
                ...res.billing.address,
                streetAddress: `${res.billing.address.streetNumber} ${res.billing.address.streetName}`
            }
        },
        additionalContacts: res.additionalContacts.map(el =>
            el.type === ContactType.PHONE ? { ...el, value: phoneToMaskString(el.value) } : el
        )
    };
};

export const formatBilling = (section: ClientFormSectionValues) => {
    const address = omit(section.address, ['id', 'buzzer', 'streetAddress']);

    return {
        name: section.name,
        phone: maskToDigitString(section.phone),
        email: section.email,
        address: { ...address }
    };
};
