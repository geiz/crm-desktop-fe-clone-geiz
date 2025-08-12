import axios from 'axios';

import { GeocodeResponse } from 'types/settingsTypes';

const GEOCODER_BASE_URL = 'https://geocoder.ca';

export interface GeocodeParams {
    locate: string;
    country?: 'canada' | 'usa';
}

export const geocodeAddress = async (params: GeocodeParams): Promise<GeocodeResponse> => {
    try {
        const response = await axios.get(GEOCODER_BASE_URL, {
            params: {
                ...params,
                geoit: 'XML', // Must use XML even for JSON response
                json: 1 // Converts XML response to JSON
            }
        });

        // Check if response is HTML (error page)
        if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
            throw new Error('Invalid location or geocoding service error');
        }

        return response.data;
    } catch (error) {
        console.error('Geocoder API error:', error);
        throw new Error('Failed to geocode address');
    }
};

export const searchLocation = async (query: string): Promise<GeocodeResponse> => {
    return geocodeAddress({
        locate: query,
        country: 'canada' // Default to Canada based on the requirements
    });
};
