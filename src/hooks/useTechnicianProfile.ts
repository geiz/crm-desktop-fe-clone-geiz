import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { SETTINGS_ENDPOINTS } from 'constants/endpoints';
import { apiRequest } from 'services/apiUtils';
import { searchLocation } from 'services/geocoderService';
import { Method, SelectOption } from 'types/common';
import { Appliance, Area, Brand } from 'types/settingsTypes';

export const useTechnicianProfile = () => {
    const [brands, setBrands] = useState<SelectOption[]>([]);
    const [appliances, setAppliances] = useState<SelectOption[]>([]);
    const [areaSearchResults, setAreaSearchResults] = useState<Area[]>([]);
    const [isLoadingBrands, setIsLoadingBrands] = useState(false);
    const [isLoadingAppliances, setIsLoadingAppliances] = useState(false);
    const [isSearchingAreas, setIsSearchingAreas] = useState(false);

    const getBrands = useCallback(async (excludeIds: number[] = []) => {
        setIsLoadingBrands(true);
        try {
            const response = await apiRequest<Brand[]>({
                url: SETTINGS_ENDPOINTS.brands,
                method: Method.GET,
                params: {
                    ...(excludeIds.length > 0 ? { exclude: excludeIds.join(',') } : {}),
                    limit: 100
                }
            });
            setBrands(response.map(brand => ({ value: brand.id, label: brand.name })));
        } catch (error) {
            console.error('Error fetching brands:', error);
            toast.error('Failed to load brands');
        } finally {
            setIsLoadingBrands(false);
        }
    }, []);

    const getAppliances = useCallback(async () => {
        setIsLoadingAppliances(true);
        try {
            const response = await apiRequest<Appliance[]>({
                url: SETTINGS_ENDPOINTS.components,
                method: Method.GET,
                params: { limit: 100 }
            });
            setAppliances(response.map(appliance => ({ value: appliance.id, label: appliance.name })));
        } catch (error) {
            console.error('Error fetching appliances:', error);
            toast.error('Failed to load appliances');
        } finally {
            setIsLoadingAppliances(false);
        }
    }, []);

    const searchAreas = useCallback(async (query: string) => {
        if (!query.trim() || query.trim().length < 3) {
            setAreaSearchResults([]);
            return;
        }

        setIsSearchingAreas(true);
        try {
            const geocodeResult = await searchLocation(query);

            // Check for errors or invalid responses
            if (geocodeResult.error || !geocodeResult.latt || !geocodeResult.longt) {
                setAreaSearchResults([]);
                return;
            }

            // Validate that we have meaningful location data
            if (geocodeResult.latt === '0' && geocodeResult.longt === '0') {
                setAreaSearchResults([]);
                return;
            }

            // Convert geocoder result to Area format for display
            const area: Area = {
                id: 0, // Temporary ID for display
                name: geocodeResult.standard?.city || query.trim(),
                zipCode: geocodeResult.postal || '',
                country: 'Canada'
            };

            setAreaSearchResults([area]);
        } catch (error) {
            console.error('Error searching areas:', error);
            setAreaSearchResults([]);
        } finally {
            setIsSearchingAreas(false);
        }
    }, []);

    const selectArea = useCallback(async (geocodedArea: Area): Promise<Area> => {
        // When user selects an area, call POST /api/areas to get/create the area record
        return apiRequest<Area>({
            url: SETTINGS_ENDPOINTS.areas,
            method: Method.POST,
            data: {
                name: geocodedArea.name,
                zipCode: geocodedArea.zipCode,
                country: geocodedArea.country || 'Canada'
            }
        });
    }, []);

    const createBrand = useCallback(async (name: string): Promise<Brand> => {
        return apiRequest<Brand>({
            url: SETTINGS_ENDPOINTS.brands,
            method: Method.POST,
            data: { name }
        });
    }, []);

    const createAppliance = useCallback(async (name: string): Promise<Appliance> => {
        return apiRequest<Appliance>({
            url: SETTINGS_ENDPOINTS.components,
            method: Method.POST,
            data: { name }
        });
    }, []);

    return {
        brands,
        appliances,
        areaSearchResults,
        isLoadingBrands,
        isLoadingAppliances,
        isSearchingAreas,
        getBrands,
        getAppliances,
        searchAreas,
        selectArea,
        createBrand,
        createAppliance
    };
};
