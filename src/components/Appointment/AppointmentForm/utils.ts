import { AppointmentFormValues } from 'types/common';

export const emptyDefaultValues: AppointmentFormValues = {
    description: '',
    appointmentTypeId: '',
    technicianIds: '',
    scheduledStart: 0,
    scheduledEnd: 0
};
