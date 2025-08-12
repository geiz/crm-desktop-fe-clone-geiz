import { AdditionalContact } from './types';
import { useMask } from '@react-input/mask';

import { useState } from 'react';

import Button from 'components/ui/Button';
import { Input } from 'components/ui/Input';

import { validateEmailContact, validatePhoneContact } from './utils';
import { PHONE_MASK, REQUIRED_FIELD } from 'constants/common';
import { ContactType } from 'types/common';

import styles from './AdditionalMethod.module.css';

interface AdditionalMethodProps {
    item: AdditionalContact;
    onDelete: (id: number) => void;
    onUpdate: (id: number, data: Partial<AdditionalContact>) => void;
}

const AdditionalMethod: React.FC<AdditionalMethodProps> = ({ item, onDelete, onUpdate }) => {
    const phoneRef = useMask(PHONE_MASK);

    const [error, setError] = useState({
        [ContactType.PHONE]: '',
        [ContactType.EMAIL]: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(prev => ({
            ...prev,
            [item.type]: validate[item.type]({ ...item, value: e.target.value }) || ''
        }));
        onUpdate(item.id, { value: e.target.value });
    };

    const validate = {
        [ContactType.EMAIL]: validateEmailContact,
        [ContactType.PHONE]: validatePhoneContact
    };

    const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const note = e.target.value;
        onUpdate(item.id, { note });

        // show error to empty method input
        if (note && !item.value) {
            setError(prev => ({
                ...prev,
                [item.type]: REQUIRED_FIELD
            }));
        } else {
            setError(prev => ({
                ...prev,
                [item.type]: ''
            }));
        }
    };

    const handleDelete = () => {
        onDelete(item.id);
    };

    return (
        <div className={styles.container}>
            {item.type === ContactType.PHONE ? (
                <Input
                    ref={phoneRef}
                    value={item.value}
                    onChange={handleInputChange}
                    placeholder='Enter phone number'
                    label='Phone number'
                    errorMessage={error[item.type]}
                    className={styles.phone}
                />
            ) : (
                <Input
                    placeholder='Enter email'
                    label='Email address'
                    value={item.value}
                    onChange={handleInputChange}
                    errorMessage={error[item.type]}
                    className={styles.email}
                />
            )}

            <Input label='Note (optional)' value={item.note} onChange={handleNoteChange} placeholder='Enter note' className={styles.note} />

            <Button
                btnStyle='outlined-s'
                className={styles.deleteBtn}
                type='button'
                icon='trash'
                onClick={handleDelete}
                area-label='remove method'></Button>
        </div>
    );
};

export default AdditionalMethod;
