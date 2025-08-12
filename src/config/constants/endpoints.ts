import { Job } from 'types/jobTypes';

export const AUTH_ENDPOINTS = {
    login: '/auth/login',
    forgotPassword: '/users/forgot-password',
    setNewPassword: '/users/set-new-password',
    refresh: '/auth/refresh',
    logout: '/auth/logout'
};

export const APPOINTMENTS_ENDPOINTS = {
    getCalendarAppointments: '/appointments/calendar',
    updateDescription: '/appointments/{appointmentId}/description',
    updateAw: '/appointments/{appointmentId}/arrival-window',
    updateType: '/appointments/{appointmentId}/type',
    updateTechnician: '/appointments/{appointmentId}/technician',
    postAppointment: '/appointments/{jobId}',
    updateStatus: '/appointments/{appointmentId}/status',
    resume: '/appointments/{appointmentId}/resume',
    removeHold: '/appointments/{appointmentId}/remove-hold'
};

export const SETTINGS_ENDPOINTS = {
    brands: '/brands',
    businessUnits: '/business-units',
    businessUnitById: '/business-units/{unitId}',
    documents: '/companies/documents',
    document: '/companies/documents/{name}', // name: terms | agreement
    appointmentTypes: '/appointment-types',
    leadSources: '/leads',
    tags: '/tags',
    cancelReasons: '/job-cancel-reasons',
    estimateCancelReasons: '/estimate-cancel-reasons',
    taxRates: '/taxes',
    taxStates: '/taxes/states',
    materials: '/materials',
    materialById: '/materials/{materialId}',
    priceBook: '/price-books',
    priceBookById: '/price-books/{serviceId}',
    companies: '/companies',
    companyImg: '/companies/image',
    components: '/components',
    areas: '/areas',
    jobTypes: '/job-types',
    jobTypeById: '/job-types/{jobTypeId}',
    serviceTypes: '/service-types',
    componentTypes: '/components'
};

export const USERS_ENDPOINTS = {
    technicians: '/users/technicians',
    employees: '/users',
    byId: '/users/{emplId}',
    invite: '/users/invite',
    confirmInvite: '/users/confirm-invite',
    changeStatus: '/users/{emplId}/{action}', // action: deactivate | activate | reinvite
    updateCustomFields: '/users/{userId}/custom-settings'
};

export const CLIENTS_ENDPOINTS = {
    search: '/clients/search',
    postClient: '/clients',
    updateClient: '/clients/{clientId}',
    postAddress: '/clients/{clientId}/service-location',
    clientByAddress: '/clients/{clientId}/profile',
    updateContacts: '/clients/{clientId}/contacts'
};

export const JOB_ENDPOINTS = {
    main: '/jobs',
    search: '/jobs/search',
    get: '/jobs/{jobId}', // TODO: fix requests below
    updateSummary: (id: Job['id']) => `/jobs/${id}/summary`,
    files: `/jobs/{jobId}/files`,
    removeFile: `/jobs/{jobId}/files/{fileId}`,
    notifications: '/jobs/{jobId}/notifications/{type}', // type : 'work-{email | phone}' | 'billing-{email | phone}'
    updateTags: `/jobs/{jobId}/{tagAction}-tag/{tagId}`, // action : add | remove
    contacts: '/jobs/{jobId}/contacts',
    restore: `/jobs/{jobId}/resume`,
    changeStatus: `/jobs/{jobId}/status`,
    saveNote: (id: Job['id']) => `/jobs/${id}/notes`,
    changeNote: (id: Job['id'], noteId: number) => `/jobs/${id}/notes/${noteId}`,
    deletePayment: '/jobs/{jobId}/invoice/payments/{paymentId}',
    refundPayment: '/jobs/{jobId}/invoice/payments/refund/{paymentId}',
    editPayment: '/jobs/{jobId}/invoice/payments/{paymentId}'
};

const ESTIMATES_BASE = '/estimates';
export const ESTIMATE_ENDPOINTS = {
    create: `${ESTIMATES_BASE}/{jobId}`,
    byId: `${ESTIMATES_BASE}/{id}`,
    files: `${ESTIMATES_BASE}/{estimateId}/files`,
    removeFile: `${ESTIMATES_BASE}/{estimateId}/files/{fileId}`,
    createService: `${ESTIMATES_BASE}/{estimateId}/service`,
    updateService: `${ESTIMATES_BASE}/{estimateId}/service/{id}`,
    createMaterial: `${ESTIMATES_BASE}/{estimateId}/material`,
    updateMaterial: `${ESTIMATES_BASE}/{estimateId}/material/{id}`,
    discount: `${ESTIMATES_BASE}/{estimateId}/discount`,
    tax: `${ESTIMATES_BASE}/{estimateId}/tax/{id}`,
    notify: `${ESTIMATES_BASE}/{estimateId}/notify`,
    tag: `${ESTIMATES_BASE}/{estimateId}/{tagAction}-tag/{tagId}`, // action: add | remove
    savePdf: `${ESTIMATES_BASE}/{estimateId}/email/download`
};

const INVOICES_BASE = '/jobs/{jobId}/invoice';
export const INVOICE_ENDPOINTS = {
    create: `${INVOICES_BASE}`,
    byId: `${INVOICES_BASE}`,
    createService: `${INVOICES_BASE}/service`,
    updateService: `${INVOICES_BASE}/service/{id}`,
    createMaterial: `${INVOICES_BASE}/material`,
    updateMaterial: `${INVOICES_BASE}/material/{id}`,
    discount: `${INVOICES_BASE}/discount`,
    tax: `${INVOICES_BASE}/tax/{id}`,
    notify: `${INVOICES_BASE}/notify`,
    payments: `${INVOICES_BASE}/payments/{method}`, // method: e-transfer | cash | check | card | other
    savePdf: `${INVOICES_BASE}/email/download`,
    getPaymentFile: `${INVOICES_BASE}/payments/{paymentId}/file`
};
