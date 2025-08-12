import cn from 'classnames';
import { Loader } from 'rsuite';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import PriceBookForm from 'components/Settings/PriceBookForm/PriceBookForm';
import { emptyDefaultValues } from 'components/Settings/utilsPriceBook';

import { APP_ROUTES } from 'constants/routes';
import { createService } from 'services/settings/priceBookService';
import { createServiceReducer } from 'store/slices/priceBookSlice';
import { useAppDispatch } from 'store/store';
import { MaterialPriceFormValues } from 'types/settingsTypes';

import styles from './PriceBook.module.css';

const AddPriceBookPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onSubmit = (data: MaterialPriceFormValues) => {
        setIsLoading(true);
        createService(data)
            .then(resp => {
                dispatch(createServiceReducer(resp));
                navigate(APP_ROUTES.settings.priceBook);
            })
            .catch(err => toast.error(err.message))
            .finally(() => setIsLoading(false));
    };

    return (
        <div className={styles.container}>
            <h3 className={cn(styles.title, 'h-16B')}>Add Service</h3>
            <PriceBookForm onSubmit={onSubmit} defaultValues={emptyDefaultValues} />
            {isLoading && <Loader center size='lg' />}
        </div>
    );
};

export default AddPriceBookPage;
