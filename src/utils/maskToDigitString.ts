const maskToDigitString = (phone: string | null): string | null => {
    if (!phone) return null; // handle java falsy value
    return '1' + phone.replace(/\D/g, '');
};

export default maskToDigitString;
