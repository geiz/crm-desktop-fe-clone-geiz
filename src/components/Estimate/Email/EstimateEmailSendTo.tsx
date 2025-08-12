import cn from 'classnames';

import { useCallback, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import Block from 'components/Block/Block';
import Button from 'components/ui/Button';
import { Input } from 'components/ui/Input';
import Checkbox from 'components/ui/Input/Checkbox';

import { useDidMount } from 'hooks/useDidMount';
import { emailValidationNoRequired } from 'utils/validationRules.js';

import styles from './EstimateEmailSendTo.module.css';

interface Props {
    emails: string[];
    isLoading: boolean;
    type: 'Estimate' | 'Invoice';
    onCancel: () => void;
    onSend: (emails: string[]) => void;
}

const EstimateEmailSendTo = ({ emails, isLoading, type, onCancel, onSend }: Props) => {
    const [sendList, setSendList] = useState<Record<string, boolean>>();
    const initialEmails = emails;
    const methods = useForm({ defaultValues: { email: '' }, mode: 'onChange' });
    const {
        control,
        formState: { errors }
    } = methods;

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSendList(prevState => ({ ...prevState, [event.target.name]: event.target.checked }));
    }, []);

    const handleRemoveEmail = useCallback((email: string) => {
        setSendList(prev => {
            if (!prev) return prev;
            const updated = { ...prev };
            delete updated[email];
            return updated;
        });
    }, []);

    const listToSend = useMemo(() => (sendList ? Object.keys(sendList).filter(email => sendList[email]) : []), [sendList]);

    const addedEmails = useMemo(
        () => (sendList ? Object.keys(sendList).filter(email => !initialEmails.includes(email)) : []),
        [sendList, initialEmails]
    );
    const handleSend = useCallback(() => onSend(listToSend), [listToSend, onSend]);

    useDidMount(() => setSendList(emails.reduce((acc, email) => ({ ...acc, [email]: false }), {})));

    if (!sendList) return null;

    return (
        <FormProvider {...methods}>
            <div className={styles.sendEmails}>
                <Block className={styles.emails}>
                    <h3 className={cn('h-16B', styles.emailsTitle)}>To</h3>

                    <div className={styles.emailsList}>
                        {initialEmails.map(email => (
                            <Checkbox key={email} name={email} checked={sendList[email]} onChange={handleChange} label={email} />
                        ))}
                        {addedEmails.length > 0 && <hr className={styles.divider} />}
                    </div>

                    {addedEmails.length > 0 && (
                        <>
                            <div className={styles.emailsList}>
                                {addedEmails.map(email => (
                                    <div key={email} className={styles.emailWithTrash}>
                                        <Checkbox name={email} checked={sendList[email]} onChange={handleChange} label={email} />
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
                                className={styles.emailInput}
                                onKeyUp={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const value = field.value?.trim();

                                        if (!value) return;
                                        const isDuplicated = sendList && Object.keys(sendList).includes(value);
                                        if (isDuplicated) {
                                            field.onChange('');
                                            return;
                                        }

                                        setSendList(prev => ({ ...prev, [value]: true }));
                                        field.onChange('');
                                    }
                                }}
                            />
                        )}
                    />
                </Block>

                <div className={styles.actions}>
                    <Button btnStyle='text-btn-l' onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button btnStyle='blue-l' icon='mail' disabled={!listToSend.length} isLoading={isLoading} onClick={handleSend}>
                        Send {type}
                    </Button>
                </div>
            </div>
        </FormProvider>
    );
};

export default EstimateEmailSendTo;
