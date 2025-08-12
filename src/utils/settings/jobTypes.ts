import { TableCellColumn } from 'components/Table/types';

import { JobTypesFormValues } from 'types/settingsTypes';

export const emptyDefaultValues: JobTypesFormValues = {
    serviceType: null,
    componentType: null,
    summary: ''
};

export const tableColumns: TableCellColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'summary', label: 'Summary', isDescription: true, typography: 'body-12R' }
];
