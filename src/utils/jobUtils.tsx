import { capitalizeFirst } from './capitalizeFirst';

import AllAppointments from 'components/Appointment/AllAppointments';
import Appointment from 'components/Appointment/Appointment';
import { emptyAddress } from 'components/CustomerForm/utils';

import { CreateAddressFormValues, SearchClient, SearchSelectOption } from 'types/client';
import { BaseItem } from 'types/common';
import { IAppointment, Job } from 'types/jobTypes';
import { formatAddress } from 'utils/formatAddress';

export const formatTags = (tags: BaseItem[]) => tags.map(tag => ({ label: tag.name, value: tag.id }));

export const mapContainerStyles = {
    width: '29.6rem',
    height: '16rem',
    border: '0.2rem solid var(--color-white)',
    borderRadius: '0.8rem'
};

export const getTabsData = (appointments: IAppointment[], details: Job['details']) => ({
    'Current Appointment': <Appointment appointment={appointments[0]} businessUnitId={details?.businessUnit?.id} />,
    'All Appointments': <AllAppointments appointments={appointments} businessUnitId={details?.businessUnit?.id} />
});

export const formatJobDetailsData = (section: Job['details']) => {
    return [
        {
            title: 'Created',
            data: section.createdAt
        },
        {
            title: 'Lead Source',
            data: section.leadSource?.name
        },
        {
            title: 'Category',
            data: capitalizeFirst(section.category)
        },
        {
            title: 'Business Unit',
            data: section.businessUnit?.name
        },
        {
            title: 'Job Type',
            data: section.typeName
        },
        {
            title: (section.brands?.length || 0) === 1 ? 'Brand' : 'Brands',
            data: (section.brands?.length || 0) > 0 ? section.brands.map(b => (typeof b === 'string' ? b : b.name)).join(', ') : undefined
        }
    ];
};

// Forms options for searching clients select on the job creation page
export const formatSearchClientsResultsToOptions = (clients: SearchClient[]): SearchSelectOption[] => {
    return clients.flatMap(client => {
        const clientOpt: SearchSelectOption = {
            value: `client-${client.id}`,
            label: client.name,
            type: 'client',
            client
        };

        const addrOpts: SearchSelectOption[] = Array.isArray(client.addresses)
            ? client.addresses.map(addr => {
                  return {
                      value: `address-${addr.id}`,
                      label: formatAddress(addr),
                      type: 'address',
                      client,
                      address: addr
                  };
              })
            : [];

        return [clientOpt, ...addrOpts];
    });
};

export const emptyCreateAddressFormValues: CreateAddressFormValues = {
    contact: {
        autocomplete: '',
        address: {
            ...emptyAddress,
            geoLocation: ''
        }
    }
};
