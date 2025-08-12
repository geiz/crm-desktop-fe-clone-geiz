import ContactBillingForm from './ContactBillingForm';
import cn from 'classnames';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import Button from 'components/ui/Button';
import Checkbox from 'components/ui/Input/Checkbox';

import { ClientFormValues } from 'types/client';

import styles from './CustomerForm.module.css';

import 'overlayscrollbars/overlayscrollbars.css';

import { AdditionalContact } from './types';

import { toast } from 'react-toastify';

import useAdditionalMethods from 'hooks/useAdditionalMethods';
import { capitalizeFirst } from 'utils/capitalizeFirst';

interface CustomerFormProps {
    cancelCustomerForm: () => void;
    submitCustomerForm: (data: ClientFormValues, additionalContacts: AdditionalContact[], isBillingSameContact: boolean) => Promise<void>;
    action: 'add' | 'edit';
    isBillingSameContact: boolean;
    initAdditionalContacts: AdditionalContact[];
}

const CustomerForm: React.FC<CustomerFormProps> = ({
    cancelCustomerForm,
    initAdditionalContacts,
    action,
    submitCustomerForm,
    isBillingSameContact
}) => {
    const [isBillingSameAddress, setIsBillingSameAddress] = useState(isBillingSameContact);
    const [isLoading, setIsLoading] = useState(false);
    const additionalMethodsConfig = useAdditionalMethods({ initAdditionalContacts });
    const { additionalContacts, hasInvalidContact } = additionalMethodsConfig;

    const { handleSubmit } = useFormContext<ClientFormValues>();

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsBillingSameAddress(event.target.checked);
    };

    const onSubmit = (data: ClientFormValues) => {
        if (hasInvalidContact) {
            toast.error('Please fix additional contact method.');
            return;
        }

        setIsLoading(true);
        submitCustomerForm(data, additionalContacts, isBillingSameAddress).finally(() => {
            setIsLoading(false);
        });
    };

    return (
        <div className={styles.container}>
            <OverlayScrollbarsComponent className='overlayscrollbars-react' options={{ scrollbars: { theme: 'os-theme-dark' } }}>
                <form className={styles.form} onSubmit={handleSubmit(onSubmit)} id='customerForm'>
                    <h3 className={cn(styles.formTitle, 'h-16B')}>{capitalizeFirst(action)} Contact Info</h3>

                    <ContactBillingForm
                        blockName='contact'
                        additionalMethodsConfig={additionalMethodsConfig}
                        isAddingNewCustomer={action === 'add'}
                    />

                    <Checkbox
                        className={styles.checkbox}
                        id='billing'
                        checked={isBillingSameAddress}
                        onChange={handleCheckboxChange}
                        label='Use this address as a billing'
                    />

                    {!isBillingSameAddress && (
                        <>
                            <h3 className={cn(styles.fullWidth, 'h-16B', styles.my2)}>{capitalizeFirst(action)} Billing Info</h3>
                            <ContactBillingForm blockName='billing' />
                        </>
                    )}
                </form>
            </OverlayScrollbarsComponent>
            <div className={styles.formActions}>
                <Button onClick={cancelCustomerForm} type='button' btnStyle='text-btn-m'>
                    Cancel
                </Button>
                <Button btnStyle='blue-m' form='customerForm' isLoading={isLoading} type='submit'>
                    Save
                </Button>
            </div>
        </div>
    );
};

export default CustomerForm;
