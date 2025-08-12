import { CA_PROVINCES, COUNTRIES_TITLECASE, US_STATES } from 'constants/address';

export const getCountryAbbreviation = (country: string) => COUNTRIES_TITLECASE.find(c => c.name === country)?.abbreviation;

export const getStateAbbreviation = (country: string, state: string) => {
    if (country === 'United States') return US_STATES.find(s => s.name === state || s.code === state)?.code;
    if (country === 'Canada') return CA_PROVINCES.find(s => s.name === state || s.code === state)?.code;
};
