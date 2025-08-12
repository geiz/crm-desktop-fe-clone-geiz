import { useMask } from '@react-input/mask';
import cn from 'classnames';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import Block from 'components/Block/Block';
import Button from 'components/ui/Button';
import { Input } from 'components/ui/Input';
import Checkbox from 'components/ui/Input/Checkbox';

import { PHONE_MASK } from 'constants/common';
import { useDidMount } from 'hooks/useDidMount';
import maskToDigitString from 'utils/maskToDigitString';
import phoneToMaskString from 'utils/phoneToMaskString';
import { emailValidationNoRequired, phoneValidationNoRequired } from 'utils/validationRules';

import styles from './EstimateNotificationSendTo.module.css';

interface Props {
    emails: string[];
    phones: string[];
    isLoading: boolean;
    type: 'Estimate' | 'Invoice';
    onCancel: () => void;
    onSend: (data: { emails: string[]; phones: string[] }) => void;
}

type SendMethod = 'email' | 'sms';

const EstimateNotificationSendTo = ({ emails, phones, isLoading, type, onCancel, onSend }: Props) => {
    const [selectedMethod, setSelectedMethod] = useState<SendMethod>('email');
    const [emailSendList, setEmailSendList] = useState<Record<string, boolean>>();
    const [phoneSendList, setPhoneSendList] = useState<Record<string, boolean>>();
    const [lineStyle, setLineStyle] = useState({ width: '0px', transform: 'translateX(0px)' });
    const tabsRef = useRef<HTMLUListElement>(null);
    const phoneRef = useMask(PHONE_MASK);

    const initialEmails = emails;
    const initialPhones = phones;

    const methods = useForm({
        defaultValues: { email: '', phone: '' },
        mode: 'onChange'
    });

    const {
        control,
        formState: { errors }
    } = methods;

    const updateLinePosition = useCallback(() => {
        const tabsContainer = tabsRef.current;
        if (!tabsContainer) return;

        const activeTabElement = tabsContainer.querySelector(`.${styles.active}`) as HTMLElement;
        if (activeTabElement) {
            setLineStyle({
                width: `${activeTabElement.offsetWidth}px`,
                transform: `translateX(${activeTabElement.offsetLeft}px)`
            });
        }
    }, []);

    useEffect(() => {
        updateLinePosition();
    }, [selectedMethod, updateLinePosition]);

    // Ensure line position is set when component is fully rendered
    useEffect(() => {
        if (emailSendList && phoneSendList) {
            setTimeout(() => {
                updateLinePosition();
            }, 50);
        }
    }, [emailSendList, phoneSendList, updateLinePosition]);

    const handleEmailChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setEmailSendList(prevState => ({ ...prevState, [event.target.name]: event.target.checked }));
    }, []);

    const handlePhoneChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneSendList(prevState => ({ ...prevState, [event.target.name]: event.target.checked }));
    }, []);

    const handleRemoveEmail = useCallback((email: string) => {
        setEmailSendList(prev => {
            if (!prev) return prev;
            const updated = { ...prev };
            delete updated[email];
            return updated;
        });
    }, []);

    const handleRemovePhone = useCallback((phone: string) => {
        setPhoneSendList(prev => {
            if (!prev) return prev;
            const updated = { ...prev };
            delete updated[phone];
            return updated;
        });
    }, []);

    const emailsToSend = useMemo(
        () => (emailSendList ? Object.keys(emailSendList).filter(email => emailSendList[email]) : []),
        [emailSendList]
    );
    const phonesToSend = useMemo(
        () => (phoneSendList ? Object.keys(phoneSendList).filter(phone => phoneSendList[phone]) : []),
        [phoneSendList]
    );

    const addedEmails = useMemo(
        () => (emailSendList ? Object.keys(emailSendList).filter(email => !initialEmails.includes(email)) : []),
        [emailSendList, initialEmails]
    );

    const addedPhones = useMemo(() => {
        if (!phoneSendList) return [];
        const formattedInitialPhones = initialPhones.map(phone => phoneToMaskString(phone));
        return Object.keys(phoneSendList).filter(phone => !formattedInitialPhones.includes(phone));
    }, [phoneSendList, initialPhones]);

    const handleSend = useCallback(() => {
        const data = {
            emails: selectedMethod === 'email' ? emailsToSend : [],
            phones: selectedMethod === 'sms' ? phonesToSend.map(phone => maskToDigitString(phone) || '') : []
        };
        onSend(data);
    }, [emailsToSend, phonesToSend, selectedMethod, onSend]);

    const hasSelectedItems = useMemo(() => {
        return selectedMethod === 'email' ? emailsToSend.length > 0 : phonesToSend.length > 0;
    }, [selectedMethod, emailsToSend, phonesToSend]);

    useDidMount(() => {
        setEmailSendList(emails.reduce((acc, email) => ({ ...acc, [email]: false }), {}));
        // Format phone numbers with mask for display
        const formattedPhones = phones.map(phone => phoneToMaskString(phone));
        setPhoneSendList(formattedPhones.reduce((acc, phone) => ({ ...acc, [phone]: false }), {}));

        // Set initial line position for email tab after DOM is ready
        setTimeout(() => {
            updateLinePosition();
        }, 100);
    });

    if (!emailSendList || !phoneSendList) return null;

    return (
        <FormProvider {...methods}>
            <div className={styles.sendContainer}>
                <Block className={styles.content}>
                    <div className={styles.methodSelector}>
                        <h3 className={cn('h-16B', styles.title)}>Send by:</h3>
                        <ul className={styles.tabs} role='tablist' ref={tabsRef}>
                            <li
                                role='tab'
                                aria-selected={selectedMethod === 'email'}
                                className={cn(styles.tab, 'body-14M', { [styles.active]: selectedMethod === 'email' })}
                                onClick={() => setSelectedMethod('email')}>
                                Email
                            </li>
                            <li
                                role='tab'
                                aria-selected={selectedMethod === 'sms'}
                                className={cn(styles.tab, 'body-14M', { [styles.active]: selectedMethod === 'sms' })}
                                onClick={() => setSelectedMethod('sms')}>
                                SMS
                            </li>
                            <li className={styles.line} style={lineStyle} />
                        </ul>
                    </div>

                    {selectedMethod === 'email' && (
                        <div className={styles.recipientSection}>
                            <h3 className={cn('h-16B', styles.recipientTitle)}>To</h3>

                            <div className={styles.recipientList}>
                                {initialEmails.map(email => (
                                    <Checkbox
                                        key={email}
                                        name={email}
                                        checked={emailSendList[email]}
                                        onChange={handleEmailChange}
                                        label={email}
                                    />
                                ))}
                                {addedEmails.length > 0 && <hr className={styles.divider} />}
                            </div>

                            {addedEmails.length > 0 && (
                                <>
                                    <div className={styles.recipientList}>
                                        {addedEmails.map(email => (
                                            <div key={email} className={styles.recipientWithTrash}>
                                                <Checkbox
                                                    name={email}
                                                    checked={emailSendList[email]}
                                                    onChange={handleEmailChange}
                                                    label={email}
                                                />
                                                <Button
                                                    btnStyle='icon-btn'
                                                    className={styles.removeButton}
                                                    icon='trash'
                                                    onClick={() => handleRemoveEmail(email)}
                                                />
                                            </div>
                                        ))}
                                        <hr className={styles.divider} />
                                    </div>
                                </>
                            )}

                            <Controller
                                name='email'
                                control={control}
                                rules={emailValidationNoRequired}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder='Enter new email'
                                        label='Type an email, then press Enter to add'
                                        errorMessage={errors?.email?.message}
                                        className={styles.input}
                                        onKeyUp={e => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const value = field.value?.trim();

                                                if (!value) return;

                                                // Check for validation errors
                                                if (errors?.email?.message) {
                                                    return;
                                                }

                                                const isDuplicated = emailSendList && Object.keys(emailSendList).includes(value);
                                                if (isDuplicated) {
                                                    field.onChange('');
                                                    return;
                                                }

                                                setEmailSendList(prev => ({ ...prev, [value]: true }));
                                                field.onChange('');
                                            }
                                        }}
                                    />
                                )}
                            />
                        </div>
                    )}

                    {selectedMethod === 'sms' && (
                        <div className={styles.recipientSection}>
                            <h3 className={cn('h-16B', styles.recipientTitle)}>To</h3>

                            <div className={styles.recipientList}>
                                {initialPhones.map(phone => (
                                    <Checkbox
                                        key={phone}
                                        name={phone}
                                        checked={phoneSendList[phone]}
                                        onChange={handlePhoneChange}
                                        label={phone}
                                    />
                                ))}
                                {addedPhones.length > 0 && <hr className={styles.divider} />}
                            </div>

                            {addedPhones.length > 0 && (
                                <>
                                    <div className={styles.recipientList}>
                                        {addedPhones.map(phone => (
                                            <div key={phone} className={styles.recipientWithTrash}>
                                                <Checkbox
                                                    name={phone}
                                                    checked={phoneSendList[phone]}
                                                    onChange={handlePhoneChange}
                                                    label={phone}
                                                />
                                                <Button
                                                    btnStyle='icon-btn'
                                                    className={styles.removeButton}
                                                    icon='trash'
                                                    onClick={() => handleRemovePhone(phone)}
                                                />
                                            </div>
                                        ))}
                                        <hr className={styles.divider} />
                                    </div>
                                </>
                            )}

                            <Controller
                                name='phone'
                                control={control}
                                rules={phoneValidationNoRequired}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        ref={phoneRef}
                                        value={field.value || ''}
                                        placeholder='Enter new phone number'
                                        label='Add phone number, then press Enter to add'
                                        errorMessage={errors?.phone?.message}
                                        className={styles.input}
                                        onKeyUp={e => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const value = field.value?.trim();

                                                if (!value) return;

                                                // Check for validation errors
                                                if (errors?.phone?.message) {
                                                    return;
                                                }

                                                const isDuplicated = phoneSendList && Object.keys(phoneSendList).includes(value);
                                                if (isDuplicated) {
                                                    field.onChange('');
                                                    return;
                                                }

                                                setPhoneSendList(prev => ({ ...prev, [value]: true }));
                                                field.onChange('');
                                            }
                                        }}
                                    />
                                )}
                            />
                        </div>
                    )}
                </Block>

                <div className={styles.actions}>
                    <Button btnStyle='text-btn-l' onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        btnStyle='blue-l'
                        icon={selectedMethod === 'email' ? 'mail' : 'message-square'}
                        disabled={!hasSelectedItems}
                        isLoading={isLoading}
                        onClick={handleSend}>
                        Send {type}
                    </Button>
                </div>
            </div>
        </FormProvider>
    );
};

export default EstimateNotificationSendTo;
