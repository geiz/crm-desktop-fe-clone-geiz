import { useGoogleMapsLoader } from './useGoogleMapsLoader';

import { useEffect, useRef, useState } from 'react';

export const useGooglePlacesLib = () => {
    const { isLoaded: isGoogleLoaded } = useGoogleMapsLoader();
    const placesRef = useRef<google.maps.PlacesLibrary | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadLibrary = async () => {
            if (!placesRef.current) {
                try {
                    const lib = (await google.maps.importLibrary('places')) as google.maps.PlacesLibrary;
                    placesRef.current = lib;
                    setIsLoaded(true);
                } catch (err) {
                    console.error('Failed to load Google Places library', err);
                }
            }
        };

        loadLibrary();
    }, [isGoogleLoaded]);

    return {
        Place: placesRef.current?.Place,
        isLoaded
    };
};
