import { TableCellColumn, TableCellValue } from 'components/Table/types';

import { TaxRatesFormValues } from 'types/settingsTypes';

export const emptyDefaultValues: TaxRatesFormValues = {
    name: '',
    ratePercent: ''
};

export const tableColumns: TableCellColumn[] = [
    { key: 'name', label: 'Province' },
    {
        key: 'ratePercent',
        label: 'Tax Rate',
        typography: 'body-12M',
        handleValue: (value: TableCellValue) => `${Number(value).toFixed(3)}%`
    },
    { key: 'actions', label: 'Actions' }
];
