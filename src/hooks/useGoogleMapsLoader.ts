import { useJsApiLoader } from '@react-google-maps/api';

const LIBRARIES: ['maps', 'places', 'marker'] = ['maps', 'places', 'marker'];

export const useGoogleMapsLoader = () => {
    return useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API,
        libraries: LIBRARIES
    });
};
