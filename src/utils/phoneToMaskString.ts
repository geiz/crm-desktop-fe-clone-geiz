const phoneToMaskString = (phone: string) => {
    // 11 - phone digits amount without '+'
    if (phone.length === 11) return phone.slice(1).replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    else return phone;
};

export default phoneToMaskString;
