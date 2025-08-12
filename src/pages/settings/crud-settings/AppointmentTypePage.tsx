import CrudSettingsScreen from './CrudSettingsScreen';

import { TableCellColumn } from 'components/Table/types';

import { appointmentTypesServices } from 'services/settings/crudSettingsServices';
import { Field } from 'types/settingsTypes';

const COLUMNS: TableCellColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'actions', label: 'Actions' }
];

const FIELDS = [{ key: 'name', label: 'Appointment type', placeholder: 'Enter appointment type' }] as Field[];

const AppointmentType = () => {
    return (
        <CrudSettingsScreen
            title='Appointment Type'
            buttonText='Add Appointment Type'
            btnWidth='22.3rem'
            apis={appointmentTypesServices}
            itemName='appointment type'
            columns={COLUMNS}
            fields={FIELDS}
            gridTemplateColumns='28rem 4.3rem'
        />
    );
};

export default AppointmentType;
