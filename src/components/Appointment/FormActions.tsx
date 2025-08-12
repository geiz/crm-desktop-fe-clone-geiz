import React from 'react';

import Button from 'components/ui/Button';

import styles from './FormActions.module.css';

interface FormActionsProps {
    onClose: () => void;
    onConfirm?: () => void; // for form we don't need to pass submit function
    isLoading?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ onClose, onConfirm, isLoading }) => (
    <div className={styles.actions}>
        <Button btnStyle='text-btn-m' type='button' onClick={onClose}>
            Cancel
        </Button>
        <Button btnStyle='red-m' type='submit' isLoading={isLoading} onClick={onConfirm}>
            Confirm
        </Button>
    </div>
);

export default FormActions;
