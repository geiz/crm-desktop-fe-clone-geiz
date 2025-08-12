import SettingsFormBtns from '../SettingsFormBtns/SettingsFormBtns';

import { Controller, useForm } from 'react-hook-form';

import CreatableSelect from 'components/ui/Input/CreatableSelect';
import Textarea from 'components/ui/Input/Textarea';

import { LENGTH_M, REQUIRED_FIELD } from 'constants/common';
import useSelectOptions from 'hooks/useSelectOptions';
import { JobTypesFormValues } from 'types/settingsTypes';

import styles from './JobTypeForm.module.css';

interface JobTypeFormProps {
    onSubmit: (data: JobTypesFormValues) => void;
    defaultValues: JobTypesFormValues;
}

const JobTypeForm = ({ onSubmit, defaultValues }: JobTypeFormProps) => {
    const { serviceTypes, getServiceTypes, createServiceType, componentTypes, getComponentTypes, createComponentType } = useSelectOptions();

    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<JobTypesFormValues>({ defaultValues, mode: 'onChange' });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.selectWrap}>
                <Controller
                    name='serviceType'
                    control={control}
                    rules={{ required: REQUIRED_FIELD }}
                    render={({ field }) => (
                        <CreatableSelect
                            {...field}
                            label='Service type'
                            placeholder='Enter service type'
                            options={serviceTypes.options}
                            onFocus={getServiceTypes}
                            onCreateOption={value => {
                                createServiceType(value).then(newOption => {
                                    field.onChange(newOption);
                                });
                            }}
                            errorMessage={errors.serviceType?.message}
                            isLoading={serviceTypes.isLoading}
                            tooltipText='Specifies the type of service provided (e.g., Diagnosis, Repair, Installation)'
                            className={styles.select}
                        />
                    )}
                />

                <Controller
                    name='componentType'
                    control={control}
                    render={({ field }) => (
                        <CreatableSelect
                            {...field}
                            label='Component type (Optional)'
                            placeholder='Enter component type'
                            options={componentTypes.options}
                            onFocus={getComponentTypes}
                            onCreateOption={value => {
                                createComponentType(value).then(newOption => {
                                    field.onChange(newOption);
                                });
                            }}
                            errorMessage={errors.componentType?.message}
                            isLoading={componentTypes.isLoading}
                            tooltipText='Indicates the appliance type (e.g., Refrigerator, Washer)'
                            className={styles.select}
                        />
                    )}
                />
            </div>

            <Controller
                name='summary'
                control={control}
                rules={{ required: REQUIRED_FIELD, minLength: { value: 30, message: 'Minimum 30 characters' } }}
                render={({ field: { value, onChange } }) => (
                    <Textarea
                        label='Summary'
                        placeholder='Enter summary'
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        errorMessage={errors.summary?.message}
                        className={styles.summary}
                        autoResize
                        maxLength={LENGTH_M}
                    />
                )}
            />

            <SettingsFormBtns />
        </form>
    );
};

export default JobTypeForm;
