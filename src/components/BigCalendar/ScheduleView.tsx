import dayjs from 'dayjs';
import cn from 'classnames';

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppointmentDetails } from 'components/BigCalendar/AppointmentDetails';
import { CalendarTooltip } from 'components/BigCalendar/Components/CalendarTooltip/CalendarTooltip';
import { CreateAppointment } from 'components/BigCalendar/CreateAppointment';

import { TIME_FORMAT_A } from 'constants/common';
import { APP_ROUTES } from 'constants/routes';
import { useTooltip } from 'hooks/useTooltip';
import useTimezone from 'hooks/useTimezone';
import { parametrizeRouterURL } from 'routes/utils';
import { useAppSelector } from 'store/store';
import { Event } from 'types/appointmentTypes';

import styles from './ScheduleView.module.css';

interface ScheduleViewProps {
    selectedDate: Date;
    events: Event[];
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ selectedDate, events }) => {
    const navigate = useNavigate();
    const { technicians } = useAppSelector(state => state.calendar);
    const { shiftTimeFormatted } = useTimezone();
    const { position, hideTooltip, showTooltip } = useTooltip();
    const { position: appointmentPosition, hideTooltip: hideAppointmentTooltip, showTooltip: showAppointmentTooltip } = useTooltip();
    
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<{ start: number } | null>(null);

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
        for (let hour = 7; hour <= 20; hour++) {
            slots.push({
                hour,
                label: dayjs().hour(hour).minute(0).format(TIME_FORMAT_A),
                timestamp: dayjs(selectedDate).hour(hour).minute(0).unix()
            });
        }
        return slots;
    }, [selectedDate]);

    // Add unassigned to technicians list
    const allTechnicians = useMemo(() => {
        return [...technicians, { id: null, name: 'Unassigned', color: '#9CA3AF' }];
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
            techIds.forEach(techId => {
                const techEvents = technicianMap.get(techId) || [];
                techEvents.push(event);
                technicianMap.set(techId, techEvents);
            });
        });

        return technicianMap;
    }, [dayEvents, allTechnicians]);

    // Calculate event position and dimensions
    const getEventStyle = (event: Event) => {
        const startHour = dayjs(event.start).hour() + dayjs(event.start).minute() / 60;
        const endHour = dayjs(event.end).hour() + dayjs(event.end).minute() / 60;
        const duration = endHour - startHour;
        
        // Position from 7 AM
        const topPosition = Math.max(0, (startHour - 7) * 64); // 64px per hour
        const height = Math.max(56, duration * 64 - 8); // Minimum height of 56px

        return {
            top: `${topPosition}px`,
            height: `${height}px`,
            position: 'absolute' as const,
            left: '4px',
            right: '4px'
        };
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

    const handleSlotClick = (timestamp: number, mouseEvent: React.MouseEvent) => {
        // Check if clicking on an event
        const target = mouseEvent.target as HTMLElement;
        if (target.closest(`.${styles.event}`)) return;
        
        setSelectedSlot({ start: timestamp });
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
        if (currentHour < 7 || currentHour > 21) return null;
        
        return (currentHour - 7) * 64 + 64; // +64 for header
    }, [selectedDate]);

    return (
        <div className={styles.scheduleView}>
            <div className={styles.header}>
                <div className={styles.timeHeader}>
                    <span className={styles.timezone}>GMT-5</span>
                </div>
                {allTechnicians.map(tech => (
                    <div key={tech.id || 'unassigned'} className={styles.technicianHeader}>
                        <div className={styles.technicianInfo}>
                            <div 
                                className={styles.technicianAvatar}
                                style={{ backgroundColor: tech.color }}
                            >
                                {tech.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <span className={styles.technicianName}>{tech.name}</span>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className={styles.scheduleGrid}>
                <div className={styles.timeColumn}>
                    {timeSlots.map(slot => (
                        <div key={slot.hour} className={styles.timeSlot}>
                            <span className={styles.timeLabel}>{slot.label}</span>
                        </div>
                    ))}
                </div>
                
                {allTechnicians.map(tech => (
                    <div key={tech.id || 'unassigned'} className={styles.technicianColumn}>
                        {timeSlots.map(slot => (
                            <div 
                                key={slot.hour} 
                                className={styles.scheduleCell}
                                onClick={(e) => handleSlotClick(slot.timestamp, e)}
                            />
                        ))}
                        
                        <div className={styles.eventsContainer}>
                            {(eventsByTechnician.get(tech.id) || []).map((event, index) => (
                                <div
                                    key={`${event.resource.appointmentId}-${index}`}
                                    className={cn(styles.event, {
                                        [styles.dispatched]: event.resource.status === 'DISPATCHED'
                                    })}
                                    style={{
                                        ...getEventStyle(event),
                                        backgroundColor: event.resource.color || tech.color,
                                        borderColor: event.resource.color || tech.color
                                    }}
                                    onClick={(e) => handleEventClick(event, e)}
                                    onDoubleClick={(e) => handleEventDoubleClick(event, e)}
                                >
                                    <div className={styles.eventContent}>
                                        <div className={styles.eventHeader}>
                                            {event.resource.status === 'DISPATCHED' && (
                                                <span className={styles.dispatchedIcon}>🚚</span>
                                            )}
                                            <span className={styles.eventTitle}>{event.title}</span>
                                        </div>
                                        <div className={styles.eventTime}>
                                            {shiftTimeFormatted(dayjs(event.start).unix(), TIME_FORMAT_A)} - 
                                            {shiftTimeFormatted(dayjs(event.end).unix(), TIME_FORMAT_A)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Current time indicator */}
            {currentTimePosition && (
                <div 
                    className={styles.currentTimeIndicator}
                    style={{ top: `${currentTimePosition}px` }}
                />
            )}
            
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