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
                <i className="icon-list" />
                <span>Schedule</span>
            </button>
            <button
                type="button"
                className={cn(styles.toggleButton, {
                    [styles.active]: currentView === 'calendar'
                })}
                onClick={() => onViewChange('calendar')}
            >
                <i className="icon-calendar" />
                <span>Calendar</span>
            </button>
        </div>
    );
};