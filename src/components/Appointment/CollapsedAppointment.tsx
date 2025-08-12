import AppointmentId from './AppointmentId';
import cn from 'classnames';

import Status from 'components/Appointment/AppointmentStatuses/Status';
import Button from 'components/ui/Button';
import { CheckPicker, InputPicker } from 'components/ui/Input';

import useAppointment from 'hooks/useAppointment';
import { IAppointment } from 'types/jobTypes';

import styles from './CollapsedAppointment.module.css';

interface AppointmentProps {
    appointment: IAppointment;
    businessUnitId: number;
    expand: () => void;
}

const CollapsedAppointment: React.FC<AppointmentProps> = ({ appointment, businessUnitId, expand }) => {
    const {
        hold,
        completed,
        cancelled,
        handleTypeChange,
        getTypes,
        types,
        selectedTypeId,
        getTechnicians,
        selectedTechnicianIds,
        handleTechnicianChange,
        techniciansOptions
    } = useAppointment(appointment);

    const handleGetTechnicians = () => getTechnicians(businessUnitId);

    return (
        <div className={styles.container}>
            <div className={styles.inputsBlock}>
                <div className={cn(styles.header, 'body-14R')}>
                    <AppointmentId appointmentId={appointment.publicId} />
                    <span className={cn(styles.technicianLabel, 'body-14R')}>
                        Technician
                        {selectedTechnicianIds?.length === 0 ? <i className='icon-drop-down-small' /> : ':'}
                    </span>
                    <CheckPicker
                        data={techniciansOptions}
                        placeholder='Choose assignee'
                        value={selectedTechnicianIds}
                        onChange={handleTechnicianChange}
                        onOpen={handleGetTechnicians}
                        disabled={completed || cancelled || hold}
                        style={{ width: '26.1rem' }}
                    />
                    <InputPicker
                        label='Type'
                        placeholder='Choose type'
                        data={types}
                        value={selectedTypeId}
                        onChange={handleTypeChange}
                        onOpen={getTypes}
                        disabled={completed || cancelled || hold}
                    />
                </div>
                <Button btnStyle='text' onClick={expand} className={cn(styles.toggleDetailsBtn, 'body-12M')}>
                    View Details
                </Button>
            </div>

            <div className={styles.statusContainer}>
                <Status appointment={appointment} />
            </div>
        </div>
    );
};

export default CollapsedAppointment;
