import cn from 'classnames';

import { useNavigate } from 'react-router-dom';

import Button from 'components/ui/Button';

import { APP_ROUTES } from 'constants/routes';
import { parametrizeRouterURL } from 'routes/utils';

import styles from './NotificationSuccess.module.css';

interface NotificationSuccessProps {
    type: 'Invoice' | 'Estimate';
    jobId?: string;
}

const NotificationSuccess = ({ type, jobId }: NotificationSuccessProps) => {
    const navigate = useNavigate();

    const handleGoToJobPage = () => {
        if (jobId) {
            navigate(parametrizeRouterURL(APP_ROUTES.jobs.item, { jobId }));
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.checkmark}>
                    <i className={cn(styles.checkIcon, 'icon-check')} />
                </div>

                <div className={styles.message}>
                    <h1 className={cn(styles.title, 'h-20B')}>{type} was sent successfully.</h1>
                    <p className={cn(styles.subtitle, 'body-14R')}>The client has received the {type.toLowerCase()}.</p>
                </div>

                <Button btnStyle='blue-l' onClick={handleGoToJobPage} className={styles.button}>
                    Go to Job Page
                </Button>
            </div>
        </div>
    );
};

export default NotificationSuccess;
