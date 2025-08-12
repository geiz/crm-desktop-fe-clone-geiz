import { FileImg } from './common';

import { RegisterOptions } from 'react-hook-form';

import { TableCellProps } from 'components/Table/types';

import {
    EstimateMaterial,
    EstimateResponseEntity,
    EstimateService,
    ItemPrices,
    ItemResponsePrices,
    MaterialResponseEntity,
    ServiceResponseEntity
} from 'types/estimateTypes';

export enum INVOICE_PAYMENT_TYPE {
    CREDIT_CARD = 'CREDIT_CARD',
    CASH = 'CASH',
    CHECK = 'CHECK',
    E_TRANSFER = 'E_TRANSFER',
    OTHER = 'OTHER',
    REFUND = 'REFUND'
}

export enum INVOICE_PAYMENT_STATUS {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED'
}

export interface InvoicePayment {
    id: number;
    paidAt: number;
    type: INVOICE_PAYMENT_TYPE;
    status: INVOICE_PAYMENT_STATUS;
    note: string;
    amount: number;
    canDelete: boolean;
    parentId: InvoicePayment['id'] | undefined;
    file: FileImg;
    refunds?: InvoicePayment[];
    referenceNumber?: string | null;
    checkNumber?: string | null;
    signatureBase64: string;
}

export interface RefundPayment extends InvoicePayment {
    refundIcon?: string | undefined;
}

export interface InvoiceItemResponsePrices extends ItemResponsePrices {
    amountPaid: number;
    balance: number;
}

interface InvoiceItemWithPricesResponse<Item> {
    item: Item;
    prices: InvoiceItemResponsePrices;
}
export type InvoiceServiceWithPricesResponse = InvoiceItemWithPricesResponse<ServiceResponseEntity>;
export type InvoiceMaterialWithPricesResponse = InvoiceItemWithPricesResponse<MaterialResponseEntity>;

export interface ClientCreditCardEntity {
    id: number;
    brand: string; // "visa"
    last4: string; // "4342"
    expMonth: number; // 2
    expYear: number; // 2033
}

export interface InvoiceResponseEntity
    extends Omit<EstimateResponseEntity, 'soldBy' | 'tags' | 'notes' | 'files' | 'status' | 'businessUnit' | 'prices'> {
    payments: InvoicePayment[] | null;
    prices: InvoiceItemResponsePrices;
    file: File;
    clientCards: ClientCreditCardEntity[];
}

export type InvoiceService = EstimateService;

export type InvoiceMaterial = EstimateMaterial;

export type InvoicePrices = ItemPrices & {
    amountPaid: number;
    balance: number;
};

export interface InvoiceEntity extends Omit<InvoiceResponseEntity, 'services' | 'materials' | 'prices' | 'status'> {
    prices: ItemPrices & {
        amountPaid: number;
        balance: number;
    };
    services: InvoiceService[];
    materials: InvoiceMaterial[];
    payments: InvoicePayment[] | null;
}

interface InvoiceItemWithPrices<Item> {
    item: Item;
    prices: InvoicePrices;
}
export type InvoiceServiceWithPrices = InvoiceItemWithPrices<EstimateService>;
export type InvoiceMaterialWithPrices = InvoiceItemWithPrices<EstimateMaterial>;

export interface InvoiceCardItem {
    id: number;
    total: number;
    amountPaid: number;
    balance: number;
}

// Payments

export interface CreditCardCredentialsRequest {
    amount: number;
    note?: string;
}

export interface CreditCardCredentialsResponse {
    clientSecret: string;
}
export interface PaymentFormValues {
    amount: number;
    note: string;
    checkNumber?: string;
    referenceNumber?: string;
    //zipCode?: string;
    file?: null | Record<string, string>;
    paymentCardId?: string;
}

export type PaymentFormInput<Name extends keyof Omit<PaymentFormValues, 'file'> = keyof Omit<PaymentFormValues, 'file'>> = {
    name: Name;
    label: string;
    placeholder: string;
    rules?: RegisterOptions<PaymentFormValues, Name>;
};

export interface PaymentTabsData {
    name: string;
    disabled: boolean;
    input: PaymentFormInput | null;
}

export interface PaymentCellProps {
    cell: TableCellProps;
    rowData: InvoicePayment;
}
