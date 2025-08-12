import dayjs from 'dayjs';

import { useCallback, useMemo, useRef, useState } from 'react';
import { Calendar as CalendarComponent, Views, dayjsLocalizer } from 'react-big-calendar';
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop';

import { AppointmentDetails } from 'components/BigCalendar/AppointmentDetails';
import { CalendarEvent } from 'components/BigCalendar/Components/CalendarEvent/CalendarEvent';
import { CalendarToolbar } from 'components/BigCalendar/Components/CalendarToolbar/CalendarToolbar';
import { CalendarTooltip } from 'components/BigCalendar/Components/CalendarTooltip/CalendarTooltip';
import { CreateAppointment } from 'components/BigCalendar/CreateAppointment';

import { useCalendar } from 'hooks/useCalendar';
import { useTooltip } from 'hooks/useTooltip';
import { Event, MoreEvent, ViewType } from 'types/appointmentTypes';

import styles from './BigCalendar.module.css';

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { useNavigate } from 'react-router-dom';

import InformCustomer from 'components/InformCustomer/InformCustomer';
import Modal from 'components/Modals/Modal';

import { APP_ROUTES } from 'constants/routes';
import useTimezone from 'hooks/useTimezone';
import { parametrizeRouterURL } from 'routes/utils';
import { availableViews } from 'utils/calendarUtils';

const localizer = dayjsLocalizer(dayjs);
const BigCalendarComponent = withDragAndDrop(CalendarComponent);

interface CalendarWidgetProps extends withDragAndDropProps {
    events: Event[];
    selectedDate: Date;
}

export const BigCalendar: React.FC<CalendarWidgetProps> = ({ events, selectedDate }) => {
    const clickRef = useRef(0);
    const navigate = useNavigate();
    const { position, hideTooltip, showTooltip } = useTooltip();
    const { timeZonesDiff } = useTimezone();
    // Add separate tooltip for appointment details
    const { position: appointmentPosition, hideTooltip: hideAppointmentTooltip, showTooltip: showAppointmentTooltip } = useTooltip();

    const {
        onEventDrop,
        handleSelectSlot,
        eventStyleGetter,
        selectedView,
        setSelectedView,
        selectedAppointmentId,
        selectedSlot,
        handleNavigate,
        setSelectedAppointmentId,
        modalConfig
    } = useCalendar(showTooltip);

    // Add state for storing hidden events from "more" button
    const [moreEvents, setMoreEvents] = useState<Event[] | null>(null);

    const processEventsForMonthView = (events: MoreEvent[], view: ViewType) => {
        if (view !== Views.MONTH) {
            return events.map(event => ({
                ...event,
                start: event.start,
                end: event.end
            }));
        }

        // Group events by date
        const eventsByDate: { [key: string]: MoreEvent[] } = {};
        events.forEach(event => {
            const dateKey = dayjs(event.start).format('YYYY-MM-DD');
            if (!eventsByDate[dateKey]) {
                eventsByDate[dateKey] = [];
            }
            eventsByDate[dateKey].push(event);
        });

        const processedEvents: MoreEvent[] = [];

        Object.entries(eventsByDate).forEach(([dateKey, dayEvents]) => {
            const sortedEvents = dayEvents.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

            // Show first 3 events
            const visibleEvents = sortedEvents.slice(0, 3);
            visibleEvents.forEach(event => {
                processedEvents.push({
                    ...event,
                    start: new Date(event.start),
                    end: new Date(event.end)
                });
            });

            // Add "more" button if there are additional events
            if (sortedEvents.length > 3) {
                const remainingCount = sortedEvents.length - 3;
                const moreEvent = {
                    id: `more-${dateKey}`,
                    title: `+${remainingCount} more`,
                    start: new Date(sortedEvents[0].start),
                    end: new Date(sortedEvents[0].start),
                    resource: {
                        isMoreButton: true,
                        hiddenEvents: sortedEvents.slice(3),
                        date: dateKey
                    }
                };
                processedEvents.push(moreEvent);
            }
        });

        return processedEvents;
    };

    const memorisedEvents = useMemo(() => processEventsForMonthView(events, selectedView), [events, selectedView]);

    const EventComponent = (props: any) => <CalendarEvent {...props} isMonthView={selectedView === Views.MONTH} />;

    const handleEventClickWithMore = (event: any, clickEvent: any) => {
        if (event.resource?.isMoreButton) {
            // Handle "more" button click - show popup with hidden events
            const mouseEvent = clickEvent as MouseEvent;

            // Set the hidden events and show tooltip
            setMoreEvents(event.resource.hiddenEvents);
            showTooltip({ x: mouseEvent.pageX, y: mouseEvent.pageY });
        } else {
            // Handle regular event click - show appointment details
            const mouseEvent = clickEvent as MouseEvent;
            if (!mouseEvent.pageX || !mouseEvent.pageY) return;

            setSelectedAppointmentId(event.resource.appointmentId);
            showAppointmentTooltip({ x: mouseEvent.pageX, y: mouseEvent.pageY });
        }
    };

    const onSelectEvent = useCallback((event: object, clickEvent: React.SyntheticEvent<HTMLElement>) => {
        // in react calendar double click is overriden by 2 single clicks,
        // so we have to check first if there is another click in 200 ms
        // if it is -> cancel single click and treat it as double click,
        // if is not -> fire single click
        window.clearTimeout(clickRef?.current); // cancel any existing timer

        clickRef.current = window.setTimeout(() => {
            handleEventClickWithMore(event, clickEvent);
        }, 200);
    }, []);

    const onDoubleClickEvent = useCallback((event: object) => {
        window.clearTimeout(clickRef?.current); // cancel pending single click

        navigate(parametrizeRouterURL(APP_ROUTES.jobs.item, { jobId: String((event as Event).resource.jobId) }));
    }, []);

    // Component to display hidden events in the tooltip
    const MoreEventsDisplay = ({ events }: { events: Event[] }) => {
        const handleEventClick = (event: Event, mouseEvent: React.MouseEvent) => {
            // Show the appointment details for the clicked event
            // Use the actual click coordinates relative to the viewport
            const rect = mouseEvent.currentTarget.getBoundingClientRect();
            const x = rect.right + 20; // Position to the right of the clicked event
            const y = rect.top; // Align with the top of the clicked event

            setSelectedAppointmentId(event.resource.appointmentId);
            showAppointmentTooltip({ x, y });
        };

        return (
            <div style={{ maxWidth: '300px' }}>
                <h3 style={{ margin: '0 0 1rem 0', marginTop: '1rem', fontSize: '1.4rem', color: 'var(--color-grey-400)' }}>
                    All Events ({events.length + 3})
                </h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {events.map((event, index) => (
                        <div
                            key={index}
                            onClick={e => handleEventClick(event, e)}
                            style={{
                                padding: '0.5rem',
                                marginBottom: '0.5rem',
                                backgroundColor: event.resource?.color || 'var(--color-blue-300)',
                                color: 'white',
                                borderRadius: '4px',
                                fontSize: '1.1rem',
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                border: selectedAppointmentId === event.resource.appointmentId ? '2px solid #FFD700' : 'none'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}>
                            <div style={{ fontWeight: '500' }}>{event.title}</div>
                            <div style={{ fontSize: '0.9rem', opacity: '0.9' }}>
                                {dayjs(event.start).format('HH:mm')} - {dayjs(event.end).format('HH:mm')}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const handleCloseAppointmentTooltip = () => {
        setSelectedAppointmentId(null);
        hideAppointmentTooltip();
    };

    // Clear appointment details when main tooltip is closed
    const handleMainTooltipClose = () => {
        setMoreEvents(null);
        setSelectedAppointmentId(null);
        hideTooltip();
    };

    return (
        <>
            <BigCalendarComponent
                className={styles.calendar}
                localizer={localizer}
                draggableAccessor={() => true}
                resizableAccessor={() => false}
                events={memorisedEvents}
                views={availableViews}
                defaultView={availableViews[1]}
                view={selectedView}
                onView={view => setSelectedView(view)}
                onNavigate={handleNavigate}
                onEventDrop={onEventDrop}
                date={selectedDate}
                getNow={() => dayjs().add(timeZonesDiff, 'minute').toDate()} // current time indicator
                selectable
                onSelectSlot={handleSelectSlot}
                onDoubleClickEvent={onDoubleClickEvent}
                onSelectEvent={onSelectEvent}
                eventPropGetter={eventStyleGetter}
                step={60}
                timeslots={1}
                components={{
                    event: EventComponent,
                    toolbar: CalendarToolbar
                }}
            />
            {/* Main tooltip for "more" events and slot selection */}
            <CalendarTooltip position={position} hideTooltip={hideTooltip} callback={handleMainTooltipClose}>
                {selectedSlot ? <CreateAppointment slot={selectedSlot} /> : null}
                {moreEvents ? <MoreEventsDisplay events={moreEvents} /> : null}
            </CalendarTooltip>

            {/* Separate tooltip for appointment details - only render when needed */}
            {selectedAppointmentId && appointmentPosition && (
                <CalendarTooltip
                    position={appointmentPosition}
                    hideTooltip={hideAppointmentTooltip}
                    callback={handleCloseAppointmentTooltip}>
                    <AppointmentDetails appointmentId={selectedAppointmentId} />
                </CalendarTooltip>
            )}
            {modalConfig && (
                <Modal isOpen={modalConfig?.isOpen} onClose={modalConfig.onCancel}>
                    <InformCustomer handleCancel={modalConfig?.onCancel} handleNotification={modalConfig?.onConfirm} />
                </Modal>
            )}
        </>
    );
};
