import { Client } from 'types/client';
import { Address, BaseItem, DateTimeType, Note } from 'types/common';
import { InvoicePayment } from 'types/invoiceTypes';

export const enum ESTIMATE_STATUS {
    DRAFT = 'DRAFT',
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    // TODO check and update statuses
    SOLD = 'SOLD'
}

export const enum DISCOUNT_TYPE {
    PERCENTAGE = 'PERCENTAGE',
    AMOUNT = 'AMOUNT'
}

export interface TaxInfo {
    id: number;
    value: number;
}

export interface TaxOption {
    id: number;
    name: string;
    ratePercent: number;
}

export interface ServiceOption {
    id: number;
    name: string;
    price: number;
    summary: string | null;
}

export type MaterialOption = ServiceOption;

export interface Discount {
    type: DISCOUNT_TYPE | null;
    amount: number;
    value: number;
    description: string | null;
}

export interface ItemResponsePrices {
    subTotal: number;
    discount: Discount;
    tax: TaxInfo | null;
    total: number;
}

export interface ServiceResponseEntity {
    id: number;
    externalId: number;
    quantity: number;
    price: number;
    summary: string;
}

export interface MaterialResponseEntity extends ServiceResponseEntity {
    partNumber: string;
}

export interface EstimateResponseEntity {
    id: number;
    jobId: number;
    soldBy: string;
    createdAt: DateTimeType;
    status: ESTIMATE_STATUS;
    client: Client;
    billing: Omit<Client, 'id'>;
    notes: Note[];
    tags: BaseItem[];
    files: BaseItem[];
    businessUnit: string;
    services: ServiceResponseEntity[];
    materials: MaterialResponseEntity[];
    prices: ItemResponsePrices;
    taxesOptions: TaxOption[];
    serviceOptions: ServiceOption[];
    materialOptions: MaterialOption[];
    reasonNote?: string;
}

export interface EstimateService extends Omit<ServiceResponseEntity, 'externalId' | 'id'> {
    itemName: ServiceOption | null;
    id: number | string;
}
export interface EstimateMaterial extends Omit<MaterialResponseEntity, 'externalId' | 'id'> {
    itemName: MaterialOption | null;
    id: number | string;
}

export interface ItemPrices extends Omit<ItemResponsePrices, 'tax'> {
    tax: { rate: TaxOption; value: number } | null;
}

export interface EstimateEntity extends Omit<EstimateResponseEntity, 'services' | 'materials' | 'prices'> {
    prices: ItemPrices;
    services: EstimateService[];
    materials: EstimateMaterial[];
}

interface ItemWithPricesResponse<Item> {
    item: Item;
    prices: ItemResponsePrices;
}
export type ServiceWithPricesResponse = ItemWithPricesResponse<ServiceResponseEntity>;
export type MaterialWithPricesResponse = ItemWithPricesResponse<MaterialResponseEntity>;

interface EstimateItemWithPrices<Item> {
    item: Item;
    prices: ItemPrices;
}
export type ServiceWithPrices = EstimateItemWithPrices<EstimateService>;
export type MaterialWithPrices = EstimateItemWithPrices<EstimateMaterial>;

export interface DiscountFormValues {
    type: DISCOUNT_TYPE;
    amount: string;
    description: string;
}

export interface EstimateCardItem {
    id: number;
    status: ESTIMATE_STATUS;
    serviceName: string;
    total: number;
}

// Email

export type EstimateEmailResponseOrderInfo = Omit<MaterialResponseEntity, 'externalId' | 'id' | 'partNumber'> & {
    id: number | string;
    name: string;
    partNumber?: string;
};

export interface EstimateTaxFullInfo {
    id: number;
    value: number;
    percent: number;
    name: string;
}

// Estimate Email
export interface EstimateEmailResponse {
    id: number;
    jobId: number;
    createdAt: DateTimeType;
    company: {
        name: string;
        phone: string;
        email: string;
        image: string;
        address: Omit<Address, 'apartment'>;
    };
    client: {
        name: string;
        address: Address;
        email: string;
        phone: number;
        billing: {
            name: string;
            address: Omit<Address, 'apartment'>;
            email: string;
            phone: number;
        };
    };
    services: EstimateEmailResponseOrderInfo[];
    materials: EstimateEmailResponseOrderInfo[];
    payments?: InvoicePayment[];
    prices: Omit<ItemResponsePrices, 'tax'> & { tax: EstimateTaxFullInfo | null };
    agreement: string;
    terms: string;
    status: ESTIMATE_STATUS;
}

export interface EstimateNotifyRequest {
    emails?: string[];
    phones?: string[];
    pdf?: string;
}
