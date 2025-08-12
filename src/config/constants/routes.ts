import { SettingsNavItem } from 'types/settingsTypes';

export const APP_ROUTES: Record<string, Record<string, string>> = {
    home: {
        main: '/'
    },
    auth: {
        invite: '/invite',
        recovery: '/recovery',
        login: '/login',
        forgotPassword: '/forgot-password'
    },
    settings: {
        main: '/settings',
        profile: '/settings/profile',
        additionalInfo: '/settings/additional-info',
        editDocument: '/settings/additional-info/:name/edit', // TODO: fix path here and in pages
        addDocument: '/settings/additional-info/:name/add',
        materials: '/settings/materials',
        addMaterials: '/settings/materials/add',
        editMaterials: '/settings/materials/view/:materialId',
        priceBook: '/settings/services',
        addPriceBook: '/settings/services/add',
        editPriceBook: '/settings/services/view/:serviceId',
        taxes: '/settings/taxes',
        leadSource: '/settings/lead-source',
        cancellationReason: '/settings/cancellation-reason',
        estimateCancellationReason: '/settings/reject-reasons',
        appointmentType: '/settings/appointment-type',
        businessUnit: '/settings/business-unit',
        tags: '/settings/tags',
        employees: '/settings/employees',
        addEmployee: '/settings/employees/add',
        editEmployee: '/settings/employees/:emplId/view',
        jobTypes: '/settings/job-types',
        addJobTypes: '/settings/job-types/add',
        editJobTypes: '/settings/job-types/view/:jobTypeId',
        brands: '/settings/brands'
    },
    jobs: {
        main: '/jobs/',
        item: '/jobs/:jobId',
        create: '/jobs/create',
        invoiceItem: '/jobs/:jobId/invoice',
        invoiceEmail: '/jobs/:jobId/invoice/email',
        invoiceNotificationSuccess: '/jobs/:jobId/invoice/notification-success'
    },
    estimates: {
        main: `/estimates`,
        item: `/estimates/:id`,
        email: `/estimates/email/:id`,
        notificationSuccess: `/estimates/notification-success/:id`
    },
    schedule: {
        main: '/schedule'
    },
    notFound: {
        main: '*'
    },
    forbbiden: {
        main: '/forbbiden'
    }
};

export const SETTINGS_SIDEBAR_NAV: SettingsNavItem[] = [
    {
        name: 'COMPANY',
        routes: [
            { name: 'Profile', path: APP_ROUTES.settings.profile },
            { name: 'Employees & Permissions', path: APP_ROUTES.settings.employees },
            { name: 'Additional Information', path: APP_ROUTES.settings.additionalInfo }
        ]
    },
    {
        name: 'CONTACT MODULE',
        routes: [
            { name: 'Lead Source', path: APP_ROUTES.settings.leadSource },
            { name: 'Tags', path: APP_ROUTES.settings.tags }
        ]
    },
    {
        name: 'JOB MODULE',
        routes: [
            { name: 'Business Unit', path: APP_ROUTES.settings.businessUnit },
            { name: 'Job Type', path: APP_ROUTES.settings.jobTypes },
            { name: 'Appointment Type', path: APP_ROUTES.settings.appointmentType },
            { name: 'Brand', path: APP_ROUTES.settings.brands },
            { name: 'Price Book', path: APP_ROUTES.settings.priceBook },
            { name: 'Materials', path: APP_ROUTES.settings.materials },
            // { name: 'Priority', path: '/#' },
            { name: 'Job Cancellation Reason', path: APP_ROUTES.settings.cancellationReason }
        ]
    },
    {
        name: 'PAYMENT MODULE',
        routes: [
            { name: 'Tax Rates', path: APP_ROUTES.settings.taxes },
            { name: 'Estimate Cancellation Reason', path: APP_ROUTES.settings.estimateCancellationReason }
        ]
    }
];
