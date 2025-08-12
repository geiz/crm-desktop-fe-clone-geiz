import formatIdTo8digits from 'utils/formatIdTo8digits';

import styles from './AppointmentId.module.css';

interface AppointmentIdProps {
    appointmentId: string;
}
const AppointmentId = ({ appointmentId }: AppointmentIdProps) => {
    return (
        <div className={styles.jobId}>
            ID: <span className={styles.id}>#{formatIdTo8digits(appointmentId)}</span>
        </div>
    );
};

export default AppointmentId;
