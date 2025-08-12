import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { getAllAppointmentTypes, updateAppointmentTechnician, updateAppointmentType } from 'services/appointmentsService';
import { getAllTechnicians } from 'services/settings/userService';
import { updateAppointmentReducer } from 'store/slices/jobSlice';
import { useAppDispatch } from 'store/store';
import { AppointmentStatus, StatusCard } from 'types/appointmentTypes';
import { SelectOption } from 'types/common';
import { IAppointment } from 'types/jobTypes';

export function useAppointment(appointment: IAppointment) {
    const dispatch = useAppDispatch();
    const [selectedTechnicianIds, setSelectedTechnicianIds] = useState<number[]>([]);
    const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
    const [techniciansOptions, setTechniciansOptions] = useState<SelectOption[]>([]);
    const [types, setTypes] = useState<SelectOption[]>([]);
    const { type, technicians, statusTime, status } = appointment;

    useEffect(() => {
        setSelectedTechnicianIds(technicians?.map(t => t.id) || []);
        setTechniciansOptions(technicians?.map(el => ({ label: el.name, value: el.id })) || []);
    }, [technicians]);

    useEffect(() => {
        setSelectedTypeId(type.id);
        setTypes([{ label: type.name, value: type.id }]);
    }, [type]);

    const scheduled = status === AppointmentStatus.SCHEDULED;
    const dispatched = status === AppointmentStatus.DISPATCHED;
    const progress = status === AppointmentStatus.IN_PROGRESS;
    const completed = status === AppointmentStatus.COMPLETED;
    const cancelled = status === AppointmentStatus.CANCELLED;
    const hold = status === AppointmentStatus.ON_HOLD;

    const cardsData: StatusCard[] = [
        {
            name: AppointmentStatus.SCHEDULED,
            changeTo: AppointmentStatus.DISPATCHED,
            time: {
                scheduledStart: statusTime.scheduledStart,
                scheduledEnd: statusTime.scheduledEnd
            }
        },
        {
            name: AppointmentStatus.DISPATCHED,
            changeTo: AppointmentStatus.IN_PROGRESS,
            time: statusTime.dispatched
        },
        {
            name: AppointmentStatus.IN_PROGRESS,
            changeTo: AppointmentStatus.COMPLETED,
            time: statusTime.inProgress
        },
        {
            name: AppointmentStatus.COMPLETED,
            time: statusTime.completed
        },
        {
            name: AppointmentStatus.CANCELLED,
            time: statusTime.cancelled
        },
        {
            name: AppointmentStatus.ON_HOLD,
            time: statusTime.onHold
        }
    ];

    const getTechnicians = (businessUnitId: number) => {
        getAllTechnicians(businessUnitId).then(resp => {
            setTechniciansOptions(resp.map(el => ({ value: el.id, label: el.name })));
        });
    };

    const handleTechnicianChange = async (technicianIds: number[]) => {
        setSelectedTechnicianIds(technicianIds);

        updateAppointmentTechnician(appointment.id, technicianIds)
            .then(resp => {
                dispatch(updateAppointmentReducer({ id: appointment.id, data: resp, key: 'technician' }));
            })
            .catch(error => {
                toast.error(error.message);
                setSelectedTechnicianIds(selectedTechnicianIds);
            });
    };

    const getTypes = () => {
        getAllAppointmentTypes().then(resp => {
            setTypes(resp.map(el => ({ value: el.id, label: el.name })));
        });
    };

    const handleTypeChange = (typeId: number) => {
        if (typeId !== selectedTypeId) {
            updateAppointmentType(String(appointment.id), typeId)
                .then(resp => dispatch(updateAppointmentReducer({ id: appointment.id, data: resp, key: 'type' })))
                .catch(error => toast.error(error.message));
        }
    };

    return {
        scheduled,
        dispatched,
        progress,
        completed,
        cancelled,
        hold,
        cardsData,
        handleTypeChange,
        getTypes,
        types,
        selectedTypeId,
        getTechnicians,
        handleTechnicianChange,
        techniciansOptions,
        selectedTechnicianIds,
        technicians
    };
}

export default useAppointment;
