import { useCallback, useState } from 'react';

import EstimateEmailOrder from 'components/Estimate/Email/EstimateEmailOrder';
import EstimateFormItem from 'components/Estimate/EstimateFormItem';
import SettingsSection from 'components/Estimate/SettingsSection';

import { getInitialService, getTransformedServices } from './utils';
import { useDebouncedCallback } from 'hooks/useDebouncedCallback';
import { deleteEstimateService, updateEstimateService } from 'services/estimateService';
import { addService, deleteService, updateService } from 'store/slices/estimateSlice';
import { useAppDispatch } from 'store/store';
import { EstimateService, ServiceOption, TaxOption } from 'types/estimateTypes';
import { hideLocalId, isIdLocal } from 'utils/hideLocalId';

import styles from './EstimateServices.module.css';

interface Props {
    services: EstimateService[];
    estimateId: number;
    serviceOptions: ServiceOption[];
    taxOptions: TaxOption[];
    canEdit: boolean;
}

const EstimateServices = ({ estimateId, services, serviceOptions, taxOptions, canEdit }: Props) => {
    const [updatingItemId, setUpdatingItemId] = useState<number | string>('');
    const [itemStatuses, setItemStatuses] = useState<{ [key: string]: 'saved' | 'unsaved' | '' }>({});
    const dispatch = useAppDispatch();

    const handleAddItem = useCallback(() => {
        dispatch(addService(getInitialService()));
    }, [dispatch]);

    const handleChangeItem = useDebouncedCallback((service: EstimateService) => {
        if (service.summary && service.itemName) {
            setUpdatingItemId(service.id);
            updateEstimateService(estimateId, hideLocalId(service), taxOptions)
                .then(newService => {
                    dispatch(updateService(isIdLocal(service.id) ? { ...newService, localId: service.id as string } : newService));
                    setItemStatuses(prev => ({ ...prev, [String(service.id)]: 'saved' }));
                    setTimeout(() => {
                        setItemStatuses(prev => ({ ...prev, [String(service.id)]: '' }));
                    }, 2000);
                })
                .catch(() => {
                    setItemStatuses(prev => ({ ...prev, [String(service.id)]: 'unsaved' }));
                    setTimeout(() => {
                        setItemStatuses(prev => ({ ...prev, [String(service.id)]: '' }));
                    }, 2000);
                })
                .finally(() => setUpdatingItemId(''));
        }
    }, 1000);

    const handleDeleteItem = useCallback(
        (serviceId: number | string) => {
            if (isIdLocal(serviceId)) {
                dispatch(deleteService({ id: serviceId }));
                return Promise.resolve(true);
            }

            return deleteEstimateService(estimateId, serviceId, taxOptions).then(prices => {
                dispatch(deleteService({ prices, id: serviceId }));
                return true;
            });
        },
        [dispatch, estimateId, taxOptions]
    );

    return (
        <SettingsSection name='Services' count={services.length} canEdit={canEdit} addName='Service item' onAdd={handleAddItem}>
            {canEdit && services.length > 0 && (
                <div className={styles.list}>
                    {services.map(service => (
                        <EstimateFormItem
                            key={service.id}
                            itemData={service}
                            isUpdating={updatingItemId === service.id}
                            status={itemStatuses[service.id] || ''}
                            options={serviceOptions}
                            onChange={handleChangeItem}
                            onDelete={handleDeleteItem}
                        />
                    ))}
                </div>
            )}
            {!canEdit && services.length > 0 && <EstimateEmailOrder orderType='ITEM NAME' list={getTransformedServices(services)} />}
        </SettingsSection>
    );
};

export default EstimateServices;
