import { DISCOUNT_TYPE } from 'types/estimateTypes';

export const radioBtns: { label: string; value: DISCOUNT_TYPE }[] = [
    { label: 'Percentage', value: DISCOUNT_TYPE.PERCENTAGE },
    { label: 'Amount', value: DISCOUNT_TYPE.AMOUNT }
];

export const initialFormData = { type: DISCOUNT_TYPE.PERCENTAGE, amount: '', description: '' };
