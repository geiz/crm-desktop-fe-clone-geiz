import cn from 'classnames';

import Block from 'components/Block/Block';
import Dropdown from 'components/ui/Dropdown';

import { ContactData } from 'types/client';

import styles from './ContactInfoCard.module.css';

interface ContactInfoCardProps {
    contactData: ContactData;
    onEdit: () => void;
    onClear: () => void;
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ contactData, onEdit, onClear }) => {
    const actions = [
        { label: 'Edit', onClick: onEdit },
        { label: 'Discard', onClick: onClear }
    ];

    return (
        <Block className={styles.card}>
            <div className={cn(styles.title, 'h-16B')}>contact info</div>

            <div className={styles.cardBody}>
                <div className={cn(styles.leftColumn, styles.column)}>
                    <div className={styles.row}>
                        <i className={cn(styles.icon, `icon-${contactData?.name.icon}`)} />
                        <span className={cn(styles.value, 'body-14M')}>{contactData?.name.value}</span>
                    </div>
                    <div className={styles.row}>
                        <i className={cn(styles.icon, `icon-${contactData?.phone.icon}`)} />
                        <span className={cn(styles.value, 'body-14M')}>{contactData?.phone.value}</span>
                    </div>
                    <div className={styles.row}>
                        <i className={cn(styles.icon, `icon-${contactData?.email.icon}`)} />
                        <span className={cn(styles.value, 'body-14M')}>{contactData?.email.value}</span>
                    </div>
                </div>
                <div className={cn(styles.rightColumn, styles.column)}>
                    <div className={styles.row}>
                        <i className={cn(styles.icon, `icon-${contactData?.address.icon}`)} />
                        <span className={cn(styles.value, 'body-14M')}>{contactData?.address.value}</span>
                    </div>
                </div>
            </div>
            <Dropdown options={actions} className={styles.actionsBtn} />
        </Block>
    );
};

export default ContactInfoCard;
