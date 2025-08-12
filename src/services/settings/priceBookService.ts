import { SETTINGS_ENDPOINTS } from 'constants/endpoints';
import { apiRequest } from 'services/apiUtils';
import { parametrizeURL } from 'services/utils';
import { Method } from 'types/common';
import { MaterialPriceFormValues, PriceBook } from 'types/settingsTypes';
import fromStringFormatToMinutes from 'utils/fromStringFormatToMinutes';

const formatServicePayload = (data: MaterialPriceFormValues) => ({
    businessUnitId: data.businessUnit?.value,
    name: data.name,
    price: data.price,
    description: data.description,
    duration: fromStringFormatToMinutes(data.duration)
});

export const getAllServices = (page: number, limit: number) =>
    apiRequest<PriceBook[]>({
        url: SETTINGS_ENDPOINTS.priceBook,
        method: Method.GET,
        params: { page, limit },
        withPagination: true
    });

export const deleteService = (serviceId: string) =>
    apiRequest<string>({
        url: parametrizeURL(SETTINGS_ENDPOINTS.priceBookById, { serviceId }),
        method: Method.DELETE
    });

export const createService = (data: MaterialPriceFormValues) =>
    apiRequest<PriceBook>({ url: SETTINGS_ENDPOINTS.priceBook, method: Method.POST, data: formatServicePayload(data) });

export const getService = (serviceId: string) =>
    apiRequest<PriceBook>({ url: parametrizeURL(SETTINGS_ENDPOINTS.priceBookById, { serviceId }), method: Method.GET });

export const updateService = (data: MaterialPriceFormValues, serviceId: string) =>
    apiRequest<PriceBook>({
        url: parametrizeURL(SETTINGS_ENDPOINTS.priceBookById, { serviceId }),
        method: Method.PUT,
        data: formatServicePayload(data)
    });
