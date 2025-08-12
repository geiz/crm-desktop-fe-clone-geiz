import React, { useEffect, useState } from 'react';

import { Input, Select } from 'components/ui/Input';

import { END_TIME_AFTER_START_ERROR, START_TIME_BEFORE_END_ERROR } from 'constants/common';
import { TechnicianSchedule } from 'types/settingsTypes';

import styles from './WorkSchedule.module.css';

interface WorkScheduleProps {
    value?: TechnicianSchedule[];
    onChange?: (schedule: TechnicianSchedule[]) => void;
    onValidationChange?: (hasErrors: boolean) => void;
    disabled?: boolean;
}

const DAYS = [
    { id: 1, name: 'Mon', fullName: 'Monday' },
    { id: 2, name: 'Tue', fullName: 'Tuesday' },
    { id: 3, name: 'Wed', fullName: 'Wednesday' },
    { id: 4, name: 'Thu', fullName: 'Thursday' },
    { id: 5, name: 'Fri', fullName: 'Friday' },
    { id: 6, name: 'Sat', fullName: 'Saturday' },
    { id: 7, name: 'Sun', fullName: 'Sunday' }
];

const TIME_OPTIONS = [
    { value: '06:00', label: '6:00 AM' },
    { value: '06:30', label: '6:30 AM' },
    { value: '07:00', label: '7:00 AM' },
    { value: '07:30', label: '7:30 AM' },
    { value: '08:00', label: '8:00 AM' },
    { value: '08:30', label: '8:30 AM' },
    { value: '09:00', label: '9:00 AM' },
    { value: '09:30', label: '9:30 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '10:30', label: '10:30 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '11:30', label: '11:30 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '12:30', label: '12:30 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '13:30', label: '1:30 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '14:30', label: '2:30 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '15:30', label: '3:30 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '16:30', label: '4:30 PM' },
    { value: '17:00', label: '5:00 PM' },
    { value: '17:30', label: '5:30 PM' },
    { value: '18:00', label: '6:00 PM' },
    { value: '18:30', label: '6:30 PM' },
    { value: '19:00', label: '7:00 PM' },
    { value: '19:30', label: '7:30 PM' },
    { value: '20:00', label: '8:00 PM' },
    { value: '20:30', label: '8:30 PM' },
    { value: '21:00', label: '9:00 PM' },
    { value: '21:30', label: '9:30 PM' },
    { value: '22:00', label: '10:00 PM' }
];

export const WorkSchedule: React.FC<WorkScheduleProps> = ({ value = [], onChange, onValidationChange, disabled = false }) => {
    const [selectedDay, setSelectedDay] = useState(1); // Monday by default
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Notify parent component when validation state changes
    useEffect(() => {
        const hasErrors = Object.keys(errors).length > 0;
        onValidationChange?.(hasErrors);
    }, [errors, onValidationChange]);

    // Validation function to check if start time is greater than end time
    const validateTimeRange = (startTime: string, endTime: string): boolean => {
        if (!startTime || !endTime) return true; // No validation if either time is empty

        // Convert time strings to minutes for comparison
        const startMinutes = timeToMinutes(startTime);
        const endMinutes = timeToMinutes(endTime);

        return startMinutes < endMinutes;
    };

    // Validation function for max jobs
    const validateMaxJobs = (maxJobs: number): string | null => {
        if (maxJobs < 1) {
            return 'Must be at least 1';
        }
        if (maxJobs > 20) {
            return 'Must be 20 or less';
        }
        if (!Number.isInteger(maxJobs)) {
            return 'Must be a whole number';
        }
        return null;
    };

    // Helper function to convert time string to minutes
    const timeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    // Initialize schedule if empty
    const initializeSchedule = () => {
        if (value.length === 0) {
            const defaultSchedule = DAYS.map(day => ({
                dayOfWeek: day.id,
                enabled: false,
                maxJobs: 1,
                workTime: undefined,
                preferredWorkTimeEnabled: false,
                preferredWorkTime: undefined
            }));
            onChange?.(defaultSchedule);
            return defaultSchedule;
        }
        return value;
    };

    const schedule = initializeSchedule();
    const currentDaySchedule = schedule.find(s => s.dayOfWeek === selectedDay) || schedule[0];

    const updateSchedule = (dayOfWeek: number, updates: Partial<TechnicianSchedule>) => {
        const updatedSchedule = schedule.map(day => (day.dayOfWeek === dayOfWeek ? { ...day, ...updates } : day));
        onChange?.(updatedSchedule);
    };

    const handleToggleDay = (enabled: boolean) => {
        updateSchedule(selectedDay, { enabled });
        // Clear errors when disabling the day
        if (!enabled) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[`workTimeStart_${selectedDay}`];
                delete newErrors[`workTimeEnd_${selectedDay}`];
                delete newErrors[`preferredTimeStart_${selectedDay}`];
                delete newErrors[`preferredTimeEnd_${selectedDay}`];
                delete newErrors[`maxJobs_${selectedDay}`];
                return newErrors;
            });
        }
    };

    const handleMaxJobsChange = (maxJobs: number) => {
        updateSchedule(selectedDay, { maxJobs });

        // Validate max jobs
        const errorMessage = validateMaxJobs(maxJobs);
        setErrors(prev => {
            const newErrors = { ...prev };
            if (errorMessage) {
                newErrors[`maxJobs_${selectedDay}`] = errorMessage;
            } else {
                delete newErrors[`maxJobs_${selectedDay}`];
            }
            return newErrors;
        });
    };

    const handleMaxJobsBlur = () => {
        // If entering more than 20, change back to 20 on blur
        if (currentDaySchedule.maxJobs > 20) {
            updateSchedule(selectedDay, { maxJobs: 20 });

            // Re-validate with corrected value
            const errorMessage = validateMaxJobs(20);
            setErrors(prev => {
                const newErrors = { ...prev };
                if (errorMessage) {
                    newErrors[`maxJobs_${selectedDay}`] = errorMessage;
                } else {
                    delete newErrors[`maxJobs_${selectedDay}`];
                }
                return newErrors;
            });
        }
    };

    const handleWorkTimeChange = (field: 'start' | 'end', time: string) => {
        const newWorkTime = {
            start: currentDaySchedule.workTime?.start || '',
            end: currentDaySchedule.workTime?.end || '',
            [field]: time
        };

        updateSchedule(selectedDay, { workTime: newWorkTime });

        // Clear previous errors for this field
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[`workTimeStart_${selectedDay}`];
            delete newErrors[`workTimeEnd_${selectedDay}`];
            return newErrors;
        });

        // Validate time range if both times are selected
        if (newWorkTime.start && newWorkTime.end) {
            const isValid = validateTimeRange(newWorkTime.start, newWorkTime.end);
            if (!isValid) {
                setErrors(prev => ({
                    ...prev,
                    [`workTimeStart_${selectedDay}`]: START_TIME_BEFORE_END_ERROR,
                    [`workTimeEnd_${selectedDay}`]: END_TIME_AFTER_START_ERROR
                }));
            }
        }
    };

    const handlePreferredTimeToggle = (enabled: boolean) => {
        updateSchedule(selectedDay, {
            preferredWorkTimeEnabled: enabled,
            preferredWorkTime: enabled ? { start: '', end: '' } : undefined
        });

        // Clear preferred time errors when disabling
        if (!enabled) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[`preferredTimeStart_${selectedDay}`];
                delete newErrors[`preferredTimeEnd_${selectedDay}`];
                return newErrors;
            });
        }
    };

    const handlePreferredTimeChange = (field: 'start' | 'end', time: string) => {
        const newPreferredTime = {
            start: currentDaySchedule.preferredWorkTime?.start || '',
            end: currentDaySchedule.preferredWorkTime?.end || '',
            [field]: time
        };

        updateSchedule(selectedDay, { preferredWorkTime: newPreferredTime });

        // Clear previous errors for this field
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[`preferredTimeStart_${selectedDay}`];
            delete newErrors[`preferredTimeEnd_${selectedDay}`];
            return newErrors;
        });

        // Validate time range if both times are selected
        if (newPreferredTime.start && newPreferredTime.end) {
            const isValid = validateTimeRange(newPreferredTime.start, newPreferredTime.end);
            if (!isValid) {
                setErrors(prev => ({
                    ...prev,
                    [`preferredTimeStart_${selectedDay}`]: START_TIME_BEFORE_END_ERROR,
                    [`preferredTimeEnd_${selectedDay}`]: END_TIME_AFTER_START_ERROR
                }));
            }
        }
    };

    return (
        <div className={styles.container}>
            {/* Day Tabs */}
            <div className={styles.dayTabs}>
                {DAYS.map(day => {
                    const daySchedule = schedule.find(s => s.dayOfWeek === day.id);
                    const isEnabled = daySchedule?.enabled || false;

                    return (
                        <button
                            key={day.id}
                            type='button'
                            className={`${styles.dayTab} ${selectedDay === day.id ? styles.active : ''}`}
                            onClick={() => setSelectedDay(day.id)}
                            disabled={disabled}>
                            {day.name}
                            <span className={`${styles.statusDot} ${isEnabled ? styles.enabled : styles.disabled}`}></span>
                        </button>
                    );
                })}
            </div>

            {/* Day Configuration */}
            <div className={styles.dayConfigWrapper}>
                <div className={styles.dayConfig}>
                    <div className={styles.dayHeader}>
                        {/* Left Column - Toggles */}
                        <div className={styles.leftColumn}>
                            {/* Day Toggle */}
                            <div className={styles.dayToggleRow}>
                                <span className={styles.dayName}>{DAYS.find(d => d.id === selectedDay)?.name}</span>
                                <label className={styles.toggleContainer}>
                                    <input
                                        type='checkbox'
                                        checked={currentDaySchedule.enabled}
                                        onChange={e => handleToggleDay(e.target.checked)}
                                        disabled={disabled}
                                        className={styles.toggleInput}
                                    />
                                    <span className={styles.toggleSlider}></span>
                                </label>
                            </div>

                            {/* Preferred Time Toggle */}
                            {currentDaySchedule.enabled && (
                                <div className={styles.preferredTimeRow}>
                                    <span className={styles.preferredTimeLabel}>Preferred Time</span>
                                    <label className={styles.toggleContainer}>
                                        <input
                                            type='checkbox'
                                            checked={currentDaySchedule.preferredWorkTimeEnabled || false}
                                            onChange={e => handlePreferredTimeToggle(e.target.checked)}
                                            disabled={disabled}
                                            className={styles.toggleInput}
                                        />
                                        <span className={styles.toggleSlider}></span>
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Divider */}
                        <div className={styles.divider}></div>

                        {/* Right Column - Max Jobs */}
                        <div className={styles.rightColumn}>
                            {currentDaySchedule.enabled && (
                                <div className={styles.maxJobsInput}>
                                    <Input
                                        type='number'
                                        label='Max Jobs'
                                        value={currentDaySchedule.maxJobs.toString()}
                                        onChange={e => handleMaxJobsChange(parseInt(e.target.value) || 0)}
                                        onBlur={handleMaxJobsBlur}
                                        min='1'
                                        max='20'
                                        disabled={disabled}
                                        errorMessage={errors[`maxJobs_${selectedDay}`]}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {currentDaySchedule.enabled && (
                        <>
                            {/* Work Time */}
                            <div className={styles.workTimeSection}>
                                <h5 className={styles.workTimeTitle}>Work Time</h5>
                                <div className={styles.timeInputs}>
                                    <div className={styles.timeInput}>
                                        <Select
                                            label='Start time'
                                            value={TIME_OPTIONS.find(opt => opt.value === currentDaySchedule.workTime?.start) || null}
                                            onChange={(option: any) => handleWorkTimeChange('start', option?.value || '')}
                                            options={TIME_OPTIONS}
                                            placeholder='Select start time'
                                            isDisabled={disabled}
                                            errorMessage={errors[`workTimeStart_${selectedDay}`]}
                                        />
                                    </div>
                                    <div className={styles.timeInput}>
                                        <Select
                                            label='End time'
                                            value={TIME_OPTIONS.find(opt => opt.value === currentDaySchedule.workTime?.end) || null}
                                            onChange={(option: any) => handleWorkTimeChange('end', option?.value || '')}
                                            options={TIME_OPTIONS}
                                            placeholder='Select end time'
                                            isDisabled={disabled}
                                            errorMessage={errors[`workTimeEnd_${selectedDay}`]}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Preferred Time */}
                            {currentDaySchedule.preferredWorkTimeEnabled && (
                                <div className={styles.workTimeSection}>
                                    <h5 className={styles.workTimeTitle}>Preferred Time</h5>
                                    <div className={styles.timeInputs}>
                                        <div className={styles.timeInput}>
                                            <Select
                                                label='Start time'
                                                value={
                                                    TIME_OPTIONS.find(opt => opt.value === currentDaySchedule.preferredWorkTime?.start) ||
                                                    null
                                                }
                                                onChange={(option: any) => handlePreferredTimeChange('start', option?.value || '')}
                                                options={TIME_OPTIONS}
                                                placeholder='Select start time'
                                                isDisabled={disabled}
                                                errorMessage={errors[`preferredTimeStart_${selectedDay}`]}
                                            />
                                        </div>
                                        <div className={styles.timeInput}>
                                            <Select
                                                label='End time'
                                                value={
                                                    TIME_OPTIONS.find(opt => opt.value === currentDaySchedule.preferredWorkTime?.end) ||
                                                    null
                                                }
                                                onChange={(option: any) => handlePreferredTimeChange('end', option?.value || '')}
                                                options={TIME_OPTIONS}
                                                placeholder='Select end time'
                                                isDisabled={disabled}
                                                errorMessage={errors[`preferredTimeEnd_${selectedDay}`]}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
