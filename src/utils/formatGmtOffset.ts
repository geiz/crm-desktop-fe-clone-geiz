// Function for formatting offset from minutes to GMT±HH:mm
function formatGmtOffset(offsetMinutes: number): string {
    const sign = offsetMinutes >= 0 ? '+' : '-'; // dayjs.utcOffset returns negative numbers for the east
    const absOffset = Math.abs(offsetMinutes);
    const hours = Math.floor(absOffset / 60)
        .toString()
        .padStart(2, '0');
    const minutes = (absOffset % 60).toString().padStart(2, '0');
    return `GMT${sign}${hours}:${minutes}`;
}

export default formatGmtOffset;
