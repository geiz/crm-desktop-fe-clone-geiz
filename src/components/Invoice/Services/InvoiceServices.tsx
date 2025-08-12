import { isNull } from 'lodash';

import { useCallback, useState } from 'react';

import EstimateEmailOrder from 'components/Estimate/Email/EstimateEmailOrder';
import { getInitialService, getTransformedServices } from 'components/Estimate/Services/utils';
import SettingsSection from 'components/Estimate/SettingsSection';
import InvoiceSettingsForm from 'components/Invoice/InvoiceSettingsForm';
import DeleteModal from 'components/Modals/DeleteModal';
import Modal from 'components/Modals/Modal';

import useModal from 'hooks/useModal';
import { deleteInvoiceService, updateInvoiceService } from 'services/invoiceService';
import { addService, deleteService, updateService } from 'store/slices/invoiceSlice';
import { useAppDispatch } from 'store/store';
import { EstimateService, ServiceOption, TaxOption } from 'types/estimateTypes';
import { hideLocalId, isIdLocal } from 'utils/hideLocalId';

interface Props {
    services: EstimateService[];
    jobId: number;
    serviceOptions: ServiceOption[];
    taxOptions: TaxOption[];
    canEdit: boolean;
}

const InvoiceServices = ({ jobId, services, serviceOptions, taxOptions, canEdit }: Props) => {
    const [selectedService, setSelectedService] = useState<EstimateService | null>(null);
    const editModal = useModal();
    const deleteModal = useModal();

    const dispatch = useAppDispatch();

    const handleOpenEdit = useCallback(
        (id: number | string) => {
            setSelectedService(services.find(service => service.id === id) || null);
            editModal.openModal();
        },
        [editModal, services]
    );

    const handleCloseEdit = useCallback(() => {
        setSelectedService(null);
        editModal.closeModal();
    }, [editModal]);

    const handleOpenDelete = useCallback(
        (id: number | string) => {
            setSelectedService(services.find(service => service.id === id) || null);
            deleteModal.openModal();
        },
        [deleteModal, services]
    );

    const handleAddItem = useCallback(() => {
        const initialService = getInitialService();
        dispatch(addService(initialService));
        setSelectedService(initialService);
        editModal.openModal();
    }, [dispatch, editModal]);

    const handleChangeItem = useCallback(
        (service: EstimateService) => {
            if (service.summary && service.itemName) {
                return updateInvoiceService(jobId, hideLocalId(service), taxOptions).then(newService => {
                    dispatch(updateService(isIdLocal(service.id) ? { ...newService, localId: service.id as string } : newService));
                    editModal.closeModal();
                });
            }
            return Promise.resolve();
        },
        [dispatch, editModal, jobId, taxOptions]
    );

    const handleDeleteItem = useCallback(() => {
        if (isNull(selectedService)) return Promise.resolve();
        if (isIdLocal(selectedService.id)) {
            dispatch(deleteService({ id: selectedService.id }));
            return Promise.resolve();
        }

        return deleteInvoiceService(jobId, +selectedService.id, taxOptions).then(prices => {
            dispatch(deleteService({ prices, id: selectedService.id }));
            return;
        });
    }, [dispatch, jobId, taxOptions, selectedService]);

    return (
        <SettingsSection name='Services' count={services.length} canEdit={canEdit} addName='Service item' onAdd={handleAddItem}>
            {canEdit && services.length > 0 && (
                <EstimateEmailOrder
                    orderType='ITEM NAME'
                    list={getTransformedServices(services)}
                    onEdit={handleOpenEdit}
                    onDelete={handleOpenDelete}
                />
            )}
            {editModal.isOpen && !isNull(selectedService) && (
                <Modal isOpen={editModal.isOpen} onClose={handleCloseEdit}>
                    <InvoiceSettingsForm
                        itemData={selectedService}
                        options={serviceOptions}
                        onChange={handleChangeItem}
                        onClose={handleCloseEdit}
                    />
                </Modal>
            )}
            {deleteModal.isOpen && !isNull(selectedService) && (
                <Modal isOpen={deleteModal.isOpen} onClose={handleCloseEdit}>
                    <DeleteModal
                        isOpen={deleteModal.isOpen}
                        onClose={deleteModal.closeModal}
                        onConfirm={handleDeleteItem}
                        itemName={`this Item`}
                    />
                </Modal>
            )}
        </SettingsSection>
    );
};

export default InvoiceServices;
