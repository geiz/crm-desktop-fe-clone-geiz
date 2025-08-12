import dayjs from 'dayjs';

import { DATE_ALPHABETICAL, TIME_FORMAT_A } from 'constants/common';
import useTimezone from 'hooks/useTimezone';
import { AppointmentStatus, StatusCard } from 'types/appointmentTypes';
import { IAw } from 'types/common';

interface TimezonedDateProps {
    currentStatus: StatusCard;
}

const TimezonedDate = ({ currentStatus }: TimezonedDateProps) => {
    const { getTimezonedFormatedDate, timezone } = useTimezone();

    const formatScheduled = (timestamp: number) => dayjs.unix(timestamp).tz(timezone).set('minute', 0).format(TIME_FORMAT_A);

    if (currentStatus.name === AppointmentStatus.SCHEDULED)
        return (
            <div className='body-12SB'>
                {dayjs
                    .unix((currentStatus.time as IAw).scheduledStart)
                    .tz(timezone)
                    .format(DATE_ALPHABETICAL)}
                <br />
                {formatScheduled((currentStatus.time as IAw).scheduledStart)}-{formatScheduled((currentStatus.time as IAw).scheduledEnd)}
            </div>
        );

    return (
        <div className='body-12SB'>
            {getTimezonedFormatedDate(currentStatus.time as number, DATE_ALPHABETICAL)}
            <br />
            {getTimezonedFormatedDate(currentStatus.time as number, TIME_FORMAT_A)}
        </div>
    );
};

export default TimezonedDate;
