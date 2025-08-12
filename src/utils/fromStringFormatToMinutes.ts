const fromStringFormatToMinutes = value => {
    if (!value) return 0;

    const hoursMatch = value.match(/(\d+)h/); // Extract hours
    const minutesMatch = value.match(/(\d+)m/); // Extract minutes
    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;

    return hours * 60 + minutes;
};

export default fromStringFormatToMinutes;
