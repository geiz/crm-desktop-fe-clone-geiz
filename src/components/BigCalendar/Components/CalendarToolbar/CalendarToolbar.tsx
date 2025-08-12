import React from 'react';
import { ToolbarProps, View } from 'react-big-calendar';

import styles from './CalendarToolbar.module.css';

export const CalendarToolbar: React.FC<ToolbarProps> = ({ label, onNavigate, onView, view, views }) => {
    return (
        <div className={styles.toolbar}>
            <div className={styles.navButtons}>
                <button type='button' className={styles.navButton} onClick={() => onNavigate('PREV')}>
                    {'<'}
                </button>
                <button type='button' className={styles.navButton} onClick={() => onNavigate('TODAY')}>
                    Today
                </button>

                <button type='button' className={styles.navButton} onClick={() => onNavigate('NEXT')}>
                    {'>'}
                </button>
            </div>

            <span className={styles.dateLabel}>{label}</span>

            <div className={styles.viewButtons}>
                {views.map((viewName: View) => (
                    <button
                        key={viewName}
                        type='button'
                        className={`${styles.viewButton} ${view === viewName ? styles.activeView : ''}`}
                        onClick={() => onView(viewName)}>
                        {viewName}
                    </button>
                ))}
            </div>
        </div>
    );
};
