import cn from 'classnames';
import dayjs from 'dayjs';

import { FC, useEffect, useMemo, useState } from 'react';

import DatePicker from 'components/DatePicker/DatePicker';
import { Input } from 'components/ui/Input';
import Select from 'components/ui/Input/Select';

import { CANNOT_SELECT_PAST_TIME, DATE_FORMAT, INVALID_AW_TIME, REQUIRED_FIELD, TIME_FORMAT_A } from 'constants/common';
import useTimezone from 'hooks/useTimezone';
import { DateTimeType, SelectOption } from 'types/common';
import generateTimeOptions from 'utils/generateTimeOptions';

import styles from './ArrivalWindow.module.css';

interface ArrivalWindowProps {
    start: DateTimeType | null;
    end: DateTimeType | null;
    handleTimeChange: (data: Record<string, number>) => void;
    className?: string;
    errorMessage?: string;
    disabled?: boolean;
}

const ArrivalWindow: FC<ArrivalWindowProps> = ({ start, end, handleTimeChange, className, errorMessage, disabled = false }) => {
    const { nowInWorkTimezone, timezone } = useTimezone();

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [startHour, setStartHour] = useState<number | null>(null);
    const [endHour, setEndHour] = useState<number | null>(null);
    const [dateError, setDateError] = useState('');
    const [timeError, setTimeError] = useState('');
    const timeOptions = useMemo(() => generateTimeOptions(timezone, TIME_FORMAT_A), [timezone]);

    // The function checks whether date d is in the past relative to the current day in the working time zone.
    const isPast = (d: Date) => dayjs.tz(d).isBefore(nowInWorkTimezone, 'day');

    useEffect(() => {
        if (!start || !end) {
            setStartDate(dayjs().tz(timezone).toDate());
            setStartHour(null);
            setEndHour(null);
            return;
        }

        // Processed in timezone
        const s = dayjs.unix(start).tz(timezone);
        const e = dayjs.unix(end).tz(timezone);

        setStartDate(s.startOf('day').toDate());
        setStartHour(s.hour());
        setEndHour(e.hour());
    }, [start, end, timezone]);

    const handleStartHourChange = (newValue: unknown) => {
        const option = newValue as SelectOption;
        const newStartHour = +option?.value;
        setStartHour(newStartHour);
        validateAndUpdateTime(startDate, newStartHour, endHour);
    };

    const handleEndHourChange = (newValue: unknown) => {
        const option = newValue as SelectOption;
        const newEndHour = +option?.value;
        setEndHour(newEndHour);
        validateAndUpdateTime(startDate, startHour, newEndHour);
    };

    const handleDatePickerChange = (newDay: Date) => {
        setStartDate(newDay);
        validateAndUpdateTime(newDay, startHour, endHour);
    };

    const validateAndUpdateTime = (date: Date | null, startHour: number | null, endHour: number | null) => {
        let localDateError = '';
        let localTimeError = '';

        const isTimesSelected = startHour !== null && endHour !== null;

        // check if datepicker has valid date -> case if user manually types in datepicker input
        if (!date || !dayjs(date).isValid()) {
            localDateError = REQUIRED_FIELD;
        } else if (date !== startDate && isPast(date)) {
            localDateError = CANNOT_SELECT_PAST_TIME;
        }

        // case if job were setted in the past (before) but user wants to change only time
        if (date && isPast(date)) {
            localDateError = CANNOT_SELECT_PAST_TIME;
        }

        if (localDateError) {
            setDateError(localDateError);
            return;
        } else setDateError('');

        // check if selected time is correct
        if (!isTimesSelected || startHour >= endHour) {
            localTimeError = INVALID_AW_TIME;
            setTimeError(INVALID_AW_TIME);
            return;
        } else setTimeError('');

        // validation passed => change time
        if (!localDateError && !localTimeError && isTimesSelected) {
            // Build datetime in TIMEZONE COMPANIES
            const startInCompanyTz = dayjs.tz(date, timezone).hour(startHour).minute(0);
            const endInCompanyTz = dayjs.tz(date, timezone).hour(endHour).minute(0);

            const scheduledStart = startInCompanyTz.unix();
            const scheduledEnd = endInCompanyTz.unix();

            handleTimeChange({ scheduledStart, scheduledEnd });
        }
    };

    const formatHour = (h: number | null) => (h !== null ? dayjs().tz(timezone).startOf('day').add(h, 'hour').format(TIME_FORMAT_A) : '');

    return (
        <div className={cn(styles.pickers, className)}>
            {disabled ? (
                <>
                    <Input label='Start date' value={startDate ? dayjs(startDate).format(DATE_FORMAT) : ''} disabled />
                    <Input label='Start time' value={formatHour(startHour)} disabled />
                    <Input label='End time' value={formatHour(endHour)} disabled />
                </>
            ) : (
                <>
                    <DatePicker
                        value={startDate}
                        label='Start date'
                        onChange={handleDatePickerChange}
                        onBlur={() => {
                            if (startDate && startHour !== null && endHour !== null) {
                                validateAndUpdateTime(startDate, startHour, endHour);
                            }
                        }}
                        shouldDisableDate={(d: Date) => isPast(d)}
                        errorMessage={dateError || errorMessage}
                    />
                    <Select
                        label='Start time'
                        options={timeOptions}
                        value={timeOptions.find(opt => opt.value === startHour) || null}
                        onChange={handleStartHourChange}
                        errorMessage={timeError}
                        isSearchable={false}
                    />
                    <Select
                        label='End time'
                        options={timeOptions}
                        value={timeOptions.find(opt => opt.value === endHour) || null}
                        onChange={handleEndHourChange}
                        errorMessage={timeError}
                        isSearchable={false}
                    />
                </>
            )}
        </div>
    );
};

export default ArrivalWindow;
