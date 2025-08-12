import cn from 'classnames';

import { useCallback, useState } from 'react';

import Modal from 'components/Modals/Modal';
import Button from 'components/ui/Button';
import { Input } from 'components/ui/Input';

import { Field } from 'types/settingsTypes';

import styles from './ManageModal.module.css';

interface ManageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => Promise<void>;
    fields: Field[];
    values: Record<string, string>;
    onChange: (values: Record<string, string>) => void;
    isEdit?: boolean;
    itemName: string;
}

const ManageModal = ({ isOpen, onClose, onSave, fields, values, onChange, isEdit = false, itemName }: ManageModalProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = useCallback(() => {
        setIsLoading(true);
        onSave().finally(() => setIsLoading(false));
    }, [onSave]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} className={styles.modal}>
            <h2 className={cn(styles.title, 'h-16B')}>{isEdit ? `Edit ${itemName}` : `Add ${itemName}`}</h2>
            <div className={cn(styles.fields, { [styles.multipleFields]: fields.length === 2 })}>
                {fields.map((field, index) => (
                    <Input
                        key={field.key}
                        type={field.type || 'text'}
                        placeholder={field.placeholder || `Enter ${field.label}`}
                        label={field.label}
                        value={values[field.key]}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange({ ...values, [field.key]: event.target.value })}
                        className={cn(styles.field, {
                            [styles.firstField]: index === 0,
                            [styles.secondField]: index === 1
                        })}
                    />
                ))}
            </div>
            <div className={styles.actions}>
                <Button btnStyle='text-btn-m' onClick={onClose}>
                    Cancel
                </Button>
                <Button btnStyle='blue-m' isLoading={isLoading} onClick={handleSave} disabled={fields.some(field => !values[field.key])}>
                    Save
                </Button>
            </div>
        </Modal>
    );
};

export default ManageModal;
