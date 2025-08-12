import dayjs from 'dayjs';

const generateTimeOptions = (timezone: string, format: string) =>
    Array.from({ length: 24 }, (_, i) => {
        const timeInCompanyTz = dayjs().tz(timezone).startOf('day').add(i, 'hour');
        return {
            value: i,
            label: timeInCompanyTz.format(format)
        };
    });

export default generateTimeOptions;
