import cn from 'classnames';
import { Loader } from 'rsuite';

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import PriceBookForm from 'components/Settings/PriceBookForm/PriceBookForm';

import { APP_ROUTES } from 'constants/routes';
import { businessUnitsServices } from 'services/settings/crudSettingsServices';
import { getService, updateService } from 'services/settings/priceBookService';
import { updateServiceReducer } from 'store/slices/priceBookSlice';
import { useAppDispatch } from 'store/store';
import { MaterialPriceFormValues } from 'types/settingsTypes';
import fromMinutesToStringFormat from 'utils/fromMinutesToStringFormat';

import styles from './PriceBook.module.css';

const EditPriceBookPage = () => {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [initFormValues, setInitFormValues] = useState<MaterialPriceFormValues | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (serviceId) {
            setIsLoading(true);
            getService(serviceId)
                .then(resp => {
                    businessUnitsServices.fetchById(String(resp.businessUnitId)).then(unit => {
                        const formValues = {
                            name: resp.name,
                            businessUnit: { label: unit.name, value: unit.id },
                            description: resp.description,
                            price: resp.price,
                            duration: fromMinutesToStringFormat(resp.duration)
                        };
                        setInitFormValues(formValues);
                    });
                })
                .catch(err => {
                    navigate(APP_ROUTES.settings.priceBook);
                    toast.error(err.message);
                })
                .finally(() => setIsLoading(false));
        }
    }, [navigate, serviceId]);

    const onSubmit = (data: MaterialPriceFormValues) => {
        setIsLoading(true);
        updateService(data, String(serviceId))
            .then(resp => {
                dispatch(updateServiceReducer(resp));
                navigate(APP_ROUTES.settings.priceBook);
            })
            .catch(err => toast.error(err.message))
            .finally(() => setIsLoading(false));
    };

    return (
        <div className={styles.container}>
            <h3 className={cn(styles.title, 'h-16B')}>Edit Service</h3>
            {isLoading && <Loader center size='lg' />}
            {initFormValues && <PriceBookForm onSubmit={onSubmit} defaultValues={initFormValues} />}
        </div>
    );
};

export default EditPriceBookPage;
