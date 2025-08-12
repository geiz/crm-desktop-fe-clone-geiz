// converts 'ratePercent' field to a number with 3 decimal places
export const prepareTaxRateValue = (item?: Record<string, string | number>) => {
    if (!item) return {};
    const updatedItem = { ...item };
    if ('ratePercent' in item) {
        updatedItem.ratePercent = item.ratePercent ? Number(parseFloat(String(item.ratePercent)).toFixed(3)) : item.ratePercent;
    }
    return updatedItem;
};

export default prepareTaxRateValue;
