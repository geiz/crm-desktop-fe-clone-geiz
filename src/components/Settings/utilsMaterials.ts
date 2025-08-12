import { TableCellColumn } from 'components/Table/types';

import { MaterialPriceFormValues } from 'types/settingsTypes';

export const emptyDefaultValues: MaterialPriceFormValues = {
    name: '',
    businessUnit: null,
    description: '',
    price: 0
};

export const tableColumns: TableCellColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description', isDescription: true, typography: 'body-12R' },
    { key: 'price', label: 'Price', format: 'price' },
    { key: 'actions', label: 'Actions' }
];
