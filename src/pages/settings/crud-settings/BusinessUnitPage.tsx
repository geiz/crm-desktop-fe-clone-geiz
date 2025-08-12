import CrudSettingsScreen from './CrudSettingsScreen';

import { TableCellColumn } from 'components/Table/types';

import { businessUnitsServices } from 'services/settings/crudSettingsServices';
import { Field } from 'types/settingsTypes';

const COLUMNS: TableCellColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'actions', label: 'Actions' }
];

const FIELDS = [{ key: 'name', label: 'Category', placeholder: 'Enter business unit' }] as Field[];

const BusinessUnits = () => {
    return (
        <CrudSettingsScreen
            title='Business Unit'
            buttonText='Add Business Unit'
            btnWidth='19.1rem'
            apis={businessUnitsServices}
            itemName='business unit'
            columns={COLUMNS}
            fields={FIELDS}
            gridTemplateColumns='28rem 4.3rem'
        />
    );
};

export default BusinessUnits;
