import dayjs from 'dayjs';

import React from 'react';
import { Event as BigCalendarEvent } from 'react-big-calendar';

import { TIME_FORMAT_A } from 'constants/common';

import styles from './CalendarEvent.module.css';

type EventProps = {
    event: BigCalendarEvent;
    isMonthView: boolean; // Make this required
};

export const CalendarEvent: React.FC<EventProps> = ({ event, isMonthView }) => {
    const { title, start, end } = event;
    const formattedStart = dayjs(start).format(TIME_FORMAT_A);
    const formattedEnd = dayjs(end).format(TIME_FORMAT_A);

    return (
        <div className={styles.eventCard}>
            <div className={styles.title}>{title}</div>
            {!isMonthView && (
                <div className={styles.timeRange}>
                    <span className={styles.timeText}>
                        {formattedStart} - {formattedEnd}
                    </span>
                    {event.resource?.status === 'DISPATCHED' && <span className={styles.icon}>🚚</span>}
                </div>
            )}
        </div>
    );
};
