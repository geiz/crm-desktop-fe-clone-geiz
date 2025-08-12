// src/components/BigCalendar/Components/ScheduleToolbar/ScheduleToolbar.tsx
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

    return (
        <div className={styles.toolbar}>
            <div className={styles.navButtons}>
                <button type='button' className={styles.navButton} onClick={handlePrevDay}>
                    {'<'}
                </button>
                <button type='button' className={styles.navButton} onClick={handleToday}>
                    Today
                </button>
                <button type='button' className={styles.navButton} onClick={handleNextDay}>
                    {'>'}
                </button>
            </div>

            <div className={styles.dateDisplay}>
                <span className={styles.dayOfWeek}>
                    {dayjs(selectedDate).format('dddd')}
                </span>
                <span className={styles.date}>
                    {dayjs(selectedDate).format('MMMM D, YYYY')}
                </span>
            </div>

            <div className={styles.createJobButton}>
                <button 
                    type='button' 
                    className={styles.createButton}
                    onClick={() => {
                        // Navigate to create job with selected date
                        const startUtc = dayjs(selectedDate).hour(9).minute(0).second(0).unix();
                        const endUtc = dayjs(selectedDate).hour(10).minute(0).second(0).unix();
                        window.location.href = `/jobs/create?start=${startUtc}&end=${endUtc}`;
                    }}
                >
                    <i className="icon-plus" />
                    <span>Create a Job</span>
                </button>
            </div>
        </div>
    );
};