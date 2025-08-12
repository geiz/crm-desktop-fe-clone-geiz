import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { getPaymentTypeName } from 'components/Invoice/constants';

import {
    INVOICE_PAYMENT_TYPE,
    InvoiceEntity,
    InvoiceMaterial,
    InvoiceMaterialWithPrices,
    InvoicePayment,
    InvoicePrices,
    InvoiceService,
    InvoiceServiceWithPrices
} from 'types/invoiceTypes';

export interface InvoiceState {
    invoiceInfo: InvoiceEntity | null;
}

const initialState: InvoiceState = { invoiceInfo: null };

const invoiceSlice = createSlice({
    name: 'invoice',
    initialState,
    reducers: {
        storeInvoice: (state, action: PayloadAction<InvoiceEntity>) => {
            state.invoiceInfo = action.payload;
        },
        clearInvoiceInfo: state => {
            state.invoiceInfo = null;
        },
        addService: (state, action: PayloadAction<InvoiceService>) => {
            if (state.invoiceInfo) {
                state.invoiceInfo.services = [...state.invoiceInfo.services, action.payload];
            }
        },
        updateService: (state, action: PayloadAction<InvoiceServiceWithPrices & { localId?: string }>) => {
            if (state.invoiceInfo) {
                state.invoiceInfo.services = state.invoiceInfo.services.map(service => {
                    if (action.payload.localId) {
                        return service.id === action.payload.localId ? action.payload.item : service;
                    }
                    return service.id === action.payload.item.id ? action.payload.item : service;
                });
                state.invoiceInfo.prices = action.payload.prices;
            }
        },
        deleteService: (state, action: PayloadAction<{ prices?: InvoicePrices; id: number | string }>) => {
            if (state.invoiceInfo) {
                state.invoiceInfo.services = state.invoiceInfo.services.filter(service => service.id !== action.payload.id);

                if (action.payload.prices) {
                    state.invoiceInfo.prices = action.payload.prices;
                }
            }
        },
        addMaterial: (state, action: PayloadAction<InvoiceMaterial>) => {
            if (state.invoiceInfo) {
                state.invoiceInfo.materials = [...state.invoiceInfo.materials, action.payload];
            }
        },
        updateMaterial: (state, action: PayloadAction<InvoiceMaterialWithPrices & { localId?: string }>) => {
            if (state.invoiceInfo) {
                state.invoiceInfo.materials = state.invoiceInfo.materials.map(material => {
                    if (action.payload.localId) {
                        return material.id === action.payload.localId ? action.payload.item : material;
                    }
                    return material.id === action.payload.item.id ? action.payload.item : material;
                });
                state.invoiceInfo.prices = action.payload.prices;
            }
        },
        deleteMaterial: (state, action: PayloadAction<{ prices?: InvoicePrices; id: number | string }>) => {
            if (state.invoiceInfo) {
                state.invoiceInfo.materials = state.invoiceInfo.materials.filter(material => material.id !== action.payload.id);
                if (action.payload.prices) {
                    state.invoiceInfo.prices = action.payload.prices;
                }
            }
        },
        storePrices: (state, action: PayloadAction<InvoicePrices>) => {
            if (state.invoiceInfo) {
                state.invoiceInfo.prices = action.payload;
            }
        },
        addPayment: (state, action: PayloadAction<{ payment: InvoicePayment; prices: InvoiceEntity['prices'] }>) => {
            const { payment, prices } = action.payload;
            if (state.invoiceInfo) {
                (state.invoiceInfo.payments || []).push({ ...payment, refunds: [] });
                state.invoiceInfo.prices = prices;
            }
        },
        updatePayment: (state, action: PayloadAction<{ payment: InvoicePayment; prices: InvoiceEntity['prices'] }>) => {
            const { payment, prices } = action.payload;
            if (state.invoiceInfo && state.invoiceInfo.payments) {
                state.invoiceInfo.payments = state.invoiceInfo.payments?.map(p => (p.id === payment.id ? { ...payment, refunds: [] } : p));
                state.invoiceInfo.prices = prices;
            }
        },
        addRefundPayment: (state, action: PayloadAction<{ payment: InvoicePayment; prices: InvoiceEntity['prices'] }>) => {
            const { payment, prices } = action.payload;
            if (state.invoiceInfo?.payments) {
                state.invoiceInfo.prices = prices;
                state.invoiceInfo.payments = state.invoiceInfo.payments.map(p =>
                    p.id === payment.parentId
                        ? {
                              ...p,
                              refunds: [
                                  ...(p.refunds || []),
                                  {
                                      ...payment,
                                      type: `${getPaymentTypeName(payment.type)} ${getPaymentTypeName(p.type)}` as INVOICE_PAYMENT_TYPE
                                  }
                              ]
                          }
                        : p
                );
            }
        },
        removePayment: (state, action: PayloadAction<{ id: InvoicePayment['id']; prices?: InvoicePrices }>) => {
            if (state.invoiceInfo?.payments) {
                state.invoiceInfo.payments = state.invoiceInfo.payments.filter(p => p.id !== action.payload.id);
                if (action.payload.prices) {
                    state.invoiceInfo.prices = action.payload.prices;
                }
            }
        }
    }
});

export const {
    storeInvoice,
    clearInvoiceInfo,
    addService,
    updateService,
    deleteService,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    storePrices,
    addPayment,
    addRefundPayment,
    removePayment,
    updatePayment
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
