import { apiRequest } from './apiUtils';

import { getPaymentTypeName } from 'components/Invoice/constants';

import { parametrizeURL } from './utils';
import { INVOICE_ENDPOINTS, JOB_ENDPOINTS } from 'constants/endpoints';
import { FileImg, Method } from 'types/common';
import {
    DiscountFormValues,
    EstimateEmailResponse,
    EstimateNotifyRequest,
    MaterialOption,
    MaterialResponseEntity,
    ServiceOption,
    ServiceResponseEntity,
    TaxInfo,
    TaxOption
} from 'types/estimateTypes';
import {
    CreditCardCredentialsRequest,
    CreditCardCredentialsResponse,
    InvoiceEntity,
    InvoiceItemResponsePrices,
    InvoiceMaterial,
    InvoiceMaterialWithPrices,
    InvoiceMaterialWithPricesResponse,
    InvoicePayment,
    InvoicePrices,
    InvoiceResponseEntity,
    InvoiceService,
    InvoiceServiceWithPrices,
    InvoiceServiceWithPricesResponse,
    PaymentFormValues,
    PaymentTabsData
} from 'types/invoiceTypes';

const transformResponseService = ({ externalId, ...service }: ServiceResponseEntity, options: ServiceOption[]): InvoiceService => ({
    itemName: options.find(option => option.id === externalId) as ServiceOption,
    ...service
});

const transformResponseMaterial = ({ externalId, ...material }: MaterialResponseEntity, options: MaterialOption[]): InvoiceMaterial => ({
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

const transformPaymentsFromResponse = (payments: InvoicePayment[]) => {
    const res = payments.map(payment => {
        if (!payment.parentId) {
            return {
                ...payment,
                refunds: payments
                    .filter(p => p.parentId === payment.id)
                    .map(refund => ({
                        ...refund,
                        type: `${getPaymentTypeName(refund.type)} ${getPaymentTypeName(payment.type)}`
                    }))
            };
        }

        return undefined;
    });

    return res.filter(e => Boolean(e));
};

export const createInvoice = (jobId: number): Promise<InvoiceEntity> =>
    apiRequest<InvoiceResponseEntity>({ url: parametrizeURL(INVOICE_ENDPOINTS.create, { jobId: `${jobId}` }), method: Method.GET }).then(
        ({ prices, services, materials, ...invoice }) => ({
            ...invoice,
            prices: {
                ...prices,
                tax: transformPricesTaxFromResponse(prices.tax, invoice.taxesOptions)
            },
            services: services.map(service => transformResponseService(service, invoice.serviceOptions)),
            materials: materials.map(material => transformResponseMaterial(material, invoice.materialOptions))
        })
    );

export const getInvoiceById = (jobId: number) =>
    apiRequest<InvoiceResponseEntity>({ url: parametrizeURL(INVOICE_ENDPOINTS.byId, { jobId }), method: Method.GET }).then(
        ({ prices, services, materials, payments, ...invoice }) => ({
            ...invoice,
            prices: {
                ...prices,
                tax: transformPricesTaxFromResponse(prices.tax, invoice.taxesOptions)
            },
            payments: payments ? transformPaymentsFromResponse(payments) : null,
            services: services.map(service => transformResponseService(service, invoice.serviceOptions)),
            materials: materials.map(material => transformResponseMaterial(material, invoice.materialOptions))
        })
    );

// Service

export const updateInvoiceService = (
    jobId: number,
    { itemName, ...service }: Omit<InvoiceService, 'id'> & { id?: number },
    taxesOptions: TaxOption[]
): Promise<InvoiceServiceWithPrices> =>
    apiRequest<InvoiceServiceWithPricesResponse>({
        url: service.id
            ? parametrizeURL(INVOICE_ENDPOINTS.updateService, { jobId: `${jobId}`, id: `${service.id}` })
            : parametrizeURL(INVOICE_ENDPOINTS.createService, {
                  jobId: `${jobId}`
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

export const deleteInvoiceService = (jobId: number, serviceId: number | string, taxesOptions: TaxOption[]): Promise<InvoicePrices> =>
    apiRequest<InvoiceItemResponsePrices>({
        url: parametrizeURL(INVOICE_ENDPOINTS.updateService, { jobId: `${jobId}`, id: `${serviceId}` }),
        method: Method.DELETE,
        allowDeleteResponse: true
    }).then(prices => ({
        ...prices,
        tax: transformPricesTaxFromResponse(prices.tax, taxesOptions)
    }));

// Material

export const updateInvoiceMaterial = (
    jobId: number,
    { itemName, ...material }: Omit<InvoiceMaterial, 'id'> & { id?: number },
    taxesOptions: TaxOption[]
): Promise<InvoiceMaterialWithPrices> =>
    apiRequest<InvoiceMaterialWithPricesResponse>({
        url: material.id
            ? parametrizeURL(INVOICE_ENDPOINTS.updateMaterial, { jobId: `${jobId}`, id: `${material.id}` })
            : parametrizeURL(INVOICE_ENDPOINTS.createMaterial, { jobId: `${jobId}` }),
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

export const deleteInvoiceMaterial = (jobId: number, materialId: number | string, taxesOptions: TaxOption[]): Promise<InvoicePrices> =>
    apiRequest<InvoiceItemResponsePrices>({
        url: parametrizeURL(INVOICE_ENDPOINTS.updateMaterial, { jobId: `${jobId}`, id: `${materialId}` }),
        method: Method.DELETE,
        allowDeleteResponse: true
    }).then(prices => ({
        ...prices,
        tax: transformPricesTaxFromResponse(prices.tax, taxesOptions)
    }));

// Discount

export const updateInvoiceDiscount = (data: DiscountFormValues, jobId: number, taxesOptions: TaxOption[]) => {
    const requestData = { ...data, amount: +data.amount, description: data.description || null };
    return apiRequest<InvoiceItemResponsePrices>({
        url: parametrizeURL(INVOICE_ENDPOINTS.discount, { jobId: `${jobId}` }),
        method: Method.PUT,
        data: requestData
    }).then(prices => ({
        ...prices,
        tax: transformPricesTaxFromResponse(prices.tax, taxesOptions)
    }));
};

export const deleteInvoiceDiscount = (jobId: number, taxesOptions: TaxOption[]) =>
    apiRequest<InvoiceItemResponsePrices>({
        url: parametrizeURL(INVOICE_ENDPOINTS.discount, { jobId: `${jobId}` }),
        method: Method.DELETE,
        allowDeleteResponse: true
    }).then(prices => ({
        ...prices,
        tax: transformPricesTaxFromResponse(prices.tax, taxesOptions)
    }));

// Tax
export const updateInvoiceTax = (taxId: number, jobId: number, taxOptions: TaxOption[]) =>
    apiRequest<InvoiceItemResponsePrices>({
        url: parametrizeURL(INVOICE_ENDPOINTS.tax, { jobId: `${jobId}`, id: `${taxId}` }),
        method: Method.PUT
    }).then(prices => ({
        ...prices,
        tax: transformPricesTaxFromResponse(prices.tax, taxOptions)
    }));

// Notify Invoice (Email/SMS)
export const getInvoiceNotify = (jobId: number) =>
    apiRequest<EstimateEmailResponse>({ url: parametrizeURL(INVOICE_ENDPOINTS.notify, { jobId }), method: Method.GET });

export const createInvoiceNotify = (data: EstimateNotifyRequest, jobId: string) =>
    apiRequest<boolean>({
        url: parametrizeURL(INVOICE_ENDPOINTS.notify, { jobId }),
        method: Method.POST,
        data
    });

// Payments
export const createPayment = (data: PaymentFormValues, activeTab: PaymentTabsData, jobId: number) =>
    apiRequest<{ payment: InvoicePayment; prices: InvoiceEntity['prices'] }>({
        method: Method.POST,
        url: parametrizeURL(INVOICE_ENDPOINTS.payments, { jobId, method: activeTab.name.toLowerCase() }),
        data
    });

export const getCreditCardCredentials = (data: CreditCardCredentialsRequest, jobId: string | number, paymentCardId?: string) =>
    apiRequest<CreditCardCredentialsResponse>({
        url: parametrizeURL(INVOICE_ENDPOINTS.payments, { jobId, method: 'card' }),
        method: Method.POST,
        data,
        params: {
            paymentCardId: paymentCardId ? +paymentCardId : undefined
        }
    });

export const deletePayment = (paymentId: number, jobId: number) =>
    apiRequest<{ prices: InvoiceEntity['prices'] }>({
        method: Method.DELETE,
        url: parametrizeURL(JOB_ENDPOINTS.deletePayment, { jobId, paymentId }),
        allowDeleteResponse: true
    });

export const createRefundPayment = (data: PaymentFormValues, paymentId: number, jobId: number) =>
    apiRequest<{ payment: InvoicePayment; prices: InvoiceEntity['prices'] }>({
        method: Method.POST,
        url: parametrizeURL(JOB_ENDPOINTS.refundPayment, { jobId, paymentId }),
        data
    });

export const editPayment = (data: Partial<PaymentFormValues>, paymentId: number, jobId: number) =>
    apiRequest<{ payment: InvoicePayment; prices: InvoiceEntity['prices'] }>({
        method: Method.PUT,
        url: parametrizeURL(JOB_ENDPOINTS.editPayment, { jobId, paymentId }),
        data
    });

export const getPaymentFile = (paymentId: number, jobId: number) =>
    apiRequest<FileImg>({
        url: parametrizeURL(INVOICE_ENDPOINTS.getPaymentFile, { jobId, paymentId }),
        method: Method.GET
    });
