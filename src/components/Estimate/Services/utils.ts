import { EstimateEmailResponseOrderInfo, EstimateService } from 'types/estimateTypes';

export const getTransformedServices = (services: EstimateService[]): EstimateEmailResponseOrderInfo[] =>
    services.map(({ itemName, ...service }) => ({
        name: itemName?.name || '',
        ...service
    }));

export const getInitialService = (): EstimateService => ({
    id: `local-${Math.random() * 100 + 1000000}`,
    itemName: null,
    quantity: 1,
    price: 0,
    summary: ''
});
