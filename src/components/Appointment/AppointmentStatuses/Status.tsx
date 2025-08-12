import TimezonedDate from './TimezonedDate';
import cn from 'classnames';

import React from 'react';

import Popover from 'components/ui/Popover';

import useAppointment from 'hooks/useAppointment';
import { AppointmentStatus } from 'types/appointmentTypes';
import { IAppointment } from 'types/jobTypes';

import styles from './Status.module.css';

interface StatusProps {
    appointment: IAppointment;
}

const Status: React.FC<StatusProps> = ({ appointment }) => {
    const { status, reasonNote } = appointment;
    const { cardsData } = useAppointment(appointment);

    const statuses: Partial<Record<AppointmentStatus, { bg: string; value: string }>> = {
        [AppointmentStatus.ON_HOLD]: { bg: styles.holdColor, value: 'ON HOLD' },
        [AppointmentStatus.CANCELLED]: { bg: styles.cancelColor, value: 'CANCELLED' },
        [AppointmentStatus.SCHEDULED]: { bg: '', value: 'SCHEDULED' },
        [AppointmentStatus.DISPATCHED]: { bg: '', value: 'DISPATCHED' },
        [AppointmentStatus.IN_PROGRESS]: { bg: '', value: 'IN PROGRESS' },
        [AppointmentStatus.COMPLETED]: { bg: '', value: 'COMPLETED' }
    };

    const currentStatus = cardsData.find(el => el.name === appointment.status);

    return (
        <div>
            <div className={styles.jobStatus}>
                <div
                    className={cn(
                        styles.status,
                        statuses[status]?.bg ? 'body-12M' : 'body-14M',
                        { [styles.statusWithBg]: statuses[status]?.bg },
                        statuses[status]?.bg
                    )}>
                    {statuses[status]?.value}
                </div>
                {reasonNote && (
                    <Popover
                        className={cn('body-14M', styles.grey1000)}
                        childrenStyle={styles.popoverChildrenStyle}
                        tooltipText='Click to see more'
                        popoverContent={reasonNote}>
                        <i className='icomoon icon-info' />
                    </Popover>
                )}
            </div>
            {currentStatus && <TimezonedDate currentStatus={currentStatus} />}
        </div>
    );
};

export default Status;
