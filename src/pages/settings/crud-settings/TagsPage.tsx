import CrudSettingsScreen from './CrudSettingsScreen';

import { TableCellColumn } from 'components/Table/types';

import { tagsServices } from 'services/settings/crudSettingsServices';
import { Field } from 'types/settingsTypes';

const COLUMNS: TableCellColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'actions', label: 'Actions' }
];

const FIELDS = [{ key: 'name', label: 'Tag', placeholder: 'Enter tag' }] as Field[];

const Tags = () => {
    return (
        <CrudSettingsScreen
            title='Tags'
            buttonText='Add New Tag'
            btnWidth='16rem'
            apis={tagsServices}
            itemName='tag'
            columns={COLUMNS}
            fields={FIELDS}
            gridTemplateColumns='28rem 4.3rem'
        />
    );
};

export default Tags;
