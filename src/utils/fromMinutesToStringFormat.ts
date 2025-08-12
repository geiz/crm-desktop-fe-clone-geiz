const fromMinutesToStringFormat = value => {
    const num = parseInt(value, 10);
    if (isNaN(num)) return '';

    const hours = Math.floor(num / 60);
    const mins = num % 60;

    return `${hours}h ${mins}m`;
};

export default fromMinutesToStringFormat;
