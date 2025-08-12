import { Control, Controller, FieldErrors } from 'react-hook-form';

import { Input, Select, Textarea } from 'components/ui/Input';

import { INVALID_INPUT, LENGTH_M, REQUIRED_FIELD } from 'constants/common';
import useSelectOptions from 'hooks/useSelectOptions';
import { MaterialPriceFormValues } from 'types/settingsTypes';
import controllNumericInput from 'utils/controllNumericInput';
import { priceRules } from 'utils/validationRules';

import styles from './MaterislPriceInputs.module.css';

interface MaterialPriceInputsProps {
    control: Control<MaterialPriceFormValues>;
    errors: FieldErrors<MaterialPriceFormValues>;
    nameLabel: string;
}

const MaterialPriceInputs = ({ nameLabel, control, errors }: MaterialPriceInputsProps) => {
    const { getBusinessUnits, businessUnits } = useSelectOptions();

    return (
        <>
            <Controller
                name='businessUnit'
                control={control}
                rules={{ required: REQUIRED_FIELD }}
                render={({ field }) => (
                    <Select
                        {...field}
                        label='Business Unit'
                        placeholder='Select Business Unit'
                        options={businessUnits.options}
                        errorMessage={errors.businessUnit?.message}
                        onFocus={getBusinessUnits}
                        isLoading={businessUnits.isLoading}
                    />
                )}
            />

            <div className={styles.formLineWrapper}>
                <Controller
                    name='name'
                    control={control}
                    rules={{ required: REQUIRED_FIELD, minLength: { value: 3, message: INVALID_INPUT } }}
                    render={({ field }) => (
                        <Input {...field} label={nameLabel} placeholder='Enter service' errorMessage={errors.name?.message} />
                    )}
                />
                <Controller
                    name='price'
                    control={control}
                    rules={priceRules()}
                    render={({ field: { value, onChange } }) => (
                        <Input
                            label='Price'
                            placeholder='Enter Price ($)'
                            value={value ? `$${value}` : ''} // Add `$` but don't store it in form state
                            onChange={e => onChange(controllNumericInput(e.target.value))}
                            errorMessage={errors.price?.message}
                        />
                    )}
                />
            </div>

            <Controller
                name='description'
                control={control}
                rules={{
                    required: REQUIRED_FIELD,
                    validate: value => (value.trim() === '' ? INVALID_INPUT : true)
                }}
                render={({ field }) => (
                    <Textarea
                        {...field}
                        label='Summary'
                        placeholder='Enter description'
                        rows={5}
                        maxLength={LENGTH_M}
                        errorMessage={errors.description?.message}
                    />
                )}
            />
        </>
    );
};

export default MaterialPriceInputs;
