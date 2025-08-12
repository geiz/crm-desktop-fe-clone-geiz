import dayjs from 'dayjs';

import { useState } from 'react';

import { AdditionalContact } from 'components/CustomerForm/types';
import { validateEmailContact, validatePhoneContact } from 'components/CustomerForm/utils';

import { ContactType, DropdownOption } from 'types/common';

export interface UseAdditionalMethodsReturn {
    additionalContacts: AdditionalContact[];
    dropdownOptions: DropdownOption[];
    handleDeleteContact: (id: number) => void;
    handleUpdateMethod: (id: number, data: Partial<AdditionalContact>) => void;
    hasInvalidContact: boolean;
}

interface UseAdditionalMethodsProps {
    initAdditionalContacts: AdditionalContact[];
}

const useAdditionalMethods = ({ initAdditionalContacts }: UseAdditionalMethodsProps): UseAdditionalMethodsReturn => {
    const [additionalContacts, setAdditionalContacts] = useState<AdditionalContact[]>(initAdditionalContacts);

    const handleAddMethod = (type: ContactType) => {
        const emptyMethod = {
            id: dayjs().unix(), // number
            note: '',
            value: '',
            type
        };

        setAdditionalContacts(prev => [...prev, emptyMethod]);
    };

    const handleUpdateMethod = (id: number, data: Partial<AdditionalContact>) => {
        setAdditionalContacts(prev => prev.map(contact => (contact.id === id ? { ...contact, ...data } : contact)));
    };

    const handleDeleteContact = (id: number) => {
        const updated = additionalContacts.filter(el => el.id !== id);
        setAdditionalContacts(updated);
    };

    const dropdownOptions = [
        { label: 'Phone Number', onClick: () => handleAddMethod(ContactType.PHONE) },
        { label: 'Email', onClick: () => handleAddMethod(ContactType.EMAIL) }
    ];

    const hasInvalidContact = additionalContacts.some(contact => {
        if (contact.type === ContactType.EMAIL) return validateEmailContact(contact);
        if (contact.type === ContactType.PHONE) return validatePhoneContact(contact);

        return false;
    });

    return {
        additionalContacts,
        hasInvalidContact,
        dropdownOptions,
        handleDeleteContact,
        handleUpdateMethod
    };
};

export default useAdditionalMethods;
