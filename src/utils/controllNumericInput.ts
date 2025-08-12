const controllNumericInput = (inputValue: string) => {
    let value = inputValue.replace(/[^0-9.]/g, ''); // Remove non-numeric characters except "."
    value = value.replace(/(\..*)\./g, '$1'); // Prevent multiple dots
    return value;
};

export default controllNumericInput;
