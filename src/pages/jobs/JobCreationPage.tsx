import cn from 'classnames';
import { debounce } from 'lodash';
import { Drawer, Loader } from 'rsuite';

import { useCallback, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { MenuListProps, OptionProps, components } from 'react-select';
import { toast } from 'react-toastify';

import ContactInfoCard from 'components/ContactInfoCard/ContactInfoCard';
import CreateAddressForm from 'components/CreateAddressForm/CreateAddressForm';
import CustomerForm from 'components/CustomerForm/CustomerForm';
import { AdditionalContact } from 'components/CustomerForm/types';
import { emptyClientValues, isSameSections } from 'components/CustomerForm/utils';
import Button from 'components/ui/Button';
import { Select } from 'components/ui/Input';

import { REQUIRED_FIELD } from 'constants/common';
import useDrawer from 'hooks/useDrawer';
import { ClientFormValues, CreateAddressResponse, CreateClientResponse, SearchClient, SearchSelectOption } from 'types/client';
import { JobValues } from 'types/jobTypes';
import { formatAddressWithAppartment } from 'utils/formatAddress';
import highlightMatch from 'utils/highlightMatch';
import { formatSearchClientsResultsToOptions } from 'utils/jobUtils';
import phoneToMaskString from 'utils/phoneToMaskString';

import styles from './JobCreationPage.module.css';

import 'rsuite/dist/rsuite-no-reset.min.css';

import Modal from 'components/Modals/Modal';
import JobCreationForm from 'components/jobs/JobCreationForm/JobCreationForm';
import { emptyJobValues } from 'components/jobs/JobCreationForm/utils';

import useModal from 'hooks/useModal';
import { createClient, getClientByAddress, getSearchClients, updateContactOnJobCreationPage } from 'services/clientService';
import getDirtyValues from 'utils/getDirtyValues';

const JobCreationPage = () => {
    const navigate = useNavigate();
    const { isOpen: isOpenCreateAddressForm, openModal: openCreateAddressForm, closeModal: closeCreateAddressForm } = useModal();
    const { toggleDrawer, isDrawerOpen } = useDrawer();

    const [searchResults, setSearchResults] = useState<SearchSelectOption[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [isRequestPending, setIsRequestPending] = useState(false);
    const [selectedClientForAddress, setSelectedClientForAddress] = useState<SearchClient | null>(null);
    const [custumerFormAction, setCustomerFormAction] = useState<'add' | 'edit'>('add');
    const [isBillingSameContact, setIsBillingSameContact] = useState(true);
    const [initAdditionalContacts, setInitAdditionalContacts] = useState<AdditionalContact[]>([]);

    const methods = useForm<ClientFormValues>({ defaultValues: emptyClientValues, mode: 'onChange' });
    const {
        reset: clientReset,
        formState: { dirtyFields }
    } = methods;

    const jobCreationMethods = useForm<JobValues>({ defaultValues: emptyJobValues, mode: 'onChange' });
    const { control, setValue, watch } = jobCreationMethods;

    const openAddCustomerForm = () => {
        setCustomerFormAction('add');
        clientReset(emptyClientValues);
        setIsBillingSameContact(true);
        setInitAdditionalContacts([]);
        toggleDrawer();
    };

    const handleCreateCustomerSubmit = (data: ClientFormValues, additionalContacts: AdditionalContact[], isBillingSameContact: boolean) => {
        return createClient(data, additionalContacts, isBillingSameContact)
            .then(resp => {
                toast.success('Customer created!');
                handleNewClientCreated(resp);
                toggleDrawer();
            })
            .catch(err => {
                toast.error(err.message);
            });
    };

    const handleEditCustomerSubmit = (data: ClientFormValues, additionalContacts: AdditionalContact[], isBillingSameContact: boolean) => {
        const partial = getDirtyValues(dirtyFields, data);

        return updateContactOnJobCreationPage({
            partial,
            data,
            additionalContacts,
            initAdditionalContacts,
            clientId: selectedClientForAddress?.id || 0,
            addressId: selectedClientForAddress?.selectedAddressId || 0,
            isBillingSameContact
        }).then(res => {
            toggleDrawer();

            //  update ui
            setValue('selectedClient', {
                value: `address-${res.contact.address.id}`,
                label: formatAddressWithAppartment(res.contact.address),
                type: 'address',
                client: {
                    id: selectedClientForAddress?.id || 0,
                    name: res.contact.name,
                    phone: res.contact.phone || '',
                    email: res.contact.email || '',
                    selectedAddressId: res.contact.address.id
                },
                address: res.contact.address
            });
        });
    };

    const handleNewClientCreated = useCallback(
        (newClientData: CreateClientResponse) => {
            const primaryPhone = newClientData.contacts.find(contact => contact.type === 'PHONE' && contact.value);
            const primaryEmail = newClientData.contacts.find(contact => contact.type === 'EMAIL' && contact.value);
            const primaryAddress = newClientData.addresses[0];

            const formattedClient = {
                id: newClientData.id,
                name: newClientData.name,
                phone: primaryPhone?.value || '',
                email: primaryEmail?.value || '',
                selectedAddressId: primaryAddress.id
            };

            setSelectedClientForAddress(formattedClient);

            setValue('selectedClient', {
                value: `address-${primaryAddress.id}`,
                label: formatAddressWithAppartment(primaryAddress),
                type: 'address',
                client: formattedClient,
                address: primaryAddress
            });
        },
        [setValue]
    );

    const handleNewAddressCreated = useCallback(
        (newAddressData: CreateAddressResponse, client: SearchClient) => {
            setValue('selectedClient', {
                value: `address-${newAddressData.address.id}`,
                label: 'address',
                type: 'address',
                client,
                address: newAddressData.address
            });

            const formattedClient = {
                id: client.id,
                name: client.name,
                phone: client.phone,
                email: client.email,
                selectedAddressId: newAddressData.address.id
            };

            setSelectedClientForAddress(formattedClient);
            closeCreateAddressForm();
        },
        [setValue, closeCreateAddressForm]
    );

    const doSearch = useCallback(async (term: string) => {
        if (term.length >= 3) {
            setIsSearching(true);

            getSearchClients(term)
                .then(resp => {
                    const formattedResults = formatSearchClientsResultsToOptions(resp);
                    setSearchResults(formattedResults);
                })
                .catch(err => toast.error(err))
                .finally(() => setIsSearching(false));
        }
    }, []);

    const debouncedSearch = useMemo(() => debounce(doSearch, 300), [doSearch]);

    const handleSearchChange = (inputValue: string) => {
        setValue('searchTerm', inputValue);

        if (inputValue.length === 0) setSearchResults([]);
        else if (inputValue.length >= 3) debouncedSearch(inputValue);
    };

    // TODO: move
    const customSelectComponents = {
        DropdownIndicator: null,
        MenuList: (props: MenuListProps) => (
            <components.MenuList {...props}>
                {props.children}
                <div
                    className={cn(styles.menuAddCustomer, 'body-14M')}
                    onMouseDown={e => {
                        e.preventDefault();
                        toggleDrawer();
                    }}>
                    Add New Customer
                </div>
            </components.MenuList>
        ),
        Option: (props: OptionProps<SearchSelectOption>) => {
            const { data, innerRef, innerProps, isFocused, isSelected, selectProps } = props;
            const searchTerm = selectProps.inputValue || '';
            if (data.type === 'client') {
                return (
                    <div
                        ref={innerRef}
                        {...innerProps}
                        className={cn(styles.menuOption, styles.clientOption, 'body-16M', { [styles.grey100bg]: isFocused || isSelected })}>
                        <i className={cn('icon-customer', styles.customerIcon)} />
                        {highlightMatch(data.label, searchTerm)}
                        <Button icon='plus' className={cn(styles.addAddressBtn, 'body-16R')}>
                            Add Service Location
                        </Button>
                    </div>
                );
            }

            return (
                <div
                    ref={innerRef}
                    {...innerProps}
                    className={cn(styles.menuOption, styles.addressOption, 'body-16R', { [styles.grey100bg]: isFocused || isSelected })}>
                    <i className={cn('icon-house-chimney', styles.adressIcon)} />
                    {highlightMatch(data.label, searchTerm)}
                </div>
            );
        }
    };

    // TODO: move
    const generateContactData = ({ client, address }: SearchSelectOption) => {
        return {
            name: { icon: 'customer', value: String(client.name) },
            phone: { icon: 'phone', value: client.phone ? phoneToMaskString(client.phone) : '' },
            email: { icon: 'mail', value: client.email || '' },
            address: { icon: 'map-pin', value: address ? formatAddressWithAppartment(address) : '' }
        };
    };

    const handleClientSelectChange = (newValue: unknown) => {
        const selected = newValue as SearchSelectOption | null;
        if (!selected) return;

        const client = {
            id: selected.client.id,
            name: selected.client.name,
            phone: selected.client.phone,
            email: selected.client.email,
            selectedAddressId: selected?.address?.id || null
        };

        setSelectedClientForAddress(client);

        if (selected.type === 'client') {
            openCreateAddressForm();
        } else {
            setValue('selectedClient', selected);
        }
    };

    const openEditClientForm = () => {
        const addressId = selectedClientForAddress?.selectedAddressId;
        setCustomerFormAction('edit');
        setIsRequestPending(true);

        getClientByAddress(`${selectedClientForAddress?.id}`, `${addressId}`)
            .then(res => {
                setInitAdditionalContacts(res.additionalContacts);
                setIsBillingSameContact(isSameSections(res));
                clientReset(res);
                toggleDrawer();
            })
            .catch(err => {
                toast.error(err.message);
            })
            .finally(() => {
                setIsRequestPending(false);
            });
    };

    return (
        <div className={styles.page}>
            {isRequestPending && <Loader size='lg' center />}
            <div className={styles.leftSide}>
                <h1 className={cn(styles.title, 'h-20B')}>Create a New Job</h1>
                <div className={styles.actions}>
                    <Button btnStyle='blue-l' icon='search' className={cn(styles.btnExistingCustomer)}>
                        Existing Customers
                    </Button>
                    <Button btnStyle='text-btn-l' icon='plus' className={styles.btnAddNewCustomer} onClick={openAddCustomerForm}>
                        Add New Customer
                    </Button>
                </div>
                <Controller
                    name='selectedClient'
                    control={control}
                    rules={{ required: REQUIRED_FIELD }}
                    render={({ field: { value, name, onChange } }) =>
                        !value ? (
                            <Select
                                className={styles.inputSearch}
                                name={name}
                                label='Search'
                                placeholder='Start typing a full name, phone number, or address'
                                options={searchResults}
                                value={value}
                                onInputChange={handleSearchChange}
                                onChange={handleClientSelectChange}
                                isLoading={isSearching}
                                inputValue={watch('searchTerm')}
                                isSearchable={true}
                                noOptionsMessage={() => 'No results found'}
                                filterOption={null}
                                components={customSelectComponents}
                            />
                        ) : (
                            <ContactInfoCard
                                contactData={generateContactData(value)}
                                onClear={() => {
                                    setValue('selectedClient', null);
                                    setValue('searchTerm', '');
                                    onChange(null);
                                }}
                                onEdit={openEditClientForm}
                            />
                        )
                    }
                />
            </div>

            <div className={styles.rightSide}>
                <FormProvider {...jobCreationMethods}>
                    <JobCreationForm />
                </FormProvider>
            </div>

            <div className={cn(styles.footer, 'footer')}>
                <div className={cn(styles.footerContainer, 'container')}>
                    <Button btnStyle='grey-l' className={styles.btn} onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                    <Button btnStyle='blue-l' className={styles.btn} type='submit' form='creation-job-form'>
                        Create Job
                    </Button>
                </div>
            </div>
            <Drawer open={isDrawerOpen} onClose={toggleDrawer} placement='right' size='78.4rem'>
                <FormProvider {...methods}>
                    <CustomerForm
                        cancelCustomerForm={toggleDrawer}
                        submitCustomerForm={custumerFormAction === 'add' ? handleCreateCustomerSubmit : handleEditCustomerSubmit}
                        action={custumerFormAction}
                        isBillingSameContact={isBillingSameContact}
                        initAdditionalContacts={initAdditionalContacts}
                    />
                </FormProvider>
            </Drawer>

            <Modal isOpen={isOpenCreateAddressForm} onClose={closeCreateAddressForm}>
                <CreateAddressForm
                    client={selectedClientForAddress!}
                    closeCreateAddressForm={closeCreateAddressForm}
                    onAddressCreated={handleNewAddressCreated}
                />
            </Modal>
        </div>
    );
};

export default JobCreationPage;
