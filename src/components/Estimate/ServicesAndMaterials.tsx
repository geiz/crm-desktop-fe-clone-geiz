import Divider from 'rsuite/esm/Divider';

import Block from 'components/Block/Block';
import Button from 'components/ui/Button';

import styles from './ServicesAndMaterials.module.css';

interface Props {
    canEdit: boolean;
    isSubmitDisabled: boolean;
    submitButtonText: string;
    priceComponent: React.ReactNode;
    children: React.ReactNode;
    onSubmit: () => void;
}

export const ServicesAndMaterials = ({ canEdit, isSubmitDisabled, submitButtonText, priceComponent, children, onSubmit }: Props) => (
    <div className={styles.container}>
        <Block>
            {children}
            {!canEdit && <Divider className={styles.customDivider} />}
            {priceComponent}
        </Block>
        <Button icon='mail' btnStyle='blue-m' className={styles.emailBtn} disabled={isSubmitDisabled} onClick={onSubmit}>
            {submitButtonText}
        </Button>
    </div>
);
