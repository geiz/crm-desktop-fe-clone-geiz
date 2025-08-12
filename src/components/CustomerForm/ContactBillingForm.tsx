import AdditionalMethod from './AdditionalMethod';
import AddressFields from './AddressFields';
import { useMask } from '@react-input/mask';
import cn from 'classnames';
import { get } from 'lodash';

import { Controller, useFormContext } from 'react-hook-form';

import AddDivider from 'components/AddDivider/AddDivider';
import { Input, Radio } from 'components/ui/Input';

import { radioBtns } from './utils';
import { PHONE_MASK, REQUIRED_FIELD } from 'constants/common';
import { UseAdditionalMethodsReturn } from 'hooks/useAdditionalMethods';
import { BlockName } from 'types/client';
import { emailValidation, optionalPhoneRules } from 'utils/validationRules';

import styles from './ContactBillingForm.module.css';

interface ContactBillingFormProps {
    blockName: BlockName;
    isAddingNewCustomer?: boolean;
    additionalMethodsConfig?: UseAdditionalMethodsReturn;
}

const ContactBillingForm: React.FC<ContactBillingFormProps> = ({ blockName, isAddingNewCustomer, additionalMethodsConfig }) => {
    const phoneRef = useMask(PHONE_MASK);

    const {
        control,
        formState: { errors }
    } = useFormContext();

    const getErrorMessage = (path: string): string | undefined => get(errors, `${blockName}.${path}.message`) as unknown as string;

    return (
        <div className={styles.gridBlockForm}>
            <Controller
                name={`${blockName}.name`}
                control={control}
                rules={{ required: REQUIRED_FIELD }}
                render={({ field }) => (
                    <Input
                        {...field}
                        placeholder='Enter full name'
                        label='Full name'
                        errorMessage={getErrorMessage('name')}
                        className={styles.name}
                    />
                )}
            />

            {isAddingNewCustomer && (
                <div className={styles.category}>
                    <h4 className={cn(styles.radioLabel, 'body-12R')}>Category</h4>
                    <Controller
                        name='category'
                        control={control}
                        render={({ field }) => (
                            <div className={styles.radioWrap}>
                                {radioBtns.map(el => (
                                    <Radio
                                        key={el.value}
                                        id={`${el.value}-customerForm`}
                                        value={el.value}
                                        checked={field.value === el.value}
                                        onChange={field.onChange}
                                        label={el.label}
                                    />
                                ))}
                            </div>
                        )}
                    />
                </div>
            )}

            <Controller
                name={`${blockName}.phone`}
                control={control}
                rules={optionalPhoneRules}
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
                name={`${blockName}.email`}
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

            {additionalMethodsConfig && (
                <div
                    className={cn(styles.additionalMethodSection, {
                        [styles.topDivider]: additionalMethodsConfig.additionalContacts?.length
                    })}>
                    {additionalMethodsConfig.additionalContacts.map(el => (
                        <AdditionalMethod
                            key={el.id}
                            item={el}
                            onDelete={additionalMethodsConfig.handleDeleteContact}
                            onUpdate={additionalMethodsConfig.handleUpdateMethod}
                        />
                    ))}
                    <AddDivider addName='Add Contact Method' dropdownOptions={additionalMethodsConfig.dropdownOptions} />
                </div>
            )}

            <AddressFields blockName={blockName} />
        </div>
    );
};

export default ContactBillingForm;
