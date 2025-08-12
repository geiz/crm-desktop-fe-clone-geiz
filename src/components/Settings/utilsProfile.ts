import { Company } from 'types/common';
import { formatAddress } from 'utils/formatAddress';
import phoneToMaskString from 'utils/phoneToMaskString';

export const emptyDefaultValues = {
    company: {
        name: '',
        phone: '',
        email: '',
        image: '',
        autocomplete: '',
        timezone: '',
        address: {
            streetAddress: '',
            streetName: '',
            streetNumber: '',
            city: '',
            state: '',
            country: '',
            zipCode: ''
        }
    }
};

export const getCompanyValues = (data: Company) => ({
    name: data.name,
    phone: data.phone ? phoneToMaskString(data.phone) : '',
    email: data.email,
    autocomplete: formatAddress(data.address),
    timezone: data.timezone,
    address: { ...data.address, streetAddress: `${data.address.streetNumber} ${data.address.streetName}` }
});
