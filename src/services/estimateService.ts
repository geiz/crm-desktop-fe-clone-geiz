import { parametrizeURL } from './utils';
import { ESTIMATE_ENDPOINTS } from 'constants/endpoints';
import { apiRequest } from 'services/apiUtils';
import { Method } from 'types/common';
import {
    DiscountFormValues,
    EstimateEmailResponse,
    EstimateEntity,
    EstimateMaterial,
    EstimateNotifyRequest,
    EstimateResponseEntity,
    EstimateService,
    ItemPrices,
    ItemResponsePrices,
    MaterialOption,
    MaterialResponseEntity,
    MaterialWithPrices,
    MaterialWithPricesResponse,
    ServiceOption,
    ServiceResponseEntity,
    ServiceWithPrices,
    ServiceWithPricesResponse,
    TaxInfo,
    TaxOption
} from 'types/estimateTypes';

const transformResponseService = ({ externalId, ...service }: ServiceResponseEntity, options: ServiceOption[]): EstimateService => ({
    itemName: options.find(option => option.id === externalId) as ServiceOption,
    ...service
});

const transformResponseMaterial = ({ externalId, ...material }: MaterialResponseEntity, options: MaterialOption[]): EstimateMaterial => ({
    itemName: options.find(option => option.id === externalId) as MaterialOption,
    ...material
});

const transformPricesTaxFromResponse = (tax: TaxInfo | null, options: TaxOption[]) =>
    tax
        ? {
              rate: options.find(option => option.id === tax.id) as TaxOption,
              value: tax.value
          }
        : null;

export const createEstimate = (jobId: number): Promise<EstimateEntity> =>
    apiRequest<EstimateResponseEntity>({ url: parametrizeURL(ESTIMATE_ENDPOINTS.create, { jobId: `${jobId}` }), method: Method.POST }).then(
        ({ prices, services, materials, ...estimate }) => ({
            ...estimate,
            prices: {
                ...prices,
                tax: transformPricesTaxFromResponse(prices.tax, estimate.taxesOptions)
            },
            services: services.map(service => transformResponseService(service, estimate.serviceOptions)),
            materials: materials.map(material => transformResponseMaterial(material, estimate.materialOptions))
        })
    );

export const getEstimateById = (id: number) =>
    apiRequest<EstimateResponseEntity>({ url: parametrizeURL(ESTIMATE_ENDPOINTS.byId, { id }), method: Method.GET }).then(
        ({ prices, services, materials, ...estimate }) => ({
            ...estimate,
            prices: {
                ...prices,
                tax: transformPricesTaxFromResponse(prices.tax, estimate.taxesOptions)
            },
            services: services.map(service => transformResponseService(service, estimate.serviceOptions)),
            materials: materials.map(material => transformResponseMaterial(material, estimate.materialOptions))
        })
    );

// Service

export const updateEstimateService = (
    estimateId: number,
    { itemName, ...service }: Omit<EstimateService, 'id'> & { id?: number },
    taxesOptions: TaxOption[]
): Promise<ServiceWithPrices> =>
    apiRequest<ServiceWithPricesResponse>({
        url: service.id
            ? parametrizeURL(ESTIMATE_ENDPOINTS.updateService, { estimateId: `${estimateId}`, id: `${service.id}` })
            : parametrizeURL(ESTIMATE_ENDPOINTS.createService, {
                  estimateId: `${estimateId}`
              }),
        method: service.id ? Method.PUT : Method.POST,
        data: {
            ...service,
            externalId: (itemName as ServiceOption).id
        }
    }).then(({ prices, item }) => ({
        prices: {
            ...prices,
            tax: transformPricesTaxFromResponse(prices.tax, taxesOptions)
        },
        item: { itemName, ...service, id: item.id }
    }));

export const deleteEstimateService = (estimateId: number, serviceId: number | string, taxesOptions: TaxOption[]): Promise<ItemPrices> =>
    apiRequest<ItemResponsePrices>({
        url: parametrizeURL(ESTIMATE_ENDPOINTS.updateService, { estimateId: `${estimateId}`, id: `${serviceId}` }),
        method: Method.DELETE,
        allowDeleteResponse: true
    }).then(prices => ({
        ...prices,
        tax: transformPricesTaxFromResponse(prices.tax, taxesOptions)
    }));

// Material

export const updateEstimateMaterial = (
    estimateId: number,
    { itemName, ...material }: Omit<EstimateMaterial, 'id'> & { id?: number },
    taxesOptions: TaxOption[]
): Promise<MaterialWithPrices> =>
    apiRequest<MaterialWithPricesResponse>({
        url: material.id
            ? parametrizeURL(ESTIMATE_ENDPOINTS.updateMaterial, { estimateId: `${estimateId}`, id: `${material.id}` })
            : parametrizeURL(ESTIMATE_ENDPOINTS.createMaterial, { estimateId: `${estimateId}` }),
        method: material.id ? Method.PUT : Method.POST,
        data: {
            ...material,
            externalId: (itemName as MaterialOption).id
        }
    }).then(({ prices, item }) => ({
        prices: {
            ...prices,
            tax: transformPricesTaxFromResponse(prices.tax, taxesOptions)
        },
        item: { itemName, ...material, id: item.id }
    }));

export const deleteEstimateMaterial = (estimateId: number, materialId: number | string, taxesOptions: TaxOption[]): Promise<ItemPrices> =>
    apiRequest<ItemResponsePrices>({
        url: parametrizeURL(ESTIMATE_ENDPOINTS.updateMaterial, { estimateId: `${estimateId}`, id: `${materialId}` }),
        method: Method.DELETE,
        allowDeleteResponse: true
    }).then(prices => ({
        ...prices,
        tax: transformPricesTaxFromResponse(prices.tax, taxesOptions)
    }));

// Discount

export const updateDiscount = (data: DiscountFormValues, estimateId: number, taxesOptions: TaxOption[]) => {
    const requestData = { ...data, amount: +data.amount, description: data.description || null };
    return apiRequest<ItemResponsePrices>({
        url: parametrizeURL(ESTIMATE_ENDPOINTS.discount, { estimateId: `${estimateId}` }),
        method: Method.PUT,
        data: requestData
    }).then(prices => ({
        ...prices,
        tax: transformPricesTaxFromResponse(prices.tax, taxesOptions)
    }));
};

export const deleteDiscount = (estimateId: number, taxesOptions: TaxOption[]) =>
    apiRequest<ItemResponsePrices>({
        url: parametrizeURL(ESTIMATE_ENDPOINTS.discount, { estimateId: `${estimateId}` }),
        method: Method.DELETE,
        allowDeleteResponse: true
    }).then(prices => ({
        ...prices,
        tax: transformPricesTaxFromResponse(prices.tax, taxesOptions)
    }));

// Tax
export const updateEstimateTax = (taxId: number, estimateId: number, taxOptions: TaxOption[]) =>
    apiRequest<ItemResponsePrices>({
        url: parametrizeURL(ESTIMATE_ENDPOINTS.tax, { estimateId: `${estimateId}`, id: `${taxId}` }),
        method: Method.PUT
    }).then(prices => ({
        ...prices,
        tax: transformPricesTaxFromResponse(prices.tax, taxOptions)
    }));

// Notify Estimate (Email/SMS)
export const getEstimateNotify = (estimateId: number) =>
    apiRequest<EstimateEmailResponse>({ url: parametrizeURL(ESTIMATE_ENDPOINTS.notify, { estimateId }), method: Method.GET });

export const createEstimateNotify = (data: EstimateNotifyRequest, estimateId: string) =>
    apiRequest<ItemPrices>({
        url: parametrizeURL(ESTIMATE_ENDPOINTS.notify, { estimateId }),
        method: Method.POST,
        data
    });
