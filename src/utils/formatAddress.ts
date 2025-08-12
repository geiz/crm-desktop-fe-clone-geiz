import { Address } from 'types/common';

export const formatAddressFromUserInput = (address: Address): string => {
    const { streetAddress, city, state, zipCode, country } = address;
    const parts = [streetAddress, city, [state, zipCode].filter(Boolean).join(' '), country];

    return parts.filter(Boolean).join(', ');
};
export const formatAddress = (address: Address): string => {
    const { streetName, streetNumber, city, state, zipCode, country } = address;
    const parts = [streetNumber, streetName, city, [state, zipCode].filter(Boolean).join(' '), country];

    return parts.filter(Boolean).join(', ');
};

export const formatAddressWithAppartment = (address: Address): string => {
    const { streetName, streetNumber, city, state, zipCode, country, apartment } = address;
    const parts = [streetNumber, streetName, apartment, city, [state, zipCode].filter(Boolean).join(' '), country];

    return parts.filter(Boolean).join(', ');
};
