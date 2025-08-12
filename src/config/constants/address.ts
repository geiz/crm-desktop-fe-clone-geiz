import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { SelectOption } from 'types/common';
import formatGmtOffset from 'utils/formatGmtOffset';

dayjs.extend(utc);
dayjs.extend(timezone);

const rawTimezones: SelectOption[] = [
    { value: 'America/Toronto', label: 'Eastern Time - Toronto (DST)' },
    { value: 'America/Montreal', label: 'Eastern Time - Montreal (DST)' },
    { value: 'America/Halifax', label: 'Atlantic Time - Halifax (DST)' },
    { value: 'America/St_Johns', label: "Newfoundland Time - St. John's (DST)" },
    { value: 'America/Regina', label: 'Central Time - Regina (no DST)' },
    { value: 'America/Edmonton', label: 'Mountain Time - Edmonton (DST)' },
    { value: 'America/Vancouver', label: 'Pacific Time - Vancouver (DST)' },
    { value: 'America/New_York', label: 'Eastern Time - New York (DST)' },
    { value: 'America/Detroit', label: 'Eastern Time - Detroit (DST)' },
    { value: 'America/Chicago', label: 'Central Time - Chicago (DST)' },
    { value: 'America/Winnipeg', label: 'Central Time - Winnipeg (DST)' },
    { value: 'America/Denver', label: 'Mountain Time - Denver (DST)' },
    { value: 'America/Phoenix', label: 'Mountain Time - Phoenix (no DST)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time - Los Angeles (DST)' },
    { value: 'America/Anchorage', label: 'Alaska Time - Anchorage (DST)' },
    { value: 'Pacific/Honolulu', label: 'Hawaii Time - Honolulu (no DST)' }
];

// Collecting an array for selection with the current offset
export const TIMEZONES = rawTimezones.map(({ value, label }) => {
    const offset = dayjs()
        .tz(value as string)
        .utcOffset();
    const gmt = formatGmtOffset(offset);

    return {
        value,
        label: `(${gmt}) ${label}`
    };
});

export const COUNTRIES_TITLECASE = [
    {
        name: 'United States',
        abbreviation: 'US'
    },
    {
        name: 'Canada',
        abbreviation: 'CA'
    }
];

export const CA_PROVINCES = [
    { name: 'Alberta', code: 'AB', countryCode: 'CA', country: 'Canada' },
    { name: 'British Columbia', code: 'BC', countryCode: 'CA', country: 'Canada' },
    { name: 'Manitoba', code: 'MB', countryCode: 'CA', country: 'Canada' },
    { name: 'New Brunswick', code: 'NB', countryCode: 'CA', country: 'Canada' },
    { name: 'Newfoundland and Labrador', code: 'NL', countryCode: 'CA', country: 'Canada' },
    { name: 'Nova Scotia', code: 'NS', countryCode: 'CA', country: 'Canada' },
    { name: 'Ontario', code: 'ON', countryCode: 'CA', country: 'Canada' },
    { name: 'Prince Edward Island', code: 'PE', countryCode: 'CA', country: 'Canada' },
    { name: 'Quebec', code: 'QC', countryCode: 'CA', country: 'Canada' },
    { name: 'Saskatchewan', code: 'SK', countryCode: 'CA', country: 'Canada' },
    { name: 'Northwest Territories', code: 'NT', countryCode: 'CA', country: 'Canada' },
    { name: 'Nunavut', code: 'NU', countryCode: 'CA', country: 'Canada' },
    { name: 'Yukon', code: 'YT', countryCode: 'CA', country: 'Canada' }
];

export const US_STATES = [
    { name: 'Alabama', code: 'AL', countryCode: 'US', country: 'United States' },
    { name: 'Alaska', code: 'AK', countryCode: 'US', country: 'United States' },
    { name: 'Arizona', code: 'AZ', countryCode: 'US', country: 'United States' },
    { name: 'Arkansas', code: 'AR', countryCode: 'US', country: 'United States' },
    { name: 'California', code: 'CA', countryCode: 'US', country: 'United States' },
    { name: 'Colorado', code: 'CO', countryCode: 'US', country: 'United States' },
    { name: 'Connecticut', code: 'CT', countryCode: 'US', country: 'United States' },
    { name: 'Delaware', code: 'DE', countryCode: 'US', country: 'United States' },
    { name: 'Florida', code: 'FL', countryCode: 'US', country: 'United States' },
    { name: 'Georgia', code: 'GA', countryCode: 'US', country: 'United States' },
    { name: 'Hawaii', code: 'HI', countryCode: 'US', country: 'United States' },
    { name: 'Idaho', code: 'ID', countryCode: 'US', country: 'United States' },
    { name: 'Illinois', code: 'IL', countryCode: 'US', country: 'United States' },
    { name: 'Indiana', code: 'IN', countryCode: 'US', country: 'United States' },
    { name: 'Iowa', code: 'IA', countryCode: 'US', country: 'United States' },
    { name: 'Kansas', code: 'KS', countryCode: 'US', country: 'United States' },
    { name: 'Kentucky', code: 'KY', countryCode: 'US', country: 'United States' },
    { name: 'Louisiana', code: 'LA', countryCode: 'US', country: 'United States' },
    { name: 'Maine', code: 'ME', countryCode: 'US', country: 'United States' },
    { name: 'Maryland', code: 'MD', countryCode: 'US', country: 'United States' },
    { name: 'Massachusetts', code: 'MA', countryCode: 'US', country: 'United States' },
    { name: 'Michigan', code: 'MI', countryCode: 'US', country: 'United States' },
    { name: 'Minnesota', code: 'MN', countryCode: 'US', country: 'United States' },
    { name: 'Mississippi', code: 'MS', countryCode: 'US', country: 'United States' },
    { name: 'Missouri', code: 'MO', countryCode: 'US', country: 'United States' },
    { name: 'Montana', code: 'MT', countryCode: 'US', country: 'United States' },
    { name: 'Nebraska', code: 'NE', countryCode: 'US', country: 'United States' },
    { name: 'Nevada', code: 'NV', countryCode: 'US', country: 'United States' },
    { name: 'New Hampshire', code: 'NH', countryCode: 'US', country: 'United States' },
    { name: 'New Jersey', code: 'NJ', countryCode: 'US', country: 'United States' },
    { name: 'New Mexico', code: 'NM', countryCode: 'US', country: 'United States' },
    { name: 'New York', code: 'NY', countryCode: 'US', country: 'United States' },
    { name: 'North Carolina', code: 'NC', countryCode: 'US', country: 'United States' },
    { name: 'North Dakota', code: 'ND', countryCode: 'US', country: 'United States' },
    { name: 'Ohio', code: 'OH', countryCode: 'US', country: 'United States' },
    { name: 'Oklahoma', code: 'OK', countryCode: 'US', country: 'United States' },
    { name: 'Oregon', code: 'OR', countryCode: 'US', country: 'United States' },
    { name: 'Pennsylvania', code: 'PA', countryCode: 'US', country: 'United States' },
    { name: 'Rhode Island', code: 'RI', countryCode: 'US', country: 'United States' },
    { name: 'South Carolina', code: 'SC', countryCode: 'US', country: 'United States' },
    { name: 'South Dakota', code: 'SD', countryCode: 'US', country: 'United States' },
    { name: 'Tennessee', code: 'TN', countryCode: 'US', country: 'United States' },
    { name: 'Texas', code: 'TX', countryCode: 'US', country: 'United States' },
    { name: 'Utah', code: 'UT', countryCode: 'US', country: 'United States' },
    { name: 'Vermont', code: 'VT', countryCode: 'US', country: 'United States' },
    { name: 'Virginia', code: 'VA', countryCode: 'US', country: 'United States' },
    { name: 'Washington', code: 'WA', countryCode: 'US', country: 'United States' },
    { name: 'West Virginia', code: 'WV', countryCode: 'US', country: 'United States' },
    { name: 'Wisconsin', code: 'WI', countryCode: 'US', country: 'United States' },
    { name: 'Wyoming', code: 'WY', countryCode: 'US', country: 'United States' }
];
