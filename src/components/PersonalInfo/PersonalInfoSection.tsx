import cn from 'classnames';
import { Drawer } from 'rsuite';

import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import CustomerForm from 'components/CustomerForm/CustomerForm';
import Button from 'components/ui/Button';
import Popover from 'components/ui/Popover';
import SuccessCheck from 'components/ui/SuccessCheck';
import Tooltip from 'components/ui/Tooltip';

import useAddressValidation from 'hooks/useAddressValidation';
import useCopyToClipboard from 'hooks/useCopyToClipboard';
import useDrawer from 'hooks/useDrawer';
import { getContactsOnJobPage, updateContactOnJobPage, updateJobNotifications } from 'services/jobService';
import { toggleNotification, updateClientReducer } from 'store/slices/jobSlice';
import { useAppDispatch } from 'store/store';
import { ClientFormValues } from 'types/client';
import { Job, NotificationKeys } from 'types/jobTypes';
import { formatAddress, formatAddressWithAppartment } from 'utils/formatAddress';
import phoneToMaskString from 'utils/phoneToMaskString';

import styles from './PersonalInfo.module.css';

import 'rsuite/dist/rsuite-no-reset.min.css';

import { AdditionalContact } from 'components/CustomerForm/types';
import { isSameSections } from 'components/CustomerForm/utils';

import getDirtyValues from 'utils/getDirtyValues';

interface PersonalInfoSectionProps {
    name: 'contact' | 'billing';
    section: Job['client' | 'billing'];
    editable?: boolean;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ section, name, editable = false }) => {
    const { jobId } = useParams();
    const dispatch = useAppDispatch();
    const { toggleDrawer, isDrawerOpen } = useDrawer();
    const email = useCopyToClipboard(section.email);
    const address = useCopyToClipboard(formatAddress(section.address!));
    const { validateAddressInput } = useAddressValidation();
    const [isWarning, setIsWarning] = useState(false);
    const [initAdditionalContacts, setInitAdditionalContacts] = useState<AdditionalContact[] | null>(null);
    const [isBillingSameContact, setIsBillingSameContact] = useState(false);

    const methods = useForm<ClientFormValues>({
        defaultValues: {},
        mode: 'onChange'
    });
    const {
        reset,
        formState: { dirtyFields }
    } = methods;

    useEffect(() => {
        const validateAddress = async (addressInput: string) => {
            const { isValidAddress } = await validateAddressInput(addressInput);
            setIsWarning(!isValidAddress);
        };

        if (section && section.address) {
            const addressInput = formatAddress(section.address);
            validateAddress(addressInput);
        }
    }, [section, validateAddressInput]);

    const onSubmit = (data: ClientFormValues, additionalContacts: AdditionalContact[], isBillingSameContact: boolean) => {
        const partial = getDirtyValues(dirtyFields, data);

        return updateContactOnJobPage({
            partial,
            data,
            jobId: Number(jobId),
            isBillingSameContact,
            initAdditionalContacts,
            additionalContacts
        })
            .then(res => {
                dispatch(updateClientReducer({ client: res.contact, billing: res.billing }));
                toggleDrawer();
            })
            .catch(err => {
                toast.error(err.message);
            });
    };

    const handleToggleNotification = async (key: 'email' | 'phone') => {
        if (!jobId) return;

        const state: Record<string, NotificationKeys> = {
            phone: 'phoneNotification',
            email: 'emailNotification'
        };
        const newState: boolean = !section[state[key]];

        updateJobNotifications({ newState, jobId: Number(jobId), blockName: name, key })
            .then(res => {
                dispatch(toggleNotification({ data: { [state[key]]: res }, section: name === 'contact' ? 'client' : name }));
                toast.success(
                    `${key === 'email' ? 'Email' : 'Phone'} notifications for the client have been ${newState ? 'enabled' : 'disabled'}!`
                );
            })
            .catch(error => toast.error(error.message));
    };

    const handleOpenDrawer = () => {
        getContactsOnJobPage(`${jobId}`).then(resp => {
            reset(resp);
            setIsBillingSameContact(isSameSections(resp));
            setInitAdditionalContacts(resp.additionalContacts);
            toggleDrawer();
        });
    };

    return (
        <div className={styles.infoSection}>
            <h2 className={cn(styles.infoTitle, 'h-16B')}>
                {`${name} info`.toUpperCase()}
                {editable && name === 'contact' && (
                    <Button btnStyle='icon-btn' className={cn(styles.editButton, 'icomoon', 'icon-edit')} onClick={handleOpenDrawer} />
                )}
            </h2>

            <div className={cn(styles.infoFields, 'body-14M')}>
                <div className={styles.infoFieldWrap}>
                    <i className={cn(styles.keyIcon, 'icomoon icon-customer body-16R')}></i>
                    {name === 'contact' && (
                        <Link to={'#'} className={cn(styles.link, styles.value)}>
                            {section.name}
                        </Link>
                    )}
                    {name === 'billing' && section.name}
                </div>

                {section.phone && (
                    <div className={styles.infoFieldWrap}>
                        <i className={cn(styles.keyIcon, 'icomoon icon-phone body-16R')}></i>
                        <div className={styles.fieldValue}>
                            <span>{phoneToMaskString(section.phone)}</span>
                            {editable && (
                                <Tooltip text={section.phoneNotification ? 'Turn off notifications' : 'Turn on notifications'}>
                                    <Button
                                        btnStyle='icon-btn'
                                        className={cn(styles.notificationButton, 'icomoon', {
                                            'icon-notifications': section.phoneNotification,
                                            [styles.notificationsOn]: section.phoneNotification,
                                            'icon-notifications-off': !section.phoneNotification,
                                            [styles.notificationsOff]: !section.phoneNotification
                                        })}
                                        onClick={() => handleToggleNotification('phone')}
                                    />
                                </Tooltip>
                            )}
                        </div>
                    </div>
                )}

                {section.email && (
                    <div className={styles.infoFieldWrap}>
                        <i className={cn(styles.keyIcon, 'icomoon icon-mail body-16R')}></i>

                        <div className={styles.fieldValue}>
                            <Popover
                                tooltipText='Click to see more'
                                childrenStyle={styles.value}
                                popoverContent={
                                    <div className={cn(styles.popoverValue, 'pointer body-14M')} onClick={email.copyToClipboard}>
                                        {section.email}
                                        {email.isCopied ? <SuccessCheck /> : <i className={cn(styles.copyIcon, 'icomoon icon-copy')} />}
                                    </div>
                                }>
                                {section.email}
                            </Popover>

                            {editable && (
                                <Tooltip text={section.phoneNotification ? 'Turn off notifications' : 'Turn on notifications'}>
                                    <Button
                                        btnStyle='icon-btn'
                                        className={cn(styles.notificationButton, 'icomoon', {
                                            'icon-notifications': section.emailNotification,
                                            [styles.notificationsOn]: section.emailNotification,
                                            'icon-notifications-off': !section.emailNotification,
                                            [styles.notificationsOff]: !section.emailNotification
                                        })}
                                        onClick={() => handleToggleNotification('email')}
                                    />
                                </Tooltip>
                            )}
                        </div>
                    </div>
                )}

                <div className={cn(styles.infoFieldWrap, styles.address)}>
                    {isWarning ? (
                        <Tooltip text='The address is invalid.'>
                            <i onMouseEnter={e => e.stopPropagation()} className={cn(styles.alertIcon, 'icomoon icon-alert-triangle')} />
                        </Tooltip>
                    ) : (
                        <i className={cn(styles.keyIcon, styles.address, 'icomoon icon-map-pin body-16R')}></i>
                    )}

                    {section.address && (
                        <div className={styles.addressWrap}>
                            <Popover
                                tooltipText='Click to see more'
                                childrenStyle={styles.fieldValue}
                                popoverContent={
                                    <div className={cn(styles.popoverValue, 'pointer body-14M')} onClick={address.copyToClipboard}>
                                        {formatAddress(section.address)}
                                        {address.isCopied ? <SuccessCheck /> : <i className={cn(styles.copyIcon, 'icomoon icon-copy')} />}
                                    </div>
                                }>
                                {formatAddressWithAppartment(section.address)}
                            </Popover>
                            {section.address?.buzzer && (
                                <p>
                                    <i className={cn(styles.buzzerIcon, 'icomoon icon-buzzer')} />
                                    {section.address.buzzer}
                                </p>
                            )}
                            {/* TODO: add address message */}
                            {/* <p className={cn(styles.addressMessage, 'body-12M')}>Use side entrance near garage</p> */}
                        </div>
                    )}
                </div>
            </div>

            {initAdditionalContacts && (
                <Drawer open={isDrawerOpen} onClose={toggleDrawer} placement='right' size='78.4rem'>
                    <FormProvider {...methods}>
                        <CustomerForm
                            cancelCustomerForm={toggleDrawer}
                            isBillingSameContact={isBillingSameContact}
                            submitCustomerForm={onSubmit}
                            initAdditionalContacts={initAdditionalContacts}
                            action='edit'
                        />
                    </FormProvider>
                </Drawer>
            )}
        </div>
    );
};

export default PersonalInfoSection;
