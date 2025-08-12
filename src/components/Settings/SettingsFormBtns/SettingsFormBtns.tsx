import { useNavigate } from 'react-router-dom';

import Button from 'components/ui/Button';

import styles from './SettingsFormBtns.module.css';

interface SettingsFormBtnsProps {
    disabled?: boolean;
    isLoading?: boolean;
    hasValidationErrors?: boolean;
}

const SettingsFormBtns = ({ disabled, isLoading, hasValidationErrors }: SettingsFormBtnsProps) => {
    const navigate = useNavigate();
    const handleCancel = () => navigate(-1);

    return (
        <div className={styles.formActions}>
            <Button btnStyle='text-btn-m' type='button' onClick={handleCancel}>
                {disabled ? 'Back' : 'Cancel'}
            </Button>
            {!disabled && (
                <Button btnStyle='blue-m' type='submit' disabled={isLoading || hasValidationErrors}>
                    {isLoading ? 'Saving...' : 'Save'}
                </Button>
            )}
        </div>
    );
};

export default SettingsFormBtns;
