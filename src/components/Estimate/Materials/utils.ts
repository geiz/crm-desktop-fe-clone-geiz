import { EstimateEmailResponseOrderInfo, EstimateMaterial } from 'types/estimateTypes';

export const getTransformedMaterials = (materials: EstimateMaterial[]): EstimateEmailResponseOrderInfo[] =>
    materials.map(({ itemName, ...material }) => ({
        name: itemName?.name || '',
        ...material
    }));

export const getInitialMaterial = (): EstimateMaterial => ({
    id: `local-${Math.random() * 100 + 1000000}`,
    itemName: null,
    quantity: 1,
    price: 0,
    summary: '',
    partNumber: ''
});
