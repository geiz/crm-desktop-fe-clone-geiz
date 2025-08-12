const formatIdTo8Digits = (num: string | number): string => {
    const [id, rest] = num.toString().split('-');
    return `${id.padStart(8, '0')}${rest ? `-${rest}` : ''}`;
};

export default formatIdTo8Digits;
