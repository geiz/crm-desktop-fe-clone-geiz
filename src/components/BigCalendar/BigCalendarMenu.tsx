import { Calendar } from 'react-calendar';
import { Value } from 'react-calendar/src/shared/types.js';

import { useCalendarFilters } from 'hooks/useCalendarFilters';
import { useAppSelector } from 'store/store';
import { AppointmentStatus } from 'types/appointmentTypes';

import styles from './BigCalendarMenu.module.css';

//TODO: refactor to use css modules
import 'react-calendar/dist/Calendar.css';
import './calendarStylesOverride.css';

import Checkbox from 'components/ui/Input/Checkbox';

import { checkboxLabelStyle } from 'utils/calendarUtils';

export const BigCalendarMenu = ({ selectedDate }: { selectedDate: Date }) => {
    const { technicians, statuses } = useAppSelector(state => state.calendar);
    const { handleTechnicianChange, handleStatusChange, isTechnicianChecked, isStatusChecked, handleDateChange } = useCalendarFilters();
    const handleChange = (value: Value) => {
        handleDateChange(value as Date);
    };

    return (
        <div className={styles.bigCalendarMenu}>
            <Calendar onChange={handleChange} value={selectedDate} locale='en-US' className={styles.calendar} />
            {technicians.map(technician => (
                <Checkbox
                    key={technician.id}
                    label={technician.name}
                    color={technician.color}
                    className={styles.checkbox}
                    checked={isTechnicianChecked(technician.id)}
                    onChange={handleTechnicianChange(technician.id)}
                    labelStyle={checkboxLabelStyle}
                />
            ))}
            <hr />
            {statuses.map(status => (
                <Checkbox
                    key={status}
                    label={status}
                    color='var(--color-blue-300)'
                    className={styles.checkbox}
                    checked={isStatusChecked(status as AppointmentStatus)}
                    onChange={handleStatusChange(status as AppointmentStatus)}
                    labelStyle={checkboxLabelStyle}
                />
            ))}
        </div>
    );
};
