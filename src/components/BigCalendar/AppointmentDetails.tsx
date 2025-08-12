import cn from 'classnames';

import { Link } from 'react-router-dom';

import Button from 'components/ui/Button';

import { TIME_FORMAT_A } from 'constants/common';
import { APP_ROUTES } from 'constants/routes';
import useTimezone from 'hooks/useTimezone';
import { parametrizeRouterURL } from 'routes/utils';
import { useAppSelector } from 'store/store';
import { formatAddress } from 'utils/formatAddress';

import styles from './AppointmentDetails.module.css';

export const AppointmentDetails = ({ appointmentId }: { appointmentId: number }) => {
    const { appointments, technicians } = useAppSelector(state => state.calendar);
    const { shiftTimeFormatted } = useTimezone();
    const appointment = appointments.find(appointment => appointment.id === appointmentId);
    const technicianIds = appointment?.technicians.map(t => t.id) ?? [];
    const assignedTechnicians = technicians.filter(t => technicianIds.includes(t.id)).sort((a, b) => a.name.localeCompare(b.name));
    const formattedTimeRange =
        appointment?.startDate && appointment?.endDate
            ? `${shiftTimeFormatted(appointment?.startDate, TIME_FORMAT_A)} - ${shiftTimeFormatted(appointment?.endDate, TIME_FORMAT_A)}`
            : '';

    return (
        <div className={cn(styles.appointmentDetails, 'body-12M')}>
            <span className={styles.label}>Job ID:</span>
            <Link
                to={parametrizeRouterURL(APP_ROUTES.jobs.item, { jobId: `${appointment?.jobId}` })}
                className={cn(styles.link, 'body-12SB')}>
                {appointment?.jobId}
            </Link>

            <span className={styles.label}>Full Name:</span>
            <span className={styles.value}>{appointment?.clientName}</span>

            <span className={styles.label}>Phone Number:</span>
            <span className={styles.value}>{appointment?.phone}</span>

            <span className={styles.label}>Address:</span>
            <span className={styles.value}>
                <>
                    {appointment?.address ? formatAddress(appointment.address) : 'N/A'}
                    <Button
                        onClick={() => {
                            navigator.clipboard.writeText(appointment?.address ? formatAddress(appointment.address) : 'N/A');
                        }}>
                        <i className='icon-copy' />
                    </Button>
                </>
            </span>

            <span className={styles.label}>Technician:</span>
            <span className={styles.value}>
                {assignedTechnicians.length > 0 ? assignedTechnicians.map(tech => <div key={tech.id}>{tech.name}</div>) : 'N/A'}
            </span>

            <span className={styles.label}>Arrival Window:</span>
            <span className={styles.value}>{formattedTimeRange}</span>
        </div>
    );
};
