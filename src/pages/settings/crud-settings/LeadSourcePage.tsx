import CrudSettingsScreen from './CrudSettingsScreen';

import { TableCellColumn } from 'components/Table/types';

import { leadSourcesServices } from 'services/settings/crudSettingsServices';
import { Field } from 'types/settingsTypes';

const COLUMNS: TableCellColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'actions', label: 'Actions' }
];

const FIELDS = [{ key: 'name', label: 'Lead source', placeholder: 'Enter lead source' }] as Field[];

const LeadSource = () => {
    return (
        <CrudSettingsScreen
            title='Lead Source'
            buttonText='Add Lead Source'
            btnWidth='18.4rem'
            apis={leadSourcesServices}
            itemName='lead source'
            columns={COLUMNS}
            fields={FIELDS}
            gridTemplateColumns='28rem 4.3rem'
        />
    );
};

export default LeadSource;
