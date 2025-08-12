import cn from 'classnames';

import React from 'react';

import styles from './ViewToggle.module.css';

export type ViewMode = 'calendar' | 'schedule';

interface ViewToggleProps {
    currentView: ViewMode;
    onViewChange: (view: ViewMode) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
    return (
        <div className={styles.viewToggle}>
            <button
                type="button"
                className={cn(styles.toggleButton, {
                    [styles.active]: currentView === 'schedule'
                })}
                onClick={() => onViewChange('schedule')}
            >
                Schedule
            </button>
            <button
                type="button"
                className={cn(styles.toggleButton, {
                    [styles.active]: currentView === 'calendar'
                })}
                onClick={() => onViewChange('calendar')}
            >
                Calendar
            </button>
        </div>
    );
};