import cn from 'classnames';
import { Loader } from 'rsuite';

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import JobTypeForm from 'components/Settings/JobTypeForm/JobTypeForm';

import { APP_ROUTES } from 'constants/routes';
import { getJobType, updateJobType } from 'services/settings/jobTypeService';
import { updateJobTypes } from 'store/slices/jobTypesSlice';
import { useAppDispatch } from 'store/store';
import { JobTypesFormValues } from 'types/settingsTypes';

import styles from './JobTypes.module.css';

const EditJobTypePage = () => {
    const { jobTypeId } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [initFormValues, setInitFormValues] = useState<JobTypesFormValues | null>(null);

    useEffect(() => {
        if (jobTypeId) {
            setIsLoading(true);
            getJobType(jobTypeId)
                .then(resp => {
                    const formValues = {
                        serviceType: { label: resp.service.name, value: resp.service.id },
                        componentType: resp.component ? { label: resp.component.name, value: resp.component.id } : undefined,
                        summary: resp.summary
                    };
                    setInitFormValues(formValues);
                })
                .catch(err => {
                    navigate(APP_ROUTES.settings.jobTypes);
                    toast.error(err.message);
                })
                .finally(() => setIsLoading(false));
        }
    }, [navigate, jobTypeId]);

    const onSubmit = (data: JobTypesFormValues) => {
        setIsLoading(true);
        updateJobType(data, String(jobTypeId))
            .then(resp => {
                dispatch(updateJobTypes(resp));
                navigate(APP_ROUTES.settings.jobTypes);
            })
            .catch(err => toast.error(err.message))
            .finally(() => setIsLoading(false));
    };

    return (
        <div className={styles.container}>
            <h3 className={cn(styles.title, 'h-16B')}>Edit Job Type</h3>
            {initFormValues && <JobTypeForm onSubmit={onSubmit} defaultValues={initFormValues} />}
            {isLoading && <Loader center size='lg' />}
        </div>
    );
};

export default EditJobTypePage;
