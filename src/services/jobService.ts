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
import { JOB_ENDPOINTS } from 'constants/endpoints';
import { Client, ClientFormValues, UpdateCustomerFormPayload } from 'types/client';
import { ContactType, Method } from 'types/common';
import { Job, JobCreationPayload } from 'types/jobTypes';
import maskToDigitString from 'utils/maskToDigitString';
import phoneToMaskString from 'utils/phoneToMaskString';

interface UpdateContactProps {
    partial: Partial<ClientFormValues>;
    data: ClientFormValues;
    jobId: number;
    newContacts: AdditionalContact[];
    oldContacts: AdditionalContact[];
    isBillingSameContact: boolean;
    initAdditionalContacts: AdditionalContact[];
    additionalContacts: AdditionalContact[];
}

export const updateContactOnJobPage = ({
    partial,
    data,
    jobId,
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

    // format payload structure from partials
    const payload = {} as UpdateCustomerFormPayload;

    if (partial.contact) {
        const contactFields = pickBy(
            {
                name: partial.contact.name,
                phone: maskToDigitString(partial.contact.phone),
                email: partial.contact.email
            },
            value => value !== undefined && value !== null
        );

        Object.assign(payload, contactFields);

        // send whole address if contact address changed
        if (!isEmpty(partial.contact.address)) {
            delete data.contact.address.streetAddress;

            payload.address = {
                ...data.contact.address
            };
        }
    }

    // if billing object changed -> send whole billing data
    if (isBillingSameContact) payload.billing = formatBilling(data.contact);
    else if (partial.billing) payload.billing = formatBilling(data.billing);

    return apiRequest<Client>({
        url: parametrizeURL(JOB_ENDPOINTS.contacts, { jobId }),
        method: Method.PUT,
        data: {
            ...payload,
            ...(isUnchanged ? {} : { additionalContacts: combinedContacts })
        }
    }).then(res => {
        const formatedResponse = formatResponseForCustomerForm(res);
        const contacts = res.additionalContacts.map(el =>
            el.type === ContactType.PHONE ? { ...el, value: phoneToMaskString(el.value) } : el
        );

        return { ...formatedResponse, additionalContacts: contacts };
    });
};

interface UpdateJobNotificationProps {
    newState: boolean;
    jobId: number;
    blockName: 'contact' | 'billing';
    key: 'email' | 'phone';
}
export const updateJobNotifications = ({ newState, jobId, blockName, key }: UpdateJobNotificationProps) => {
    const sectionType: Record<string, string> = {
        contact: 'work',
        billing: 'billing'
    };

    return apiRequest<boolean>({
        url: parametrizeURL(JOB_ENDPOINTS.notifications, { jobId, type: `${sectionType[blockName]}-${key}` }),
        method: Method.PUT,
        params: { state: newState }
    });
};

export const getJob = (jobId: string) => {
    return apiRequest<Job>({ url: parametrizeURL(JOB_ENDPOINTS.get, { jobId }), method: Method.GET });
};

export const getContactsOnJobPage = (jobId: string) => {
    return apiRequest<Client>({ url: parametrizeURL(JOB_ENDPOINTS.contacts, { jobId }), method: Method.GET }).then(res =>
        formatResponseForCustomerForm(res)
    );
};

export const createJob = (payload: JobCreationPayload) => {
    return apiRequest<Job>({ url: JOB_ENDPOINTS.main, method: Method.POST, data: payload });
};
