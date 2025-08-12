import { useDebouncedCallback } from './useDebouncedCallback';
import { useGoogleMapsLoader } from './useGoogleMapsLoader';

import { useEffect, useRef, useState } from 'react';

import { SelectOption } from 'types/common';

export type UseAutocompleteSuggestionsReturn = {
    suggestions: SelectOption[];
    isLoading: boolean;
    resetSession: () => void;
};

export function useAutocompleteSuggestions(
    inputString: string,
    requestOptions: Partial<google.maps.places.AutocompleteRequest> = {}
): UseAutocompleteSuggestionsReturn {
    const { isLoaded } = useGoogleMapsLoader();

    // stores the current sessionToken
    const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken>(null);

    const [suggestions, setSuggestions] = useState<SelectOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchSuggestions = useDebouncedCallback(async () => {
        setIsLoading(true);

        const placesLib = (await google.maps.importLibrary('places')) as google.maps.PlacesLibrary;
        const { AutocompleteSuggestion, AutocompleteSessionToken } = placesLib;

        if (!sessionTokenRef.current) {
            sessionTokenRef.current = new AutocompleteSessionToken();
        }

        const request: google.maps.places.AutocompleteRequest = {
            ...requestOptions,
            input: inputString,
            sessionToken: sessionTokenRef.current
        };

        const res = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

        const options = res.suggestions
            .map(o => {
                if (o.placePrediction) {
                    return {
                        label: o.placePrediction.text.text,
                        value: o.placePrediction.placeId
                    };
                }
            })
            .filter(Boolean);

        setSuggestions(options as SelectOption[]);

        setIsLoading(false);
    }, 500);

    useEffect(() => {
        if (!isLoaded || !inputString) return;

        fetchSuggestions();
    }, [inputString, isLoaded]);

    return {
        suggestions,
        isLoading,
        resetSession: () => {
            sessionTokenRef.current = null;
            setSuggestions([]);
        }
    };
}
