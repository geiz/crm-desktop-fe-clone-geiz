import { apiRequest } from './apiUtils';
import { isEmpty, isEqual, pickBy } from 'lodash';

import { AdditionalContact } from 'components/CustomerForm/types';

import {
    formatBilling,
    formatNewContacsForPayload,
    formatOldContactsForPayload,
    formatResponseForCustomerForm,
    parametrizeURL
} from './utils';
import { CLIENTS_ENDPOINTS } from 'constants/endpoints';
import {
    Client,
    ClientFormValues,
    CreateAddressFormValues,
    CreateAddressResponse,
    CreateClientResponse,
    SearchClient,
    UpdateCustomerFormPayload
} from 'types/client';
import { ContactType, Method } from 'types/common';
import { formatAddress } from 'utils/formatAddress';
import maskToDigitString from 'utils/maskToDigitString';
import phoneToMaskString from 'utils/phoneToMaskString';

export const getClientByAddress = (clientId: string, addressId: string) => {
    return apiRequest<CreateClientResponse>({
        method: Method.GET,
        url: parametrizeURL(CLIENTS_ENDPOINTS.clientByAddress, { clientId }),
        params: { addressId }
    }).then(res => {
        const phone = res.contacts.find(el => el.type === ContactType.PHONE)?.value || '';
        const email = res.contacts.find(el => el.type === ContactType.EMAIL)?.value || '';
        const address = res.addresses[0];

        return {
            contact: {
                name: res.name,
                phone: phoneToMaskString(phone),
                email,
                autocomplete: formatAddress(address), // validation only
                address: { ...address, streetAddress: `${address.streetNumber} ${address.streetName}` }
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
    });
};

interface UpdateContactProps {
    partial: Partial<ClientFormValues>;
    data: ClientFormValues;
    clientId: number;
    addressId: number;
    isBillingSameContact: boolean;
    initAdditionalContacts: AdditionalContact[];
    additionalContacts: AdditionalContact[];
}

export const updateContactOnJobCreationPage = ({
    partial,
    data,
    clientId,
    addressId,
    isBillingSameContact,
    initAdditionalContacts,
    additionalContacts
}: UpdateContactProps) => {
    const newContacts = additionalContacts.filter(el => !initAdditionalContacts?.some(c => c.id === el.id));
    const oldContacts = additionalContacts.filter(el => initAdditionalContacts?.some(c => c.id === el.id));
    const formatedNewContacts = formatNewContacsForPayload(newContacts);
    const formatedOldContacts = formatOldContactsForPayload(oldContacts);
    const formatedInitialContact = formatOldContactsForPayload(initAdditionalContacts);
    const combinedContacts = [...formatedOldContacts, ...formatedNewContacts];

    const isUnchanged = isEqual(formatedInitialContact, combinedContacts);

    const payload = {} as UpdateCustomerFormPayload;

    // format payload structure from partials
    if (partial.contact) {
        const contactFields = pickBy(
            {
                name: partial.contact.name
            },
            value => value !== undefined
        );

        Object.assign(payload, contactFields);

        // format contact obj
        const contactPayload = pickBy(
            {
                phone: maskToDigitString(partial.contact.phone),
                email: partial.contact.email
            },
            value => value !== undefined && value !== null
        );

        if (!isEmpty(contactPayload)) {
            payload.contact = contactPayload;
        }

        if (partial.contact.address) {
            delete data.contact.address.streetAddress;

            payload.address = {
                id: addressId,
                ...data.contact.address
            };
        }
    }

    // if billing object changed -> send whole billing data
    if (isBillingSameContact) payload.billing = formatBilling(data.contact);
    else if (partial.billing) payload.billing = formatBilling(data.billing);

    return apiRequest<Client>({
        url: parametrizeURL(CLIENTS_ENDPOINTS.updateContacts, { clientId }),
        method: Method.PUT,
        data: {
            ...payload,
            ...(isUnchanged ? {} : { additionalContacts: combinedContacts })
        }
    }).then(res => {
        // res not always return contact address, so better take it from form data
        const formatedResponse = formatResponseForCustomerForm({ ...res, address: { ...data.contact.address, id: addressId } });
        const contacts = res.additionalContacts.map(el =>
            el.type === ContactType.PHONE ? { ...el, value: phoneToMaskString(el.value) } : el
        );

        return { ...formatedResponse, additionalContacts: contacts };
    });
};

export const createAddress = (data: CreateAddressFormValues, clientId: number, isBillingSameAddress: boolean) => {
    const address = { ...data.contact.address };

    const dataToSend = {
        address,
        ...(isBillingSameAddress && { billingAddress: address })
    };

    return apiRequest<CreateAddressResponse>({
        url: parametrizeURL(CLIENTS_ENDPOINTS.postAddress, { clientId }),
        method: Method.POST,
        data: dataToSend
    });
};

export const createClient = (data: ClientFormValues, additionalContacts: AdditionalContact[], isBillingSameAddress: boolean) => {
    const { contact, billing } = data;
    delete contact.address.streetAddress;

    const payload = {
        ...data,
        name: contact.name,
        contact: {
            phone: maskToDigitString(contact.phone),
            email: contact.email
        },
        additionalContacts: formatNewContacsForPayload(additionalContacts),
        address: { ...contact.address },
        billing: isBillingSameAddress ? formatBilling(contact) : formatBilling(billing)
    };

    return apiRequest<CreateClientResponse>({ url: CLIENTS_ENDPOINTS.postClient, method: Method.POST, data: payload });
};

export const getSearchClients = (searchTerm: string) => {
    return apiRequest<SearchClient[]>({ url: CLIENTS_ENDPOINTS.search, method: Method.GET, params: { searchTerm, limit: 20 } });
};
