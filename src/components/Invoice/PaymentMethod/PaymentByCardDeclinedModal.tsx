import cn from 'classnames';

import { memo } from 'react';

import Modal from 'components/Modals/Modal';
import Button from 'components/ui/Button';

import styles from './PaymentByCardDeclinedModal.module.css';

interface Props {
    message: string;
    isOpen: boolean;
    onClose: () => void;
}

export const PaymentByCardDeclinedModal = memo(({ isOpen, message, onClose }: Props) => (
    <Modal isOpen={isOpen} className={styles.modal} onClose={onClose}>
        <p className={cn(styles.description, 'h-16B')}>{message}</p>
        <div>
            <Button btnStyle='blue-l' onClick={onClose}>
                Try again
            </Button>
        </div>
    </Modal>
));
