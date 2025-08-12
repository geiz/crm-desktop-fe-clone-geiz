import cn from 'classnames';

import { useCallback, useState } from 'react';

import Modal from 'components/Modals/Modal';
import Button from 'components/ui/Button';

import styles from './DeleteModal.module.css';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    itemName?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, itemName }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = useCallback(() => {
        setIsLoading(true);
        onConfirm()
            .then(() => onClose())
            .finally(() => setIsLoading(false));
    }, [onClose, onConfirm]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} className={styles.modal}>
            <i className={cn(styles.icon, 'icon-trash')} />
            <h2 className={cn(styles.title, 'h-16B')}>Are you sure you want to Delete {itemName}?</h2>
            <p className={cn(styles.subtitle, 'body-14R')}>This action cannot be undone.</p>
            <div className={styles.actions}>
                <Button btnStyle='text-btn-m' type='button' onClick={onClose}>
                    Cancel
                </Button>
                <Button btnStyle='red-m' isLoading={isLoading} onClick={handleClick}>
                    Delete
                </Button>
            </div>
        </Modal>
    );
};

export default DeleteModal;
