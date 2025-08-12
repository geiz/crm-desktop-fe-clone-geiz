const formatPriceValue = (value: number) => {
    const formatted = Math.abs(Number(Number(value).toFixed(2))).toLocaleString('en-IN');

    return value < 0 ? `-$${formatted}` : `$${formatted}`;
};

export default formatPriceValue;
