import dayjs from 'dayjs';
import cn from 'classnames';

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppointmentDetails } from 'components/BigCalendar/AppointmentDetails';
import { CalendarTooltip } from 'components/BigCalendar/Components/CalendarTooltip/CalendarTooltip';
import { CreateAppointment } from 'components/BigCalendar/CreateAppointment';
import { ScheduleToolbar } from 'components/ScheduleToolbar/ScheduleToolbar';

import { TIME_FORMAT_A } from 'constants/common';
import { APP_ROUTES } from 'constants/routes';
import { useTooltip } from 'hooks/useTooltip';
import useTimezone from 'hooks/useTimezone';
import { parametrizeRouterURL } from 'routes/utils';
import { useAppSelector } from 'store/store';
import { Event, AppointmentStatus } from 'types/appointmentTypes';
import { getColorById } from 'utils/getColorById';

import styles from './ScheduleView.module.css';

interface ScheduleViewProps {
    selectedDate: Date;
    events: Event[];
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ selectedDate, events }) => {
    const navigate = useNavigate();
    const { technicians } = useAppSelector(state => state.calendar);
    const { shiftTimeFormatted, parseTimezoneLabel } = useTimezone();
    const { timezone } = useAppSelector(state => state.auth);
    const { position, hideTooltip, showTooltip } = useTooltip();
    const { position: appointmentPosition, hideTooltip: hideAppointmentTooltip, showTooltip: showAppointmentTooltip } = useTooltip();

    const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<{ start: number; end: number } | null>(null);

    // Parse timezone for display
    const timezoneInfo = useMemo(() => {
        const parsed = parseTimezoneLabel(timezone);
        return parsed.offset?.replace('GMT', '') || 'GMT-4'; // Default to EST if not available
    }, [timezone, parseTimezoneLabel]);

    // Filter events for the selected day only
    const dayEvents = useMemo(() => {
        const startOfDay = dayjs(selectedDate).startOf('day');
        const endOfDay = dayjs(selectedDate).endOf('day');

        return events.filter(event => {
            const eventStart = dayjs(event.start);
            return eventStart.isAfter(startOfDay) && eventStart.isBefore(endOfDay);
        });
    }, [events, selectedDate]);

    // Generate time slots for the day (7 AM to 8 PM)
    const timeSlots = useMemo(() => {
        const slots = [];
        for (let i = 0; i < 24; i++) {
            const hour = (6 + i) % 24; // Start at 6 AM, wrap around after midnight
            slots.push({
                hour,
                displayHour: i, // Index for positioning
                label: dayjs().hour(hour).minute(0).format('h A'),
                timestamp: dayjs(selectedDate).hour(hour).minute(0).unix()
            });
        }
        return slots;
    }, [selectedDate]);

    // Sort technicians alphabetically and add unassigned
    const allTechnicians = useMemo(() => {
        const sorted = [...technicians].sort((a, b) => a.name.localeCompare(b.name));
        return [...sorted, { id: null, name: 'Unassigned', color: getColorById(technicians.length) }];
    }, [technicians]);

    // Group events by technician
    const eventsByTechnician = useMemo(() => {
        const technicianMap = new Map<number | null, Event[]>();

        // Initialize map with all technicians
        allTechnicians.forEach(tech => {
            technicianMap.set(tech.id, []);
        });

        // Group events
        dayEvents.forEach(event => {
            const techIds = event.resource.technicians?.map(t => t.id) || [null];

            // Add event to first technician only (primary assignment)
            const primaryTechId = techIds[0];
            const techEvents = technicianMap.get(primaryTechId) || [];
            techEvents.push(event);
            technicianMap.set(primaryTechId, techEvents);
        });

        return technicianMap;
    }, [dayEvents, allTechnicians]);

    // Calculate event position and dimensions
    const getEventStyle = (event: Event) => {
        const eventStart = dayjs(event.start);
        const eventEnd = dayjs(event.end);

        // Calculate hours from 6 AM
        let startHour = eventStart.hour() + eventStart.minute() / 60;
        let endHour = eventEnd.hour() + eventEnd.minute() / 60;

        // Adjust for times after midnight (0-5 AM should be 18-23 in our display)
        if (startHour < 6) startHour += 24;
        if (endHour < 6) endHour += 24;
        
        // Calculate position from 6 AM (6 AM = position 0)
        const startPosition = startHour - 6;
        const duration = endHour - startHour;

        // Position from 6 AM (changed from 7)
        const topPosition = Math.max(0, startPosition * 45); // 20px per hour
        const height = Math.max(18, duration * 45 - 2); // Minimum height of 18px

        return {
            top: `${topPosition}px`,
            height: `${height}px`,
            position: 'absolute' as const,
            left: '2px',
            right: '2px'
        };
    };

    // Get status-based styling
    const getEventStatusClass = (status: string) => {
        switch (status) {
            case AppointmentStatus.SCHEDULED:
                return styles.scheduled;
            case AppointmentStatus.DISPATCHED:
                return styles.dispatched;
            case AppointmentStatus.IN_PROGRESS:
                return styles.inProgress;
            case AppointmentStatus.COMPLETED:
                return styles.completed;
            case AppointmentStatus.ON_HOLD:
                return styles.onHold;
            default:
                return '';
        }
    };

    const handleEventClick = (event: Event, mouseEvent: React.MouseEvent) => {
        mouseEvent.stopPropagation();
        setSelectedAppointmentId(event.resource.appointmentId);
        showAppointmentTooltip({ x: mouseEvent.pageX, y: mouseEvent.pageY });
    };

    const handleEventDoubleClick = (event: Event, mouseEvent: React.MouseEvent) => {
        mouseEvent.stopPropagation();
        navigate(parametrizeRouterURL(APP_ROUTES.jobs.item, { jobId: String(event.resource.jobId) }));
    };

    const handleSlotClick = (hour: number, technicianId: number | null, mouseEvent: React.MouseEvent) => {
        // Check if clicking on an event
        const target = mouseEvent.target as HTMLElement;
        if (target.closest(`.${styles.event}`)) return;

        const startTime = dayjs(selectedDate).hour(hour).minute(0).unix();
        const endTime = dayjs(selectedDate).hour(hour + 1).minute(0).unix();

        setSelectedSlot({ start: startTime, end: endTime });
        showTooltip({ x: mouseEvent.pageX, y: mouseEvent.pageY });
    };

    const handleCloseAppointmentTooltip = () => {
        setSelectedAppointmentId(null);
        hideAppointmentTooltip();
    };

    const handleCloseTooltip = () => {
        setSelectedSlot(null);
        hideTooltip();
    };

    // Get current time position
    const currentTimePosition = useMemo(() => {
        const now = dayjs();
        if (!now.isSame(selectedDate, 'day')) return null;

        const currentHour = now.hour() + now.minute() / 60;
        if (currentHour < 6 || currentHour > 21) return null; 

        return (currentHour - 6) * 45;
    }, [selectedDate]);

    // Handle date navigation
    const handleDateChange = (date: Date) => {
        // This would dispatch an action to update the selected date in Redux
        // For now, we'll handle it in the parent component
        window.location.href = `/schedule?date=${dayjs(date).format('YYYY-MM-DD')}`;
    };

    return (
        <div className={styles.scheduleView}>
            {/* Toolbar */}
            <ScheduleToolbar selectedDate={selectedDate} onNavigate={handleDateChange} />

            {/* Schedule Grid */}
            <div className={styles.scheduleContent}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.timeHeader}>
                        <div className={styles.timezoneLabel}>
                            <span className={styles.timezoneAbbr}>EST</span>
                            <span className={styles.timezoneOffset}>{timezoneInfo}</span>
                        </div>
                    </div>
                    {allTechnicians.map(tech => (
                        <div key={tech.id || 'unassigned'} className={styles.technicianHeader}>
                            <div className={styles.technicianInfo}>
                                <span className={styles.technicianName}>{tech.name}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Time grid */}
                <div className={styles.scheduleGrid}>
                    {/* Time column */}
                    <div className={styles.timeColumn}>
                        {timeSlots.map(slot => (
                            <div key={slot.hour} className={styles.timeSlot}>
                                <span className={styles.timeLabel}>{slot.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Technician columns */}
                    {allTechnicians.map(tech => (
                        <div key={tech.id || 'unassigned'} className={styles.technicianColumn}>
                            {/* Hour cells */}
                            {timeSlots.map(slot => (
                                <div
                                    key={slot.hour}
                                    className={styles.scheduleCell}
                                    onClick={(e) => handleSlotClick(slot.hour, tech.id, e)}
                                >
                                    {/* Half hour line */}
                                    <div className={styles.halfHourLine} />
                                </div>
                            ))}

                            {/* Events overlay */}
                            <div className={styles.eventsContainer}>
                                {(eventsByTechnician.get(tech.id) || []).map((event, index) => {
                                    const isScheduled = event.resource.status === AppointmentStatus.SCHEDULED;
                                    const isCompleted = event.resource.status === AppointmentStatus.COMPLETED;

                                    return (
                                        <div
                                            key={`${event.resource.appointmentId}-${index}`}
                                            className={cn(
                                                styles.event,
                                                getEventStatusClass(event.resource.status),
                                                {
                                                    [styles.scheduledEvent]: isScheduled,
                                                    [styles.completedEvent]: isCompleted
                                                }
                                            )}
                                            style={{
                                                ...getEventStyle(event),
                                                backgroundColor: isScheduled ? 'var(--color-white)' :
                                                    isCompleted ? `${event.resource.color}20` :
                                                        event.resource.color,
                                                borderColor: event.resource.color,
                                                color: isScheduled ? event.resource.color :
                                                    isCompleted ? 'var(--color-grey-700)' :
                                                        'var(--color-white)'
                                            }}
                                            onClick={(e) => handleEventClick(event, e)}
                                            onDoubleClick={(e) => handleEventDoubleClick(event, e)}
                                        >
                                            <div className={styles.eventContent}>
                                                <div className={styles.eventTitle}>
                                                    {event.resource.status === AppointmentStatus.DISPATCHED && (
                                                        <span className={styles.dispatchIcon}>🚚</span>
                                                    )}
                                                    {event.title}
                                                </div>
                                                <div className={styles.eventTime}>
                                                    {shiftTimeFormatted(dayjs(event.start).unix(), TIME_FORMAT_A)} -
                                                    {shiftTimeFormatted(dayjs(event.end).unix(), TIME_FORMAT_A)}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {/* Current time indicator */}
                    {currentTimePosition !== null && (
                        <div
                            className={styles.currentTimeIndicator}
                            style={{ top: `${currentTimePosition}px` }}
                        />
                    )}
                </div>
            </div>

            {/* Tooltips */}
            <CalendarTooltip position={position} hideTooltip={hideTooltip} callback={handleCloseTooltip}>
                {selectedSlot && <CreateAppointment slot={selectedSlot} />}
            </CalendarTooltip>

            {selectedAppointmentId && appointmentPosition && (
                <CalendarTooltip
                    position={appointmentPosition}
                    hideTooltip={hideAppointmentTooltip}
                    callback={handleCloseAppointmentTooltip}
                >
                    <AppointmentDetails appointmentId={selectedAppointmentId} />
                </CalendarTooltip>
            )}
        </div>
    );
};