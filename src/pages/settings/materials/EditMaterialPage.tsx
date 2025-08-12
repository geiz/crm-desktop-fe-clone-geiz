import cn from 'classnames';
import { Loader } from 'rsuite';

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import MaterialForm from 'components/Settings/MaterialForm/MaterialForm';

import { APP_ROUTES } from 'constants/routes';
import { businessUnitsServices } from 'services/settings/crudSettingsServices';
import { getMaterial, updateMaterial } from 'services/settings/materialsService';
import { updateMaterialReducer } from 'store/slices/materialsSlice';
import { useAppDispatch } from 'store/store';
import { MaterialPriceFormValues } from 'types/settingsTypes';

import styles from './Materials.module.css';

const EditMaterialsPage = () => {
    const { materialId } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [initFormValues, setInitFormValues] = useState<MaterialPriceFormValues | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (materialId) {
            setIsLoading(true);
            getMaterial(materialId)
                .then(resp => {
                    businessUnitsServices.fetchById(String(resp.businessUnitId)).then(unit => {
                        const formValues = {
                            name: resp.name,
                            businessUnit: { label: unit.name, value: unit.id },
                            description: resp.description,
                            price: resp.price
                        };
                        setInitFormValues(formValues);
                    });
                })
                .catch(err => {
                    navigate(APP_ROUTES.settings.materials);
                    toast.error(err.message);
                })
                .finally(() => setIsLoading(false));
        }
    }, [navigate, materialId]);

    const onSubmit = (data: MaterialPriceFormValues) => {
        setIsLoading(true);
        updateMaterial(data, String(materialId))
            .then(resp => {
                dispatch(updateMaterialReducer(resp));
                navigate(APP_ROUTES.settings.materials);
            })
            .catch(err => toast.error(err.message))
            .finally(() => setIsLoading(false));
    };

    return (
        <div className={styles.container}>
            <h3 className={cn(styles.formTitle, 'h-16B')}>Edit Material</h3>
            {isLoading && <Loader center size='lg' />}
            {initFormValues && <MaterialForm onSubmit={onSubmit} defaultValues={initFormValues} />}
        </div>
    );
};

export default EditMaterialsPage;
