import cn from 'classnames';

import { memo, useCallback, useEffect, useState } from 'react';

import Modal from 'components/Modals/Modal';
import Button from 'components/ui/Button';
import Textarea from 'components/ui/Input/Textarea';

import styles from './TextboxModal.module.css';

interface TextboxModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newValue: string) => Promise<void>;
    title: string;
    value: string;
    placeholder?: string;
    maxLength: number;
}

const TextboxModal: React.FC<TextboxModalProps> = ({ isOpen, onClose, onSave, title, value, maxLength, ...props }) => {
    const [text, setText] = useState(value || '');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) setText(value || '');
    }, [value, isOpen]);

    const handleChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => setText(event.target.value), []);

    const handleSave = useCallback(() => {
        setIsLoading(true);
        onSave(text || '')
            .then(() => onClose())
            .finally(() => setIsLoading(false));
    }, [onSave, text, onClose]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} className={styles.modal}>
            <h3 className={cn(styles.title, 'h-20B')}>{title}</h3>

            <Textarea maxLength={maxLength} value={text || ''} onChange={handleChange} {...props} autoResize />

            <div className={styles.actions}>
                <Button btnStyle='text-btn-m' onClick={onClose}>
                    Cancel
                </Button>
                <Button btnStyle='blue-m' onClick={handleSave} disabled={!(text || '').trim()} isLoading={isLoading}>
                    Save
                </Button>
            </div>
        </Modal>
    );
};

export default memo(TextboxModal);
