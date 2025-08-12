import { Views } from 'react-big-calendar';

import { Appointment, AppointmentFilter, AppointmentStatus, Event, Technician, ViewType } from 'types/appointmentTypes';
import { getColorById } from 'utils/getColorById';

export function getTechniciansWithColor(technicians: Technician[]): Technician[] {
    return [...technicians, { id: null, name: 'Unassigned' }].map((technician, index) => ({
        ...technician,
        color: getColorById(index)
    }));
}

export function getStatusesFromAppointments(appointments: Appointment[]): string[] {
    return Array.from(appointments.reduce((statuses, appointment) => statuses.add(appointment.status), new Set<string>()));
}

export function convertAppointmentsToEvents(appointments: Appointment[], techniciansWithColor: Technician[]): Event[] {
    return appointments.map(({ startDate, endDate, technicians, id, status, clientName, jobId }) => {
        // sort techs by name
        const sortedTechs = [...technicians].sort((a, b) => a.name.localeCompare(b.name));
        const firstTech = sortedTechs[0];

        // find first tech with color
        let firstTechnician = firstTech ? techniciansWithColor.find(t => t.id === firstTech.id) : null;

        if (!firstTechnician) {
            firstTechnician = techniciansWithColor.find(t => t.id === null) || {
                id: null,
                name: 'Unassigned',
                color: '#gray'
            };
        }

        return {
            title: status === AppointmentStatus.DISPATCHED ? `🚚  ${clientName}` : clientName,
            start: startDate,
            end: endDate,
            resource: {
                appointmentId: id,
                endDate,
                technicians,
                color: firstTechnician.color,
                status,
                jobId
            }
        };
    });
}

export function getFilteredEvents(events: Event[], filter: AppointmentFilter): Event[] {
    return events.filter(event => {
        const technicianIds = event.resource.technicians?.map(t => t.id) ?? [];
        const hasFilteredTechnician = technicianIds.some(id => filter.technicianIds.includes(id));
        const hasFilteredStatus = filter.statuses.includes(event.resource.status);
        return !hasFilteredTechnician && !hasFilteredStatus;
    });
}

export const checkboxLabelStyle = { color: 'var(--color-grey-900)' };
export const availableViews: ViewType[] = [Views.MONTH, Views.WEEK, Views.DAY];
