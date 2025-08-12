import dayjs from 'dayjs';
import { Loader } from 'rsuite';

import { useMemo, useState } from 'react';

import { BigCalendar } from 'components/BigCalendar/BigCalendar';
import { BigCalendarMenu } from 'components/BigCalendar/BigCalendarMenu';
import { ScheduleView } from 'components/BigCalendar/ScheduleView';
import { ViewToggle, ViewMode } from 'components/BigCalendar/ViewToggle';
import { Drawer } from 'components/Drawer/Drawer';

import useTimezone from 'hooks/useTimezone';
import { useAppSelector } from 'store/store';
import { getFilteredEvents } from 'utils/calendarUtils';

import styles from './SchedulePage.module.css';

const SchedulePage = () => {
    const { filter, events, isLoading } = useAppSelector(state => state.calendar);
    const { shiftDateForBigCalendarView } = useTimezone();
    const selectedDate = dayjs.unix(filter.selectedDate).toDate();
    const [viewMode, setViewMode] = useState<ViewMode>('calendar');

    const filteredCalendarEvents = useMemo(
        () =>
            getFilteredEvents(events, filter).map(event => ({
                ...event,
                start: shiftDateForBigCalendarView(+event.start),
                end: shiftDateForBigCalendarView(+event.end)
            })),
        [events, filter, shiftDateForBigCalendarView]
    );

    return (
        <div className={styles.schedulePage}>
            <Drawer>
                <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
                <BigCalendarMenu selectedDate={selectedDate} />
            </Drawer>
            <div className={styles.calendarContainer}>
                {viewMode === 'calendar' ? (
                    <BigCalendar events={filteredCalendarEvents} selectedDate={selectedDate} />
                ) : (
                    <ScheduleView selectedDate={selectedDate} events={filteredCalendarEvents} />
                )}
            </div>
            {isLoading && <Loader size='lg' center />}
        </div>
    );
};

export default SchedulePage;