import CrudSettingsScreen from './CrudSettingsScreen';

import { TableCellColumn } from 'components/Table/types';

import { brandServices } from 'services/settings/crudSettingsServices';
import { Field } from 'types/settingsTypes';

const COLUMNS: TableCellColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'actions', label: 'Actions' }
];

const FIELDS = [{ key: 'name', label: 'Brand', placeholder: 'Enter brand'}] as Field[];

const BrandPage = () => {
    return (
        <CrudSettingsScreen
            title='Brand'
            buttonText='Add Brand'
            btnWidth='16rem'
            apis={brandServices}
            itemName='brand'
            columns={COLUMNS}
            fields={FIELDS}
            gridTemplateColumns='28rem 4.3rem'
        />
    );
};

export default BrandPage;
