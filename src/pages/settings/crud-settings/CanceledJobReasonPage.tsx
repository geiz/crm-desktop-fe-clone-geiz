import CrudSettingsScreen from './CrudSettingsScreen';

import { TableCellColumn } from 'components/Table/types';

import { cancelReasonsServices } from 'services/settings/crudSettingsServices';
import { Field } from 'types/settingsTypes';

const COLUMNS: TableCellColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'actions', label: 'Actions' }
];

const FIELDS = [{ key: 'name', label: 'Reason', placeholder: 'Enter job cancellation reason' }] as Field[];

const CanceledJobReason = () => {
    return (
        <CrudSettingsScreen
            title='Job Cancellation Reason'
            buttonText='Add Job Cancellation Reason'
            btnWidth='26.3rem'
            apis={cancelReasonsServices}
            itemName='cancellation reason'
            columns={COLUMNS}
            fields={FIELDS}
            gridTemplateColumns='28rem 4.3rem'
        />
    );
};

export default CanceledJobReason;
