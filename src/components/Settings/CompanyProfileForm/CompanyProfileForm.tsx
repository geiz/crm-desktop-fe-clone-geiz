import { useMask } from '@react-input/mask';
import { get } from 'lodash';
import Loader from 'rsuite/esm/Loader';

import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import AddressFields from 'components/CustomerForm/AddressFields';
import Button from 'components/ui/Button';
import { Input, Select } from 'components/ui/Input';

import { getCompanyValues } from '../utilsProfile';
import { TIMEZONES } from 'constants/address';
import { PHONE_MASK, REQUIRED_FIELD } from 'constants/common';
import { Company, SelectOption } from 'types/common';
import { CompanyFormValues } from 'types/settingsTypes';
import { emailValidation, phoneValidation } from 'utils/validationRules';

import styles from './CompanyProfileForm.module.css';

interface CompanyProfileFormProps {
    onSubmit: (data: CompanyFormValues) => Promise<void>;
    initCompanyData: Company;
}

const CompanyProfileForm = ({ onSubmit, initCompanyData }: CompanyProfileFormProps) => {
    const phoneRef = useMask(PHONE_MASK);
    const [isLoading, setIsLoading] = useState(false);
    const [formKey, setFormKey] = useState(0);

    const {
        control,
        reset,
        handleSubmit,
        formState: { errors, isDirty }
    } = useFormContext<CompanyFormValues>();

    const getErrorMessage = (path: string): string | undefined => get(errors, `company.${path}.message`) as unknown as string;

    const handleCancel = () => {
        reset({ company: getCompanyValues(initCompanyData) });
        setFormKey(k => k + 1); // remount AddressFields with validation -> in case reset address clicked
    };

    const handleFormSubmit = (data: CompanyFormValues) => {
        setIsLoading(true);
        onSubmit(data).finally(() => setIsLoading(false));
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
            <Controller
                name={`company.name`}
                control={control}
                rules={{ required: REQUIRED_FIELD }}
                render={({ field }) => (
                    <Input
                        {...field}
                        placeholder={'Enter company name'}
                        label={'Company name'}
                        errorMessage={getErrorMessage('name')}
                        className={styles.name}
                    />
                )}
            />

            <Controller
                name={`company.phone`}
                control={control}
                rules={phoneValidation}
                render={({ field }) => (
                    <Input
                        {...field}
                        ref={phoneRef}
                        value={field.value || ''}
                        placeholder='Enter phone number'
                        label='Phone number'
                        errorMessage={getErrorMessage('phone')}
                        className={styles.phone}
                    />
                )}
            />

            <Controller
                name={`company.email`}
                control={control}
                rules={emailValidation}
                render={({ field }) => (
                    <Input
                        {...field}
                        placeholder='Enter email'
                        label='Email address'
                        errorMessage={getErrorMessage('email')}
                        className={styles.email}
                    />
                )}
            />

            <Controller
                name={`company.timezone`}
                control={control}
                render={({ field: { onChange, value } }) => (
                    <Select
                        className={styles.timezone}
                        label='Time zone'
                        placeholder='Select time zone'
                        options={TIMEZONES}
                        onChange={(option: unknown) => {
                            onChange((option as SelectOption).value);
                        }}
                        value={TIMEZONES.find(opt => opt.value === value) || null}
                        errorMessage={getErrorMessage('autocomplete')}
                    />
                )}
            />

            <AddressFields blockName='company' formKey={formKey} />

            <div className={styles.formActions}>
                <Button type='button' btnStyle='text-btn-m' onClick={handleCancel}>
                    Cancel
                </Button>
                <Button disabled={!isDirty} btnStyle='blue-m' type='submit'>
                    {isLoading && <Loader size='xs' center />}
                    Save
                </Button>
            </div>
        </form>
    );
};

export default CompanyProfileForm;
