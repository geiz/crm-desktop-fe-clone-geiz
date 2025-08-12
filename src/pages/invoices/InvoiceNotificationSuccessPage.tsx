import { useParams } from 'react-router-dom';

import NotificationSuccess from 'components/NotificationSuccess/NotificationSuccess';

const InvoiceNotificationSuccessPage = () => {
    const { jobId } = useParams<{ jobId: string }>();

    return <NotificationSuccess type='Invoice' jobId={jobId} />;
};

export default InvoiceNotificationSuccessPage;
