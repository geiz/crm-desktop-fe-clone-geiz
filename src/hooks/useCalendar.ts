import useInformCustomer from './useInformCustomer';
import useTimezone from './useTimezone';
import dayjs from 'dayjs';

import { useEffect, useState } from 'react';
import { Views } from 'react-big-calendar';
import { Event as BigCalendarEvent, SlotInfo } from 'react-big-calendar';
import { EventInteractionArgs, withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop';
import { toast } from 'react-toastify';

import { getCalendarAppointments, updateAppointmentAw } from 'services/appointmentsService';
import { setCalendarData, setError, setIsLoading, setSelectedDate, updateAppointment } from 'store/slices/calendarSlice';
import { updateEvent } from 'store/slices/calendarSlice';
import { useAppDispatch, useAppSelector } from 'store/store';
import { AppointmentStatus, ViewType } from 'types/appointmentTypes';
import { convertAppointmentsToEvents, getStatusesFromAppointments, getTechniciansWithColor } from 'utils/calendarUtils';
import { getLighterColor } from 'utils/getColorById';

export const useCalendar = (showTooltip: (position: { x: number; y: number }) => void) => {
    const { timezone } = useTimezone();
    const { openAsyncModal, modalConfig } = useInformCustomer();
    const dispatch = useAppDispatch();
    // TODO: refactor to use redux
    const [selectedView, setSelectedView] = useState<ViewType>(Views.WEEK);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<{
        start: number;
        end: number;
    } | null>(null);

    const { filter } = useAppSelector(state => state.calendar);
    const { startDate, endDate } = filter;

    useEffect(() => {
        dispatch(setIsLoading(true));

        getCalendarAppointments({
            startDate,
            endDate
        })
            .then(response => {
                const techniciansWithColor = getTechniciansWithColor(response.technicians).sort((a, b) => a.name.localeCompare(b.name));
                const events = convertAppointmentsToEvents(response.appointments, techniciansWithColor);
                const statuses = getStatusesFromAppointments(response.appointments);

                dispatch(
                    setCalendarData({
                        appointments: response.appointments,
                        technicians: techniciansWithColor,
                        events,
                        statuses
                    })
                );
            })
            .catch(err => {
                console.error(err);
                dispatch(setError('no appointments or technicians found'));
            })
            .finally(() => dispatch(setIsLoading(false)));
    }, [startDate, endDate, dispatch]);

    const handleNavigate = (date: Date) => {
        dispatch(setSelectedDate(date));
    };

    const onEventDrop: withDragAndDropProps['onEventDrop'] = ({ event: originalEvent, start }: EventInteractionArgs<BigCalendarEvent>) => {
        const { appointmentId } = originalEvent.resource;

        const originalStart = dayjs(originalEvent.start);
        const originalEnd = dayjs(originalEvent.end);

        const durationMinutes = originalEnd.diff(originalStart, 'minute');

        const newStart = dayjs.tz(dayjs(start).format('YYYY-MM-DDTHH:mm:ss'), timezone).utc();
        const newEnd = newStart.add(durationMinutes, 'minute');

        openAsyncModal()
            .then(isNotification => {
                return updateAppointmentAw(
                    appointmentId,
                    {
                        scheduledStart: newStart.unix(),
                        scheduledEnd: newEnd.unix()
                    },
                    isNotification
                );
            })
            .then(resp => {
                dispatch(
                    updateAppointment({
                        id: appointmentId,
                        startDate: resp.scheduledStart,
                        endDate: resp.scheduledEnd
                    })
                );
            })
            .catch(err => {
                if (!err.message.includes('cancel')) toast.error(err.message);

                dispatch(
                    updateEvent({
                        appointmentId,
                        data: { start: originalStart.unix(), end: originalEnd.unix() }
                    })
                );
            });

        // update calendar ui with new data
        dispatch(
            updateEvent({
                appointmentId,
                data: {
                    start: newStart.unix(),
                    end: newEnd.unix()
                }
            })
        );
    };

    const handleSelectSlot = ({ start, end, box }: SlotInfo) => {
        if (!box) return;

        const clicked = dayjs(start);
        const now = dayjs();

        let finalStart = clicked;
        let finalEnd = dayjs(end);

        if (clicked.isBefore(now, 'day')) {
            finalStart = now.hour(clicked.hour()).minute(clicked.minute()).second(0);
            finalEnd = finalStart.add(finalEnd.diff(clicked, 'minute'), 'minute');
        }

        const startUtc = finalStart.utc(true).valueOf();
        const endUtc = finalEnd.utc(true).valueOf();

        setSelectedSlot({ start: startUtc, end: endUtc });
        showTooltip({ x: box.x, y: box.y });
    };

    const handleEventClick = (eventData: object, clickEvent: unknown) => {
        const mouseEvent = clickEvent as MouseEvent;
        const event = eventData as BigCalendarEvent;
        if (!mouseEvent.pageX || !mouseEvent.pageY) return;
        setSelectedAppointmentId(event.resource.appointmentId);
        showTooltip({ x: mouseEvent.pageX, y: mouseEvent.pageY });
    };

    const handleCloseTooltip = () => {
        setSelectedAppointmentId(null);
        setSelectedSlot(null);
    };

    const eventStyleGetter = (event: object) => {
        const {
            resource: { color, status }
        } = event as BigCalendarEvent;

        return {
            style: {
                border: `1px solid ${color}`,
                backgroundColor:
                    status === AppointmentStatus.SCHEDULED
                        ? 'var(--color-white)'
                        : status === AppointmentStatus.COMPLETED
                          ? getLighterColor(color) // Use lighter version for completed
                          : color, // Use normal color for other statuses
                color:
                    status === AppointmentStatus.SCHEDULED
                        ? color
                        : status === AppointmentStatus.COMPLETED
                          ? 'var( --color-grey-700)'
                          : 'var(--color-white)'
            }
        };
    };

    return {
        selectedView,
        setSelectedView,
        handleNavigate,
        selectedAppointmentId,
        setSelectedAppointmentId,
        selectedSlot,
        setSelectedSlot,
        onEventDrop,
        handleSelectSlot,
        handleEventClick,
        handleCloseTooltip,
        eventStyleGetter,
        modalConfig
    };
};
