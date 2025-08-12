import { Loader } from 'rsuite';

import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Button from 'components/ui/Button';
import { Textarea } from 'components/ui/Input';

import { REQUIRED_FIELD, UNKNOWN_ERROR } from 'constants/common';
import { SETTINGS_ENDPOINTS } from 'constants/endpoints';
import { APP_ROUTES } from 'constants/routes';
import { apiRequest } from 'services/apiUtils';
import { parametrizeURL } from 'services/utils';
import { Method } from 'types/common';
import { CompanyDocument } from 'types/settingsTypes';

import styles from './CompanyInfoForm.module.css';

interface Props {
    item: CompanyDocument;
}

type FormData = {
    text: string;
};

const CompanyInfoForm = ({ item }: Props) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors }
    } = useForm<FormData>({ defaultValues: { text: item.text }, mode: 'onBlur' });

    useEffect(() => {
        reset({ text: item.text });
    }, [reset, item]);

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        apiRequest<{ meta: { success: boolean } }>({
            url: parametrizeURL(SETTINGS_ENDPOINTS.document, { name: item.name }),
            method: Method.PUT,
            data
        })
            .then(() => navigate(APP_ROUTES.settings.additionalInfo))
            .catch(err => toast.error(err.message || UNKNOWN_ERROR))
            .finally(() => setIsLoading(false));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <Controller
                name='text'
                control={control}
                rules={{ required: REQUIRED_FIELD }}
                render={({ field }) => <Textarea {...field} placeholder='Enter text' rows={10} errorMessage={errors.text?.message} />}
            />

            <div className={styles.formActions}>
                <Link to={APP_ROUTES.settings.additionalInfo}>
                    <Button type='button' btnStyle='text-btn-m'>
                        Cancel
                    </Button>
                </Link>
                <Button btnStyle='blue-m' type='submit'>
                    Save
                    {isLoading && <Loader size='sm' center />}
                </Button>
            </div>
        </form>
    );
};

export default CompanyInfoForm;
