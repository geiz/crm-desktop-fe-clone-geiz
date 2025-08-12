import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import AddressFields from 'components/CustomerForm/AddressFields';
import Button from 'components/ui/Button';
import { Checkbox } from 'components/ui/Input';

import { createAddress } from 'services/clientService';
import { CreateAddressFormValues, CreateAddressResponse } from 'types/client';
import { SearchClient } from 'types/client';
import { emptyCreateAddressFormValues } from 'utils/jobUtils';

import styles from './CreateAddressForm.module.css';

interface CreateAddressFormProps {
    client: SearchClient;
    closeCreateAddressForm: () => void;
    onAddressCreated: (data: CreateAddressResponse, client: SearchClient) => void;
}

const CreateAddressForm = ({ client, closeCreateAddressForm, onAddressCreated }: CreateAddressFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isBillingSameAddress, setIsBillingSameAddress] = useState(false);
    const methods = useForm<CreateAddressFormValues>({
        defaultValues: emptyCreateAddressFormValues,
        mode: 'onChange'
    });

    const onSubmit = (data: CreateAddressFormValues) => {
        setIsLoading(true);
        createAddress(data, client.id, isBillingSameAddress)
            .then(resp => {
                onAddressCreated(resp, client);
                toast.success('Address successfully added!');
            })
            .catch(err => toast.error(err.message))
            .finally(() => setIsLoading(false));
    };

    return (
        <FormProvider {...methods}>
            <form className={styles.form} onSubmit={methods.handleSubmit(onSubmit)}>
                <h3 className='h-16B'>Add Service Location for {client.name}</h3>

                <div className={styles.addressWrap}>
                    <AddressFields blockName='contact' />
                </div>

                <Checkbox
                    className={styles.checkboxBilling}
                    name='isBillingSameAddress'
                    label='Use this address as a billing'
                    checked={isBillingSameAddress}
                    onChange={e => setIsBillingSameAddress(e.target.checked)}
                />

                <div className={styles.formActions}>
                    <Button onClick={closeCreateAddressForm} type='button' btnStyle='text-btn-m'>
                        Cancel
                    </Button>
                    <Button btnStyle='blue-m' isLoading={isLoading} type='submit'>
                        Save
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default CreateAddressForm;
