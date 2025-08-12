import CrudSettingsScreen from './CrudSettingsScreen';

import { TableCellColumn } from 'components/Table/types';

import { estimateCancelReasonsServices } from 'services/settings/crudSettingsServices';
import { Field } from 'types/settingsTypes';

const COLUMNS: TableCellColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'actions', label: 'Actions' }
];

const FIELDS = [{ key: 'name', label: 'Reason', placeholder: 'Enter estimate cancellation reason' }] as Field[];

const EstimateCancelReason = () => {
    return (
        <CrudSettingsScreen
            title='Estimate Cancellation Reason'
            buttonText='Add Reason'
            btnWidth='14.7rem'
            itemLimit={5}
            apis={estimateCancelReasonsServices}
            itemName='estimate cancellation reason'
            columns={COLUMNS}
            fields={FIELDS}
            gridTemplateColumns='28rem 4.3rem'
        />
    );
};

export default EstimateCancelReason;
