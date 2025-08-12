import React from 'react';

import { BigCalendar } from 'components/BigCalendar/BigCalendar';

import { Event } from 'types/appointmentTypes';

import styles from './CalendarView.module.css';

interface CalendarViewProps {
    selectedDate: Date;
    events: Event[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ selectedDate, events }) => {
    return (
        <div className={styles.calendarView}>
            <BigCalendar events={events} selectedDate={selectedDate} />
        </div>
    );
};