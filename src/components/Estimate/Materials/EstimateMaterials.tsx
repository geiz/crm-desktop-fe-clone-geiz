import { useCallback, useState } from 'react';

import EstimateEmailOrder from 'components/Estimate/Email/EstimateEmailOrder';
import EstimateFormItem from 'components/Estimate/EstimateFormItem';
import SettingsSection from 'components/Estimate/SettingsSection';

import { getInitialMaterial, getTransformedMaterials } from './utils';
import { useDebouncedCallback } from 'hooks/useDebouncedCallback';
import { deleteEstimateMaterial, updateEstimateMaterial } from 'services/estimateService';
import { addMaterial, deleteMaterial, updateMaterial } from 'store/slices/estimateSlice';
import { useAppDispatch } from 'store/store';
import { EstimateMaterial, MaterialOption, TaxOption } from 'types/estimateTypes';
import { hideLocalId, isIdLocal } from 'utils/hideLocalId';

import styles from './EstimateMaterials.module.css';

interface Props {
    materials: EstimateMaterial[];
    estimateId: number;
    materialOptions: MaterialOption[];
    taxOptions: TaxOption[];
    canEdit: boolean;
}

const EstimateMaterials = ({ estimateId, materials, materialOptions, taxOptions, canEdit }: Props) => {
    const [updatingItemId, setUpdatingItemId] = useState<number | string>('');

    const dispatch = useAppDispatch();

    const handleAddItem = useCallback(() => {
        dispatch(addMaterial(getInitialMaterial()));
    }, [dispatch]);

    const handleChangeItem = useDebouncedCallback((material: EstimateMaterial) => {
        if (material.summary && material.itemName) {
            setUpdatingItemId(material.id);
            updateEstimateMaterial(estimateId, hideLocalId(material), taxOptions)
                .then(newMaterial => {
                    dispatch(updateMaterial(isIdLocal(material.id) ? { ...newMaterial, localId: material.id as string } : newMaterial));
                })
                .finally(() => setUpdatingItemId(''));
        }
    }, 1000);

    const handleDeleteItem = useCallback(
        (materialId: number | string) => {
            if (isIdLocal(materialId)) {
                dispatch(deleteMaterial({ id: materialId }));
                return Promise.resolve(true);
            }

            return deleteEstimateMaterial(estimateId, materialId, taxOptions).then(prices => {
                dispatch(deleteMaterial({ prices, id: materialId }));
                return true;
            });
        },
        [dispatch, estimateId, taxOptions]
    );

    return (
        <SettingsSection name='Materials' count={materials.length} canEdit={canEdit} addName='Material item' onAdd={handleAddItem}>
            {canEdit && materials.length > 0 && (
                <div className={styles.list}>
                    {materials.map(material => (
                        <EstimateFormItem
                            key={material.id}
                            itemData={material}
                            isUpdating={updatingItemId === material.id}
                            options={materialOptions}
                            onChange={handleChangeItem}
                            onDelete={handleDeleteItem}
                        />
                    ))}
                </div>
            )}
            {!canEdit && materials.length > 0 && <EstimateEmailOrder orderType='ITEM NAME' list={getTransformedMaterials(materials)} />}
        </SettingsSection>
    );
};

export default EstimateMaterials;
