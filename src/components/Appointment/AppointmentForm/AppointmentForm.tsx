import cn from 'classnames';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import ArrivalWindow from 'components/ArrivalWindow/ArrivalWindow';
import Button from 'components/ui/Button';
import { Textarea } from 'components/ui/Input';
import Select from 'components/ui/Input/Select';

import { emptyDefaultValues } from './utils';
import { REQUIRED_FIELD } from 'constants/common';
import useSelectOptions from 'hooks/useSelectOptions';
import { createAppointment, updateAppointment } from 'services/appointmentsService';
import { createAppointmentReducer, updateFullAppointmentReducer } from 'store/slices/jobSlice';
import { useAppDispatch } from 'store/store';
import { AppointmentStatus } from 'types/appointmentTypes';
import { AppointmentFormValues } from 'types/common';
import { IAppointment } from 'types/jobTypes';

import styles from './AppointmentForm.module.css';

interface AppointmentFormProps {
    closeModal: () => void;
    submitBtnTitle: string;
    formTitle: string;
    businessUnitId: number;
    appointment?: IAppointment;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ closeModal, submitBtnTitle, formTitle, businessUnitId, appointment }) => {
    const dispatch = useAppDispatch();
    const { jobId } = useParams();
    const { getTechnicians, getTypes, technicians, types } = useSelectOptions();
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        setValue,
        clearErrors,
        getValues,
        formState: { errors }
    } = useForm({
        defaultValues: appointment
            ? {
                  description: appointment.description,
                  appointmentTypeId: { value: appointment.type.id, label: appointment.type.name },
                  technicianIds: Array.isArray(appointment.technicians)
                      ? appointment.technicians.map(t => ({ value: t.id, label: t.name }))
                      : [],
                  scheduledStart: appointment.statusTime.scheduledStart,
                  scheduledEnd: appointment.statusTime.scheduledEnd
              }
            : emptyDefaultValues,
        mode: 'onChange'
    });

    const handleTimeChange = (data: Record<string, number>) => {
        setValue('scheduledStart', data.scheduledStart);
        setValue('scheduledEnd', data.scheduledEnd);
        clearErrors('scheduledEnd');
    };

    const onSubmit = (data: AppointmentFormValues) => {
        setIsLoading(true);

        if (appointment) {
            const action = appointment.status === AppointmentStatus.CANCELLED ? 'resume' : 'removeHold';
            updateAppointment(data, action, appointment.id)
                .then(res => {
                    dispatch(updateFullAppointmentReducer({ id: appointment.id, data: res }));
                    closeModal();
                })
                .catch(err => toast.error(err.message))
                .finally(() => setIsLoading(false));
        } else {
            createAppointment(data, Number(jobId))
                .then(res => {
                    dispatch(createAppointmentReducer(res));
                    closeModal();
                })
                .catch(err => toast.error(err.message))
                .finally(() => setIsLoading(false));
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={cn(styles.title, 'h-16B')}>{formTitle}</div>
            <div className={styles.inputs}>
                <ArrivalWindow
                    start={getValues('scheduledStart')}
                    end={getValues('scheduledEnd')}
                    handleTimeChange={handleTimeChange}
                    className={styles.fullWidth}
                    errorMessage={errors.scheduledEnd?.message}
                />

                <Controller
                    name='technicianIds'
                    control={control}
                    render={({ field: { name, onChange, value } }) => (
                        <Select
                            label='Technicians'
                            name={name}
                            placeholder='Select technicians'
                            options={technicians.options}
                            value={value}
                            onChange={onChange}
                            onFocus={() => getTechnicians(businessUnitId)}
                            isLoading={technicians.isLoading}
                            isMulti
                        />
                    )}
                />

                <Controller
                    name='appointmentTypeId'
                    control={control}
                    rules={{ required: REQUIRED_FIELD }}
                    render={({ field: { value, onChange, name } }) => (
                        <Select
                            label='Appointment type*'
                            name={name}
                            placeholder='Select appointment type'
                            options={types.options}
                            value={value}
                            onChange={onChange}
                            onFocus={getTypes}
                            errorMessage={errors.appointmentTypeId?.message}
                            isLoading={types.isLoading}
                        />
                    )}
                />
                <Controller
                    name='description'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <div className={styles.fullWidth}>
                            <Textarea
                                label='Description'
                                placeholder='Add a description'
                                value={value}
                                onChange={onChange}
                                maxLength={250}
                                textbox={true}
                            />
                        </div>
                    )}
                />
            </div>
            <div className={styles.actions}>
                <Button onClick={closeModal} type='button' btnStyle='text-btn-m'>
                    Cancel
                </Button>
                <Button btnStyle='blue-m' type='submit' isLoading={isLoading}>
                    {submitBtnTitle}
                </Button>
            </div>
        </form>
    );
};

export default AppointmentForm;
