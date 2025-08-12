import Appointment from './Appointment';
import CollapsedAppointment from './CollapsedAppointment';

import { useState } from 'react';

import { IAppointment } from 'types/jobTypes';

import styles from './AllAppointments.module.css';

interface AllAppointmentProps {
    appointments: IAppointment[];
    businessUnitId: number;
}

const AllAppointments = ({ appointments, businessUnitId }: AllAppointmentProps) => {
    const [expandedIds, setExpandedIds] = useState<number[]>([]);

    const expand = (id: number) => {
        setExpandedIds(prev => [...prev, id]);
    };

    const collapse = (id: number) => {
        const filtered = expandedIds.filter(el => el !== id);
        setExpandedIds(filtered);
    };

    return (
        <div className={styles.container}>
            {appointments.map(a =>
                expandedIds.includes(a.id) ? (
                    <Appointment key={a.id} appointment={a} businessUnitId={businessUnitId} collapse={() => collapse(a.id)} />
                ) : (
                    <CollapsedAppointment key={a.id} appointment={a} businessUnitId={businessUnitId} expand={() => expand(a.id)} />
                )
            )}
        </div>
    );
};

export default AllAppointments;
