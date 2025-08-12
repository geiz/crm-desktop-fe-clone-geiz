import TimezonedDate from './TimezonedDate';
import cn from 'classnames';

import { toast } from 'react-toastify';

import Dropdown from 'components/ui/Dropdown';
import SuccessCheck from 'components/ui/SuccessCheck';

import useAppointment from 'hooks/useAppointment';
import { updateAppointmentStatus } from 'services/appointmentsService';
import { updateAppointmentStatusReducer, updateJobStatuses } from 'store/slices/jobSlice';
import { useAppDispatch } from 'store/store';
import { AppointmentStatus } from 'types/appointmentTypes';
import { IAppointment } from 'types/jobTypes';
import { capitalizeFirst } from 'utils/capitalizeFirst';

import styles from './ActiveStatus.module.css';

interface ActiveStatusProps {
    appointment: IAppointment;
}

const ActiveStatus: React.FC<ActiveStatusProps> = ({ appointment }) => {
    const dispatch = useAppDispatch();
    const { cardsData } = useAppointment(appointment);

    const handleUpdateAppointmentStatus = (newStatus: AppointmentStatus) => {
        updateAppointmentStatus(`${appointment.id}`, { status: newStatus })
            .then(resp => {
                dispatch(
                    updateAppointmentStatusReducer({
                        id: appointment.id,
                        data: resp.appointment,
                        status: newStatus
                    })
                );
                dispatch(updateJobStatuses(resp.statuses));
            })
            .catch(err => toast.error(err.message));
    };

    const currentStatus = cardsData.find(el => el.name === appointment.status);

    const dropdownLabel = () => {
        if (!currentStatus?.changeTo) return null;

        return (
            <p className={cn(styles.dropdownLabel, 'body-14R')}>
                <span className={styles.arrowIcon}>
                    <i className='icomoon icon-arrow' />
                </span>
                Change to:
                <span className={cn(styles.newStatus, 'body-14M')}>{capitalizeFirst(currentStatus?.changeTo.replace('_', ' '))}</span>
            </p>
        );
    };

    const dropdownOptions = [
        { label: dropdownLabel(), onClick: () => handleUpdateAppointmentStatus(currentStatus?.changeTo as AppointmentStatus) }
    ];

    return (
        <div className={styles.container}>
            <Dropdown
                trigger={
                    <div className={cn(styles.statusWrap, { ['pointer']: dropdownLabel() })}>
                        <SuccessCheck />
                        <div className={cn(styles.status, 'body-14M')}>{appointment.status.replace('_', ' ')}</div>
                        {dropdownLabel() && <i className={cn(styles.dropdownIcon, 'icomoon icon-drop-down-small')} />}
                    </div>
                }
                options={dropdownOptions}
                className={styles.statusWrap}
                disabled={!dropdownLabel()}
            />
            {currentStatus && <TimezonedDate currentStatus={currentStatus} />}
        </div>
    );
};

export default ActiveStatus;
