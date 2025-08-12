import { EnterAddress, MenuOption } from './CustomerFormComponents';
import WarningMessage from './WarningMessage';
import { AddressSelectOption, GoogleAddressComponent } from './types';
import cn from 'classnames';
import { debounce, get } from 'lodash';

import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { MenuListProps, components } from 'react-select';
import { toast } from 'react-toastify';

import Button from 'components/ui/Button';
import { Input, Select } from 'components/ui/Input';

import { emptyAddress, getForrmatedAddressObject, requiredComponentTypes } from './utils';
import { ADDRESS_AUTOCOMPLETE_ERROR, ADDRESS_NOT_FOUND, REQUIRED_FIELD, UNKNOWN_ERROR } from 'constants/common';
import useAddressValidation from 'hooks/useAddressValidation';
import { useAutocompleteSuggestions } from 'hooks/useAutocompleteSuggestions';
import { useGooglePlacesLib } from 'hooks/useGooglePlacesLib';
import { BlockName } from 'types/client';
import { formatAddress, formatAddressFromUserInput } from 'utils/formatAddress';

import styles from './AddressFields.module.css';

interface AddressFieldsProps {
    blockName: BlockName;
    formKey?: number; // handle cancel btn in company profile (trigger address validation)
}

const AddressFields = ({ blockName, formKey }: AddressFieldsProps) => {
    const { Place } = useGooglePlacesLib();
    const { validateAddressInput } = useAddressValidation();

    const [inputValue, setInputValue] = useState('');
    const { suggestions, isLoading, resetSession } = useAutocompleteSuggestions(inputValue, {
        includedPrimaryTypes: requiredComponentTypes // google allow max 5
    });

    const [addressDetails, setAddressDetails] = useState({ isVisible: false, isWarning: false });

    const isCompanyBlock = blockName === 'company';

    const {
        control,
        setValue,
        getValues,
        register,
        formState: { errors },
        clearErrors
    } = useFormContext();

    useEffect(() => {
        const validateAddress = async (addressInput: string) => {
            const { isValidAddress } = await validateAddressInput(addressInput);
            setAddressDetails({ isVisible: addressInput !== '', isWarning: !isValidAddress });
        };

        const formValues = getValues(blockName);
        const addressInput = formatAddress(formValues.address);
        validateAddress(addressInput);
    }, [blockName, formKey]);

    const handleAddressInputsChange = debounce(async () => {
        const addressValues = getValues(`${blockName}.address`);
        const addressInput = formatAddressFromUserInput(addressValues);
        const { result, isValidAddress } = await validateAddressInput(addressInput);

        setAddressDetails(prev => ({ ...prev, isWarning: !isValidAddress }));

        const match = result?.address.formattedAddress.match(/#([^,]+)/); // google possible streetNumber starts with '#' ends with ','
        const streetNumber = match ? match[1].trim() : '';

        const getComponentByType = (type: string) =>
            result?.address.addressComponents.find((c: GoogleAddressComponent) => c.componentType === type)?.componentName.text || '';

        setValue(`${blockName}.address.streetName`, getComponentByType('route'), { shouldValidate: true });
        setValue(`${blockName}.address.streetNumber`, getComponentByType('street_number') || streetNumber, { shouldValidate: true });

        if (blockName === 'contact') {
            const lat = result?.geocode.location.latitude;
            const lng = result?.geocode.location.longitude;
            setValue('contact.address.geoLocation', `${lat},${lng}`);
        }
    }, 300);

    const handleSelectChange = async (option: AddressSelectOption) => {
        setInputValue(option.label);
        setAddressDetails(prev => ({ ...prev, isVisible: true })); // hide select first

        try {
            // validate select option
            const { isValidAddress, result } = await validateAddressInput(option.label);

            if (result) {
                const getComponentByType = (type: string) =>
                    result?.address.addressComponents.find((c: GoogleAddressComponent) => c.componentType === type)?.componentName.text ||
                    '';
                const formattedAddress = getForrmatedAddressObject(getComponentByType);

                setValue(`${blockName}.address`, formattedAddress, { shouldValidate: true });

                if (blockName === 'contact') {
                    const lat = result?.geocode.location.latitude;
                    const lng = result?.geocode.location.longitude;
                    setValue('contact.address.geoLocation', `${lat},${lng}`);
                }
            } else {
                // result === null => validation failed, but we still have select option
                if (Place) {
                    const place = new Place({
                        id: option.value,
                        requestedLanguage: 'en' // optional
                    });
                    // fetch desired data fields
                    await place.fetchFields({
                        fields: ['addressComponents', 'location']
                    });
                    if (place.addressComponents) {
                        const getComponent = (type: string) => place.addressComponents?.find(c => c.types.includes(type))?.longText || '';
                        const formattedAddress = getForrmatedAddressObject(getComponent);

                        setValue(`${blockName}.address`, formattedAddress);

                        if (place.location && blockName === 'contact') {
                            const lat = place.location?.lat();
                            const lng = place.location?.lng();
                            setValue('contact.address.geoLocation', `${lat},${lng}`);
                        }
                    }
                }
            }

            setAddressDetails({ isVisible: true, isWarning: !isValidAddress });
        } catch {
            toast.error(UNKNOWN_ERROR);
        }
    };

    const handleReset = () => {
        setAddressDetails({ isVisible: false, isWarning: false });
        setValue(`${blockName}.address`, emptyAddress);
        setValue(`${blockName}.autocomplete`, '');
        clearErrors([`${blockName}.autocomplete`, `${blockName}.address`]);
        setInputValue('');
        resetSession();
    };

    const handleEnterAddress = () => setAddressDetails({ isVisible: true, isWarning: false });
    const getErrorMessage = (path: string): string | undefined => get(errors, `${blockName}.${path}.message`) as unknown as string;

    const customSelectComponents = {
        DropdownIndicator: null,
        MenuList: (props: MenuListProps) => (
            <components.MenuList {...props}>
                {props.children}
                <EnterAddress onClick={handleEnterAddress} />
            </components.MenuList>
        ),
        Option: MenuOption
    };

    if (!addressDetails.isVisible)
        return (
            <Controller
                name={`${blockName}.autocomplete`}
                control={control}
                rules={{
                    required: ADDRESS_AUTOCOMPLETE_ERROR,
                    validate: async () => {
                        const address = getValues(`${blockName}.address`);
                        if (
                            !address.streetName ||
                            !address.streetNumber ||
                            !address.streetAddress ||
                            !address.state ||
                            !address.city ||
                            !address.zipCode
                        ) {
                            return ADDRESS_NOT_FOUND;
                        }
                        return true;
                    }
                }}
                render={({ field: { value, onChange } }) => (
                    <Select
                        className={styles.selectAddress}
                        label='Address'
                        placeholder='Enter an address'
                        options={suggestions}
                        value={value}
                        onChange={value => {
                            onChange(value);
                            handleSelectChange(value as AddressSelectOption);
                        }}
                        isLoading={isLoading}
                        inputValue={inputValue}
                        onInputChange={value => {
                            setInputValue(value);
                            setValue(`${blockName}.autocomplete`, '');
                        }}
                        isSearchable={true}
                        noOptionsMessage={() => 'No results found'}
                        filterOption={null}
                        components={customSelectComponents}
                        helperText='Example: 123 Main Street, Toronto, ON L5R 3K6, Canada'
                        errorMessage={getErrorMessage('autocomplete')}
                    />
                )}
            />
        );

    return (
        <>
            <WarningMessage
                className={cn(styles.warning, { [styles.mb]: addressDetails.isWarning })}
                text='We couldn’t validate this service location.'
                show={addressDetails?.isWarning}
            />

            <input type='hidden' {...register(`${blockName}.address.streetName`, { required: 'Missing street name' })} />
            <input type='hidden' {...register(`${blockName}.address.streetNumber`, { required: 'Missing street number' })} />

            <Controller
                name={`${blockName}.address.streetAddress`}
                control={control}
                render={({ field: { value, onChange } }) => (
                    <Input
                        value={value}
                        label='Street number and street name'
                        onChange={e => {
                            onChange(e.target.value);
                            handleAddressInputsChange();
                        }}
                        className={styles.streetAddress}
                        errorMessage={getErrorMessage('address.streetName') || getErrorMessage('address.streetNumber')}
                    />
                )}
            />
            <Controller
                name={`${blockName}.address.city`}
                control={control}
                rules={{ required: REQUIRED_FIELD }}
                render={({ field: { value, onChange } }) => (
                    <Input
                        value={value as string}
                        label='City'
                        onChange={e => {
                            onChange(e.target.value);
                            handleAddressInputsChange();
                        }}
                        className={styles.city}
                        errorMessage={getErrorMessage('address.city')}
                    />
                )}
            />
            <Controller
                name={`${blockName}.address.state`}
                control={control}
                rules={{ required: REQUIRED_FIELD }}
                render={({ field: { value, onChange } }) => (
                    <Input
                        value={value as string}
                        label='Province'
                        onChange={e => {
                            onChange(e.target.value);
                            handleAddressInputsChange();
                        }}
                        className={styles.state}
                        errorMessage={getErrorMessage('address.state')}
                    />
                )}
            />
            <Controller
                name={`${blockName}.address.country`}
                control={control}
                rules={{ required: REQUIRED_FIELD }}
                render={({ field: { value, onChange } }) => (
                    <Input
                        value={value as string}
                        label='Country'
                        onChange={e => {
                            onChange(e.target.value);
                            handleAddressInputsChange();
                        }}
                        className={styles.country}
                        errorMessage={getErrorMessage('address.country')}
                    />
                )}
            />
            <Controller
                name={`${blockName}.address.zipCode`}
                control={control}
                rules={{ required: REQUIRED_FIELD }}
                render={({ field: { value, onChange } }) => (
                    <Input
                        value={value as string}
                        label='Postal Code'
                        onChange={e => {
                            onChange(e.target.value);
                            handleAddressInputsChange();
                        }}
                        className={styles.zipCode}
                        errorMessage={getErrorMessage('address.zipCode')}
                    />
                )}
            />
            <Controller
                name={`${blockName}.address.apartment`}
                control={control}
                render={({ field }) => (
                    <Input
                        {...field}
                        label={isCompanyBlock ? 'Office (Optional)' : 'Apartment (Optional)'}
                        placeholder={isCompanyBlock ? 'Enter office' : 'Enter apartment'}
                        className={styles.apartment}
                    />
                )}
            />
            {!isCompanyBlock && (
                <Controller
                    name={`${blockName}.address.buzzer`}
                    control={control}
                    render={({ field }) => (
                        <Input {...field} label='Buzzer (optional)' placeholder='Enter buzzer' className={styles.buzzer} />
                    )}
                />
            )}
            <Button
                icon='refresh'
                className={cn(styles.resetBtn, { [styles.end]: !isCompanyBlock })}
                btnStyle='grey-l'
                type='button'
                onClick={handleReset}>
                Reset Address
            </Button>
        </>
    );
};

export default AddressFields;
