import React from 'react';
import dayjs from 'dayjs';
import cn from 'classnames';

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
            <div className={styles.navigationGroup}>
                <button 
                    type='button' 
                    className={styles.navArrow} 
                    onClick={handlePrevDay}
                    aria-label="Previous day"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                
                <button 
                    type='button' 
                    className={cn(styles.todayButton, { [styles.active]: isToday })}
                    onClick={handleToday}
                >
                    Today
                </button>
                
                <button 
                    type='button' 
                    className={styles.navArrow} 
                    onClick={handleNextDay}
                    aria-label="Next day"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                
                <div className={styles.divider} />
                
                <div className={styles.dateDisplay}>
                    {dayjs(selectedDate).format('ddd, MMMM D, YYYY')}
                </div>
            </div>
        </div>
    );
};