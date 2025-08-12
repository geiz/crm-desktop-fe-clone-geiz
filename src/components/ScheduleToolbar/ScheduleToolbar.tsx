// src/components/ScheduleToolbar/ScheduleToolbar.tsx
import React from 'react';
import dayjs from 'dayjs';

import styles from './ScheduleToolbar.module.css';

interface ScheduleToolbarProps {
    selectedDate: Date;
    onNavigate: (date: Date) => void;
}

export const ScheduleToolbar: React.FC<ScheduleToolbarProps> = ({ selectedDate, onNavigate }) => {
    const handlePrevDay = () => {
        onNavigate(dayjs(selectedDate).subtract(1, 'day').toDate());
    };

    const handleNextDay = () => {
        onNavigate(dayjs(selectedDate).add(1, 'day').toDate());
    };

    const handleToday = () => {
        onNavigate(new Date());
    };

    const isToday = dayjs(selectedDate).isSame(dayjs(), 'day');

    return (
        <div className={styles.toolbar}>
            <div className={styles.navButtons}>
                <button 
                    type='button' 
                    className={styles.navButton} 
                    onClick={handlePrevDay}
                    aria-label="Previous day"
                >
                    <i className="icon-arrow-left" />
                </button>
                <button 
                    type='button' 
                    className={`${styles.navButton} ${isToday ? styles.todayActive : ''}`}
                    onClick={handleToday}
                >
                    Today
                </button>
                <button 
                    type='button' 
                    className={styles.navButton} 
                    onClick={handleNextDay}
                    aria-label="Next day"
                >
                    <i className="icon-arrow-right" />
                </button>
            </div>

            <div className={styles.dateDisplay}>
                <span className={styles.dayOfWeek}>
                    {dayjs(selectedDate).format('ddd,')}
                </span>
                <span className={styles.date}>
                    {dayjs(selectedDate).format('MMMM D, YYYY')}
                </span>
            </div>
        </div>
    );
};