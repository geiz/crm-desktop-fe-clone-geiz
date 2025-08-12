import useTimezone from './useTimezone';

import { IAppointment } from 'types/jobTypes';

const useJob = () => {
    const { shiftUTCToTimezoneTimestamp } = useTimezone();

    const getTimezonedAppointments = (appointments: IAppointment[]) =>
        appointments.map(a => {
            return {
                ...a,
                statusTime: {
                    ...a.statusTime,
                    scheduledStart: shiftUTCToTimezoneTimestamp(a.statusTime.scheduledStart),
                    scheduledEnd: shiftUTCToTimezoneTimestamp(a.statusTime.scheduledEnd)
                }
            };
        });

    return { getTimezonedAppointments };
};

export default useJob;
