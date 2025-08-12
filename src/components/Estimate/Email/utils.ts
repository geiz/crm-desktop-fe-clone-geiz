import { Address } from 'types/common';

export const getGeneratedAddress = (address: Omit<Address, 'apartment'>) =>
    `${address.streetNumber} ${address.streetName} ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
