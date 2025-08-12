import cn from 'classnames';
import { Loader } from 'rsuite';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import JobTypeForm from 'components/Settings/JobTypeForm/JobTypeForm';

import { APP_ROUTES } from 'constants/routes';
import { createJobService } from 'services/settings/jobTypeService';
import { addJobTypes } from 'store/slices/jobTypesSlice';
import { useAppDispatch } from 'store/store';
import { JobTypesFormValues } from 'types/settingsTypes';
import { emptyDefaultValues } from 'utils/settings/jobTypes';

import styles from './JobTypes.module.css';

const AddJobTypePage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onSubmit = (data: JobTypesFormValues) => {
        setIsLoading(true);
        createJobService(data)
            .then(resp => {
                dispatch(addJobTypes(resp));
                navigate(APP_ROUTES.settings.jobTypes);
            })
            .catch(err => toast.error(err.message))
            .finally(() => setIsLoading(false));
    };

    return (
        <div className={styles.container}>
            <h3 className={cn(styles.title, 'h-16B')}>Add Job Type</h3>
            <JobTypeForm onSubmit={onSubmit} defaultValues={emptyDefaultValues} />
            {isLoading && <Loader center size='lg' />}
        </div>
    );
};

export default AddJobTypePage;
