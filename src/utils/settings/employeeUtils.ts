import { TableCellColumn } from 'components/Table/types';

import { Role, SelectOption } from 'types/common';
import { Employee, EmployeeAction, EmployeeFormValues, EmployeeStatus, TechnicianSchedule } from 'types/settingsTypes';
import maskToDigitString from 'utils/maskToDigitString';

export const roleOptions = [
    { value: Role.TECHNICIAN, label: 'Technician' },
    { value: Role.ADMIN, label: 'Admin' },
    { value: Role.DISPATCHER, label: 'Dispatcher' }
];

export const DAYS_OF_WEEK = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
    { value: 7, label: 'Sunday' }
];

export const getDefaultSchedule = (): TechnicianSchedule[] => {
    return DAYS_OF_WEEK.map(day => ({
        dayOfWeek: day.value,
        enabled: day.value <= 5, // Monday to Friday enabled by default
        maxJobs: 1,
        workTime: undefined,
        preferredWorkTimeEnabled: false,
        preferredWorkTime: undefined
    }));
};

export const emptyTechnician = {
    hourlyRate: '',
    loadRate: '',
    businessUnit: '',
    areas: {
        primary: null,
        nearby: [],
        excluded: []
    },
    schedule: getDefaultSchedule(),
    scheduleSpecifics: '',
    brands: {
        supported: [],
        unsupported: []
    },
    appliances: {
        individuals: [],
        businesses: []
    },
    licenses: []
};

export const emptyDefaultValues: EmployeeFormValues = {
    name: '',
    email: '',
    status: EmployeeStatus.INVITED,
    role: '',
    phone: '',
    slackHandle: '',
    technician: emptyTechnician
};

export const tableColumns: TableCellColumn[] = [
    { key: 'name', label: 'Full Name', format: 'capitalize' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status', format: 'capitalize' },
    { key: 'role', label: 'Role', format: 'capitalize' },
    { key: 'phone', label: 'Phone Number', format: 'phone' },
    { key: 'createdAt', label: 'Added Date', format: 'date' },
    { key: 'actions', label: 'Actions' }
];

export const getSuccessMessage = (user: Employee) => ({
    [EmployeeAction.reinvite]: `Reinvite sent successfully to ${user.email}`,
    [EmployeeAction.deactivate]: `${user.name} successfully deactivated`,
    [EmployeeAction.activate]: `${user.name} successfully activated`,
    [EmployeeAction.delete]: `${user.name} successfully deleted`
});

export const cleanScheduleData = (schedule: TechnicianSchedule[]): TechnicianSchedule[] => {
    // Must include all 7 days as required by backend
    return schedule.map(day => {
        const cleanedDay = { ...day };

        if (!day.enabled) {
            // For disabled days, provide default work time 9:00-18:00
            cleanedDay.workTime = {
                start: '09:00',
                end: '18:00'
            };
            cleanedDay.preferredWorkTimeEnabled = false;
            cleanedDay.preferredWorkTime = {
                start: '09:00',
                end: '18:00'
            };
        } else {
            // For enabled days, ensure complete time objects
            // Ensure work time has valid values
            if (!day.workTime || !day.workTime.start || !day.workTime.end) {
                cleanedDay.workTime = {
                    start: '09:00',
                    end: '18:00'
                };
            }

            // Clean preferred time
            if (!day.preferredWorkTimeEnabled) {
                cleanedDay.preferredWorkTime = {
                    start: '09:00',
                    end: '18:00'
                };
            } else if (!day.preferredWorkTime || !day.preferredWorkTime.start || !day.preferredWorkTime.end) {
                cleanedDay.preferredWorkTime = {
                    start: '09:00',
                    end: '18:00'
                };
            }
        }

        return cleanedDay;
    });
};

/**
 * Transforms form data into API payload format for both add and edit operations
 */
export const transformEmployeePayload = (data: EmployeeFormValues) => {
    const isTechnician = (data.role as SelectOption).value === Role.TECHNICIAN;

    const payload = {
        ...data,
        role: (data.role as SelectOption).value,
        phone: maskToDigitString(data.phone),
        ...(isTechnician && {
            technician: {
                hourlyRate: Number(data.technician.hourlyRate) || 0,
                loadRate: Number(data.technician.loadRate) || 0,
                businessUnitId: (data.technician.businessUnit as SelectOption)?.value || null,
                areas: data.technician.areas
                    ? (() => {
                          const primary =
                              typeof data.technician.areas.primary === 'object'
                                  ? data.technician.areas.primary?.id || null
                                  : data.technician.areas.primary || null;

                          const nearby = data.technician.areas.nearby?.map(area => (typeof area === 'object' ? area.id : area)) || [];
                          const excluded = data.technician.areas.excluded?.map(area => (typeof area === 'object' ? area.id : area)) || [];

                          // Remove primary area from nearby and excluded to avoid conflicts
                          const cleanNearby = nearby.filter(id => id !== primary);
                          const cleanExcluded = excluded.filter(id => id !== primary);

                          return {
                              primary,
                              nearby: cleanNearby,
                              excluded: cleanExcluded
                          };
                      })()
                    : undefined,
                schedule: data.technician.schedule
                    ? cleanScheduleData(data.technician.schedule).map(day => {
                          // Remove id field completely for updates to avoid conflicts
                          const { id, ...dayWithoutId } = day;
                          return dayWithoutId;
                      })
                    : [],
                scheduleSpecifics: data.technician.scheduleSpecifics || '',
                brands: data.technician.brands
                    ? (() => {
                          const supported = data.technician.brands.supported?.map(brand => brand.value) || [];
                          const unsupported = data.technician.brands.unsupported?.map(brand => brand.value) || [];

                          // Remove duplicates - if a brand is in both, keep it only in supported
                          const uniqueUnsupported = unsupported.filter(id => !supported.includes(id));

                          return {
                              supported,
                              unsupported: uniqueUnsupported
                          };
                      })()
                    : undefined,
                appliances: data.technician.appliances
                    ? {
                          individuals: data.technician.appliances.individuals?.map(app => app.value) || [],
                          businesses: data.technician.appliances.businesses?.map(app => app.value) || []
                      }
                    : undefined
            }
        })
    };

    return payload;
};
