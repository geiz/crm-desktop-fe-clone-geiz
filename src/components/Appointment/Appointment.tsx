import cn from 'classnames';
import { InlineEdit, Input } from 'rsuite';

import { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import AppointmentForm from 'components/Appointment/AppointmentForm/AppointmentForm';
import Status from 'components/Appointment/AppointmentStatuses/Status';
import CancelForm from 'components/Appointment/CancelForm';
import OnHoldForm from 'components/Appointment/OnHoldForm';
import ArrivalWindow from 'components/ArrivalWindow/ArrivalWindow';
import CharCounter from 'components/CharCounter/CharCounter';
import InformCustomer from 'components/InformCustomer/InformCustomer';
import IconModal from 'components/Modals/IconModal';
import Modal from 'components/Modals/Modal';
import Button from 'components/ui/Button';
import Dropdown from 'components/ui/Dropdown';
import { CheckPicker, InputPicker, Textarea } from 'components/ui/Input';

import { LENGTH_S } from 'constants/common';
import useInformCustomer from 'hooks/useInformCustomer';
import useModal from 'hooks/useModal';
import { updateAppointmentReducer, updateFullAppointmentReducer, updateScheduledTime } from 'store/slices/jobSlice';
import { useAppDispatch, useAppSelector } from 'store/store';
import { AppointmentStatus } from 'types/appointmentTypes';
import { CancelFormValues, IAppointment } from 'types/jobTypes';

import styles from './Appointment.module.css';

import './InlineEditTextarea.css';
import 'rsuite/InlineEdit/styles/index.css';
import 'rsuite/Input/styles/index.css';

import AppointmentId from './AppointmentId';

import ActiveStatus from 'components/Appointment/AppointmentStatuses/ActiveStatus';

// import Tooltip from 'components/ui/Tooltip';

import useAppointment from 'hooks/useAppointment';
import { updateAppointmentAw, updateAppointmentDescription, updateAppointmentStatus } from 'services/appointmentsService';

interface AppointmentProps {
    appointment: IAppointment;
    businessUnitId: number;
    collapse?: () => void;
}

const Appointment: FC<AppointmentProps> = ({ appointment, businessUnitId, collapse }) => {
    const dispatch = useAppDispatch();
    const cancelAppModal = useModal();
    const holdAppModal = useModal();
    const appFormModal = useModal();
    const [description, setDescription] = useState<string>('');
    const { statuses } = useAppSelector(state => state.job);
    const { statusTime, description: sliceDescription } = appointment;
    const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
    //  TODO: client / system timezone difference not implemented
    //const workTimezone: { offset: string; label: string } = parseTimezoneLabel(timezone);
    const [tempStart, setTempStart] = useState(statusTime.scheduledStart);
    const [tempEnd, setTempEnd] = useState(statusTime.scheduledEnd);
    const { openAsyncModal, modalConfig } = useInformCustomer();

    const {
        hold,
        completed,
        cancelled,
        scheduled,
        dispatched,
        progress,
        handleTypeChange,
        getTypes,
        types,
        selectedTypeId,
        getTechnicians,
        techniciansOptions,
        selectedTechnicianIds,
        handleTechnicianChange
    } = useAppointment(appointment);

    useEffect(() => {
        setDescription(sliceDescription || '');
        setTempStart(statusTime.scheduledStart);
        setTempEnd(statusTime.scheduledEnd);
    }, [sliceDescription, statusTime.scheduledStart, statusTime.scheduledEnd]);

    const handleTimeChange = ({ scheduledStart, scheduledEnd }: Record<string, number>) => {
        setTempStart(scheduledStart);
        setTempEnd(scheduledEnd);

        openAsyncModal()
            .then(isNotification => {
                return updateAppointmentAw(
                    appointment.id,
                    {
                        scheduledStart,
                        scheduledEnd
                    },
                    isNotification
                );
            })
            .then(resp => {
                dispatch(
                    updateScheduledTime({
                        id: appointment.id,
                        data: {
                            ...resp,
                            scheduledStart: resp.scheduledStart,
                            scheduledEnd: resp.scheduledEnd
                        }
                    })
                );
            })
            .catch(err => {
                if (err.message.includes('cancel')) {
                    setTempStart(statusTime.scheduledStart);
                    setTempEnd(statusTime.scheduledEnd);
                    toast.info('Appointment time change was cancelled.');
                } else {
                    toast.error(err.message);
                }
            });
    };

    const handleDescriptionSave = (description: string) => {
        updateAppointmentDescription(appointment.id, description)
            .then(data => dispatch(updateAppointmentReducer({ id: appointment.id, data })))
            .catch(error => toast.error(error.message));
    };

    const getAppointmentActions = (status: AppointmentStatus) => {
        const appActions: Partial<Record<AppointmentStatus, { label: string; onClick: () => void }[]>> = {
            [AppointmentStatus.ON_HOLD]: [{ label: 'Remove Hold', onClick: appFormModal.openModal }],
            [AppointmentStatus.CANCELLED]: [{ label: 'Resume', onClick: appFormModal.openModal }]
        };
        const other = [
            { label: 'Cancel ', onClick: cancelAppModal.openModal },
            { label: 'Hold', onClick: holdAppModal.openModal }
        ];

        return appActions[status] || other;
    };

    const cancelAppointment = async (data: CancelFormValues) => {
        return updateAppointmentStatus(String(appointment.id), { ...data, status: AppointmentStatus.CANCELLED })
            .then(resp => {
                dispatch(updateFullAppointmentReducer({ data: resp, id: appointment.id }));
                cancelAppModal.closeModal();
            })
            .catch(err => {
                toast.error(err.message);
            });
    };

    const holdAppointment = async (data: { reasonNote: string }) => {
        return updateAppointmentStatus(String(appointment.id), { ...data, status: AppointmentStatus.ON_HOLD })
            .then(resp => {
                dispatch(updateFullAppointmentReducer({ data: resp, id: appointment.id }));
                holdAppModal.closeModal();
            })
            .catch(err => {
                toast.error(err.message);
            });
    };

    const handleGetTechnicians = () => getTechnicians(businessUnitId);

    return (
        <div className={styles.container}>
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
                    className={styles.type}
                    label='Type'
                    placeholder='Choose type'
                    data={types}
                    value={selectedTypeId}
                    onChange={handleTypeChange}
                    onOpen={getTypes}
                    disabled={completed || cancelled || hold}
                />
                {!completed && (
                    <Dropdown
                        options={getAppointmentActions(appointment.status)}
                        className={styles.moreBtn}
                        disabled={statuses.status === 'ON_HOLD' || statuses.status === 'CANCELLED'}
                    />
                )}
            </div>

            <div className={styles.content}>
                <div className={styles.statusWrap}>
                    <ArrivalWindow
                        start={tempStart}
                        end={tempEnd}
                        handleTimeChange={handleTimeChange}
                        disabled={completed || cancelled || hold}
                    />

                    {/* if !description => nothing to show  */}
                    {(completed || cancelled || hold) && description && (
                        <div className={styles.description}>
                            <h3 className={cn(styles.title, 'body-14R')}>Description:</h3>
                            <Textarea value={description} disabled />
                        </div>
                    )}
                    {!completed && !cancelled && !hold && (
                        <div className={styles.description}>
                            <h3 className={cn(styles.title, 'body-14R')}>Description:</h3>
                            <InlineEdit
                                placeholder='Click to edit ...'
                                style={{ width: 'auto' }}
                                value={description}
                                onChange={(value: string) => setDescription(value)}
                                onSave={() => {
                                    handleDescriptionSave(description.trim());
                                    setIsDescriptionEditing(false);
                                }}
                                onCancel={() => {
                                    setDescription(sliceDescription);
                                    setIsDescriptionEditing(false);
                                }}
                                onEdit={() => setIsDescriptionEditing(true)}>
                                <Input as='textarea' rows={2} maxLength={LENGTH_S} />
                            </InlineEdit>
                            {isDescriptionEditing && description?.length > 0 && <CharCounter current={description.length} max={LENGTH_S} />}
                        </div>
                    )}

                    {collapse && (
                        <Button btnStyle='text' onClick={collapse} className={cn(styles.toggleDetailsBtn, 'body-12M')}>
                            Hide Details
                        </Button>
                    )}
                </div>

                <>
                    {(cancelled || hold) && (
                        <div className={cn(styles.collapsedStyleStatus, 'body-12R')}>
                            <p className={cn(styles.currentStatus)}>Current Status</p>
                            <Status appointment={appointment} />
                        </div>
                    )}

                    {(scheduled || dispatched || progress || completed) && (
                        <div className={cn(styles.activeStatus, 'body-12R')}>
                            <p className={cn(styles.currentStatus)}>Current Status</p>
                            <ActiveStatus appointment={appointment} />
                            {/* TODO: client / system timezone difference not implemented */}
                            {/* <p className={styles.timeZone}>
                                <Tooltip text={`Client: ${workTimezone.offset}`}>
                                    <i className={cn(styles.alertIcon, 'icomoon icon-alert-triangle')} />
                                </Tooltip>
                                {workTimezone.label}
                            </p> */}
                        </div>
                    )}
                </>
            </div>

            <IconModal
                isOpen={cancelAppModal.isOpen}
                onClose={cancelAppModal.closeModal}
                icon={{ font: 'icon-delete-square', red: true }}
                title='Are you sure you want to cancel this appointment?'>
                <CancelForm closeModal={cancelAppModal.closeModal} onSubmit={cancelAppointment} />
            </IconModal>
            <IconModal
                isOpen={holdAppModal.isOpen}
                onClose={holdAppModal.closeModal}
                icon={{ font: 'icon-hold' }}
                title='Are you sure you want to place this appointment on hold?'>
                <OnHoldForm closeModal={holdAppModal.closeModal} onSubmit={holdAppointment} />
            </IconModal>
            {appointment && businessUnitId && (
                <Modal isOpen={appFormModal.isOpen} className={styles.recoverAppointmentModal} onClose={appFormModal.closeModal}>
                    <AppointmentForm
                        closeModal={appFormModal.closeModal}
                        submitBtnTitle='Confirm'
                        formTitle='Recover Appointment'
                        businessUnitId={businessUnitId}
                        appointment={appointment}
                    />
                </Modal>
            )}
            {modalConfig && (
                <Modal isOpen={modalConfig?.isOpen} onClose={modalConfig.onCancel}>
                    <InformCustomer handleCancel={modalConfig?.onCancel} handleNotification={modalConfig?.onConfirm} />
                </Modal>
            )}
        </div>
    );
};

export default Appointment;
