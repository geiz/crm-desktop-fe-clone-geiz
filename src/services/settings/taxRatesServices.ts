import { SETTINGS_ENDPOINTS } from 'constants/endpoints';
import { apiRequest } from 'services/apiUtils';
import { SelectOption } from 'types/common';
import { Method, PaginatedResponse } from 'types/common';
import { TaxRate } from 'types/settingsTypes';
import { prepareTaxRateValue } from 'utils/settings';

const createSettingsService = (baseUrl: string) => ({
    fetch: (page: number, limit: number): Promise<PaginatedResponse<TaxRate[]>> =>
        apiRequest({
            url: baseUrl,
            method: Method.GET,
            params: { page, limit },
            withPagination: true
        }),

    create: (data: Record<string, string | number>): Promise<TaxRate> => {
        return apiRequest({ url: baseUrl, method: Method.POST, data: prepareTaxRateValue(data) });
    },

    update: (id: number, data: Record<string, string | number>): Promise<void> => {
        return apiRequest({ url: `${baseUrl}/${id}`, method: Method.PUT, data: prepareTaxRateValue(data) });
    },

    delete: (id: number): Promise<void> => apiRequest({ url: `${baseUrl}/${id}`, method: Method.DELETE })
});

export const taxRatesServices = createSettingsService(SETTINGS_ENDPOINTS.taxRates);

export const getTaxStatesOptions = (): Promise<SelectOption[]> =>
    apiRequest<string[]>({
        url: SETTINGS_ENDPOINTS.taxStates,
        method: Method.GET
    }).then(resp => resp.map(value => ({ value, label: value })));
