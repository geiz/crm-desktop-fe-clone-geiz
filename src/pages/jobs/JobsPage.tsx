import { FC } from 'react';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from 'constants/routes';
import { parametrizeRouterURL } from 'routes/utils';

const JobsPage: FC = () => {
    return (
        <div>
            <h1>JobsPage</h1>
            <Link to={parametrizeRouterURL(APP_ROUTES.jobs.item, { jobId: '24' })}>JobItemPage</Link>
        </div>
    );
};

export default JobsPage;
