import dayjs from 'dayjs';

import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from 'store/store';
import { updateAppointment } from 'store/slices/calendarSlice';
import { Event } from 'types/appointmentTypes';

export const useScheduleView = () => {
    const dispatch = useAppDispatch();
    const { appointments, technicians } = useAppSelector(state => state.calendar);

    // Handle drag and drop of events
    const handleEventDrop = useCallback(
        (eventId: number, newTechnicianId: number | null, newStartTime: Date) => {
            const appointment = appointments.find(a => a.id === eventId);
            if (!appointment) return;

            const duration = dayjs(appointment.endDate).diff(dayjs(appointment.startDate), 'minute');
            const newEndTime = dayjs(newStartTime).add(duration, 'minute').toDate();

            // Get technician IDs for update
            const technicianIds = newTechnicianId ? [newTechnicianId] : [];

            dispatch(
                updateAppointment({
                    id: eventId,
                    startDate: newStartTime.getTime(),
                    endDate: newEndTime.getTime(),
                    technicianIds
                })
            );
        },
        [appointments, technicians, dispatch]
    );

    // Calculate if events overlap
    const checkEventOverlap = useCallback((event1: Event, event2: Event): boolean => {
        if (event1.resource.appointmentId === event2.resource.appointmentId) return false;
        
        const start1 = dayjs(event1.start).unix();
        const end1 = dayjs(event1.end).unix();
        const start2 = dayjs(event2.start).unix();
        const end2 = dayjs(event2.end).unix();

        return (start1 < end2 && end1 > start2);
    }, []);

    // Get events for a specific time slot
    const getEventsInTimeSlot = useCallback(
        (events: Event[], slotStart: number, slotEnd: number): Event[] => {
            return events.filter(event => {
                const eventStart = dayjs(event.start).unix();
                const eventEnd = dayjs(event.end).unix();
                return (
                    (eventStart >= slotStart && eventStart < slotEnd) ||
                    (eventEnd > slotStart && eventEnd <= slotEnd) ||
                    (eventStart <= slotStart && eventEnd >= slotEnd)
                );
            });
        },
        []
    );

    // Format time range for display
    const formatTimeRange = useCallback(
        (start: Date | number, end: Date | number): string => {
            const startTime = dayjs(start).format('h:mm A');
            const endTime = dayjs(end).format('h:mm A');
            return `${startTime} - ${endTime}`;
        },
        []
    );

    // Get color for status
    const getStatusColor = useCallback((status: string): string => {
        switch (status) {
            case 'SCHEDULED':
                return 'var(--color-blue-300)';
            case 'DISPATCHED':
                return 'var(--color-orange-400)';
            case 'IN_PROGRESS':
                return 'var(--color-green-400)';
            case 'COMPLETED':
                return 'var(--color-grey-400)';
            default:
                return 'var(--color-grey-300)';
        }
    }, []);

    // Calculate grid position for event
    const calculateEventPosition = useCallback(
        (event: Event, dayStart: Date): { top: number; height: number } => {
            const startOfDay = dayjs(dayStart).hour(7).minute(0);
            const eventStart = dayjs(event.start);
            const eventEnd = dayjs(event.end);

            const minutesFromStart = eventStart.diff(startOfDay, 'minute');
            const duration = eventEnd.diff(eventStart, 'minute');

            const pixelsPerHour = 64;
            const top = (minutesFromStart / 60) * pixelsPerHour;
            const height = Math.max(56, (duration / 60) * pixelsPerHour - 8);

            return { top, height };
        },
        []
    );

    return {
        handleEventDrop,
        checkEventOverlap,
        getEventsInTimeSlot,
        formatTimeRange,
        getStatusColor,
        calculateEventPosition
    };
};