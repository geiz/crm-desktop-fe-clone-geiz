import { setFilter, setSelectedDate } from 'store/slices/calendarSlice';
import { useAppDispatch, useAppSelector } from 'store/store';
import { AppointmentStatus, Technician } from 'types/appointmentTypes';

export const useCalendarFilters = () => {
    const dispatch = useAppDispatch();
    const { filter } = useAppSelector(state => state.calendar);

    const handleTechnicianChange =
        (technicianId: Technician['id']) =>
        ({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
            dispatch(
                setFilter({
                    ...filter,
                    technicianIds: checked
                        ? filter.technicianIds.filter(id => id !== technicianId)
                        : [...filter.technicianIds, technicianId]
                })
            );
        };

    const handleStatusChange =
        (status: AppointmentStatus) =>
        ({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
            dispatch(
                setFilter({
                    ...filter,
                    statuses: checked ? filter.statuses.filter(status => status !== status) : [...filter.statuses, status]
                })
            );
        };
    const handleDateChange = (date: Date) => {
        dispatch(setSelectedDate(date));
    };
    const isTechnicianChecked = (technicianId: Technician['id']) => {
        return !filter.technicianIds.includes(technicianId);
    };

    const isStatusChecked = (status: AppointmentStatus) => {
        return !filter.statuses.includes(status);
    };

    return {
        handleTechnicianChange,
        handleStatusChange,
        handleDateChange,
        isTechnicianChecked,
        isStatusChecked
    };
};
