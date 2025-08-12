import { Category } from 'types/common';
import { JobValues } from 'types/jobTypes';

export const emptyJobValues: JobValues = {
    businessUnit: null,
    jobType: null,
    appointmentType: null,
    leadSource: null,
    brands: [],
    category: Category.INDIVIDUAL,
    summary: '',
    technicians: [],
    tags: [],
    notes: '',
    files: [],
    phoneNotification: false,
    emailNotification: false,
    selectedClient: null,
    searchTerm: '',
    aw: null
};

export const jobFormCheckBoxes: { name: keyof JobValues; label: string }[] = [
    { name: 'emailNotification', label: 'E-mail' },
    { name: 'phoneNotification', label: 'Phone Number' }
];
