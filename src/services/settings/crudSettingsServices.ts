import { SETTINGS_ENDPOINTS } from 'constants/endpoints';
import { apiRequest } from 'services/apiUtils';
import { BaseItem, Method, PaginatedResponse } from 'types/common';

const createSettingsService = <T extends BaseItem>(baseUrl: string) => ({
    fetch: (page: number, limit: number): Promise<PaginatedResponse<T[]>> =>
        apiRequest({
            url: baseUrl,
            method: Method.GET,
            params: { page, limit },
            withPagination: true
        }),

    create: (data: Record<string, string | number>): Promise<T> => apiRequest({ url: baseUrl, method: Method.POST, data: data }),

    update: (id: number, data: Record<string, string | number>): Promise<void> =>
        apiRequest({ url: `${baseUrl}/${id}`, method: Method.PUT, data: data }),

    delete: (id: number): Promise<void> => apiRequest({ url: `${baseUrl}/${id}`, method: Method.DELETE }),

    fetchById: (id: string): Promise<BaseItem> => apiRequest({ url: `${baseUrl}/${id}`, method: Method.GET })
});

export const leadSourcesServices = createSettingsService(SETTINGS_ENDPOINTS.leadSources);
export const tagsServices = createSettingsService(SETTINGS_ENDPOINTS.tags);
export const businessUnitsServices = createSettingsService(SETTINGS_ENDPOINTS.businessUnits);
export const appointmentTypesServices = createSettingsService(SETTINGS_ENDPOINTS.appointmentTypes);
export const cancelReasonsServices = createSettingsService(SETTINGS_ENDPOINTS.cancelReasons);
export const estimateCancelReasonsServices = createSettingsService(SETTINGS_ENDPOINTS.estimateCancelReasons);
export const brandServices = createSettingsService(SETTINGS_ENDPOINTS.brands);
