import { useParams } from 'react-router-dom';

import NotificationSuccess from 'components/NotificationSuccess/NotificationSuccess';

const EstimateNotificationSuccessPage = () => {
    const { id } = useParams<{ id: string }>();

    return <NotificationSuccess type='Estimate' jobId={id} />;
};

export default EstimateNotificationSuccessPage;
