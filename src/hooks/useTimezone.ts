import dayjs from 'dayjs';

import { TIMEZONES } from 'constants/address';
import { useAppSelector } from 'store/store';
import { SelectOption } from 'types/common';

const useTimezone = () => {
    const { timezone } = useAppSelector(state => state.auth);
    const userTimezone = dayjs.tz.guess();
    const workTimezone = timezone && timezone !== 'NONE' ? timezone : userTimezone;

    const nowInWorkTimezone = dayjs.tz(dayjs(), workTimezone);

    const shiftUTCToTimezoneTimestamp = (timestampUTC: number): number => {
        return dayjs
            .unix(timestampUTC) // 1. Parse the UTC timestamp
            .utc() // 2. Ensure it's treated as UTC
            .tz(workTimezone, true) // 3. Shift it to have the *same clock time* in target timezone
            .unix(); // 4. Return the shifted UNIX timestamp
    };

    // for shifting date for big calendar view
    const shiftDateForBigCalendarView = (timestamp: number): Date => {
        return dayjs.unix(timestamp).add(timeZonesDiff, 'minute').toDate();
    };

    // from timestamp to formatted string time (e.g., 1754038800 -> 9:00 AM)
    const shiftTimeFormatted = (timestamp: number, format: string): string => {
        return dayjs.unix(timestamp).add(timeZonesDiff, 'minute').format(format);
    };

    const parseTimezoneLabel = (timezoneValue: string): { offset: string; label: string } => {
        const timezoneObj = TIMEZONES.find(t => t.value === timezoneValue) || ({} as SelectOption);
        const match = timezoneObj.label.match(/^\((GMT[+-]\d{2}:\d{2})\)\s(.+)$/) || [];

        return {
            offset: match[1], // e.g., 'GMT-05:00'
            label: match[2] // e.g., 'Eastern Time – Toronto (DST)'
        };
    };

    const localOffset = dayjs().utcOffset();
    const targetOffset = dayjs().tz(workTimezone).utcOffset();
    const timeZonesDiff = targetOffset - localOffset; // in minutes

    const getTimezonedFormatedDate = (timestamp: number, format: string) => {
        return dayjs.unix(timestamp).tz(workTimezone).format(format);
    };

    return {
        timezone: workTimezone,
        nowInWorkTimezone,
        parseTimezoneLabel,
        shiftUTCToTimezoneTimestamp,
        shiftDateForBigCalendarView,
        timeZonesDiff,
        getTimezonedFormatedDate,
        shiftTimeFormatted
    };
};

export default useTimezone;
