import { debounce } from 'lodash';

import React, { useCallback, useState } from 'react';

import { Select } from 'components/ui/Input';

import { useTechnicianProfile } from 'hooks/useTechnicianProfile';
import { SelectOption } from 'types/common';
import { Area } from 'types/settingsTypes';

import styles from './AreaSearch.module.css';

interface AreaSearchProps {
    label: string;
    placeholder?: string;
    onSelect: (area: Area | null) => void;
    selectedAreas?: Area[];
    disabled?: boolean;
    errorMessage?: string;
    value?: Area | null;
}

const AreaSearch: React.FC<AreaSearchProps> = ({
    label,
    placeholder = 'Search for a location...',
    onSelect,
    selectedAreas = [],
    disabled = false,
    errorMessage,
    value
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const { areaSearchResults, isSearchingAreas, searchAreas, selectArea } = useTechnicianProfile();

    const debouncedSearch = useCallback(
        debounce((query: string) => {
            if (query.length > 2) {
                searchAreas(query);
            }
        }, 300),
        [searchAreas]
    );

    const handleInputChange = (inputValue: string) => {
        setSearchTerm(inputValue);
        debouncedSearch(inputValue);
    };

    const handleSelectArea = async (selectedOption: unknown) => {
        const option = selectedOption as SelectOption | null;

        if (!option) {
            onSelect(null);
            return;
        }

        // Find the full area object from search results
        const geocodedArea = areaSearchResults.find(area => area.id === option.value);
        if (!geocodedArea) return;

        try {
            // Call selectArea to get/create the area record in backend
            const area = await selectArea(geocodedArea);
            onSelect(area);
        } catch (error) {
            console.error('Error selecting area:', error);
        }
    };

    // Convert areas to select options, filtering out already selected ones
    const options: SelectOption[] = areaSearchResults
        .filter(area => !selectedAreas.some(selected => selected.id === area.id))
        .map(area => ({
            value: area.id,
            label: `${area.name} (${area.zipCode})`
        }));

    // Convert current value to select option
    const selectValue = value ? { value: value.id, label: `${value.name} (${value.zipCode})` } : null;

    return (
        <div className={styles.container}>
            <Select
                label={label}
                placeholder={placeholder}
                options={options}
                value={selectValue}
                onChange={handleSelectArea}
                onInputChange={handleInputChange}
                isSearchable
                isClearable
                isDisabled={disabled}
                errorMessage={errorMessage}
                noOptionsMessage={() => (searchTerm.length <= 2 ? 'Please enter the full city name' : 'No locations found')}
                loadingMessage={() => 'Searching...'}
                isLoading={isSearchingAreas}
                getOptionValue={(option: unknown) => `${(option as SelectOption)?.value}`}
                getOptionLabel={(option: unknown) => (option as SelectOption)?.label || ''}
            />
        </div>
    );
};

export default AreaSearch;
