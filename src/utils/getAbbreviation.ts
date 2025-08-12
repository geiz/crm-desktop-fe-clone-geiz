const getAbbreviation = (string: string) => {
    const res = string
        .replace('-', ' ')
        .split(' ')
        .filter(el => el.length > 0)
        .map(el => el[0]?.toUpperCase() || '')
        .join('');

    return res.slice(0, 3);
};

export default getAbbreviation;
