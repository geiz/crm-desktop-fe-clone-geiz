import cn from 'classnames';
import { Loader } from 'rsuite';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import MaterialForm from 'components/Settings/MaterialForm/MaterialForm';
import { emptyDefaultValues } from 'components/Settings/utilsMaterials';

import { APP_ROUTES } from 'constants/routes';
import { createMaterial } from 'services/settings/materialsService';
import { createMaterialReducer } from 'store/slices/materialsSlice';
import { useAppDispatch } from 'store/store';
import { MaterialPriceFormValues } from 'types/settingsTypes';

import styles from './Materials.module.css';

const AddMaterialsPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = (data: MaterialPriceFormValues) => {
        setIsLoading(true);
        createMaterial(data)
            .then(resp => {
                dispatch(createMaterialReducer(resp));
                navigate(APP_ROUTES.settings.materials);
            })
            .catch(err => toast.error(err.message))
            .finally(() => setIsLoading(false));
    };

    return (
        <div className={styles.container}>
            <h3 className={cn(styles.formTitle, 'h-16B')}>Add Material</h3>
            <MaterialForm onSubmit={onSubmit} defaultValues={emptyDefaultValues} />
            {isLoading && <Loader center size='lg' />}
        </div>
    );
};

export default AddMaterialsPage;
