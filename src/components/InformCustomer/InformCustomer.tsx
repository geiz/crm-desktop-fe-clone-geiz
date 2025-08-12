import cn from 'classnames';

import Button from 'components/ui/Button';

import styles from './InformCustomer.module.css';

interface InformCustomerProps {
    handleCancel: () => void;
    handleNotification: (value: boolean) => void;
}

const InformCustomer = ({ handleCancel, handleNotification }: InformCustomerProps) => {
    const notifyCustomer = () => handleNotification(true);
    const skipNotification = () => handleNotification(false);

    return (
        <div className={styles.container}>
            <p className={cn(styles.title, 'h-16B')}>Inform customer of schedule change?</p>
            <div className={styles.btns}>
                <Button icon='notifications' btnStyle='blue-m' className={styles.btnOn} onClick={notifyCustomer}>
                    Yes, notify
                </Button>
                <Button icon='notifications-off' btnStyle='outlined-s' className={styles.btnOff} onClick={skipNotification}>
                    No, don’t notify
                </Button>
                <Button btnStyle='text-btn-m' onClick={handleCancel}>
                    Cancel change
                </Button>
            </div>
        </div>
    );
};

export default InformCustomer;
