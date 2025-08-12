import { isNull } from 'lodash';

import { useCallback, useState } from 'react';

import EstimateEmailOrder from 'components/Estimate/Email/EstimateEmailOrder';
import { getInitialMaterial, getTransformedMaterials } from 'components/Estimate/Materials/utils';
import SettingsSection from 'components/Estimate/SettingsSection';
import InvoiceSettingsForm from 'components/Invoice/InvoiceSettingsForm';
import DeleteModal from 'components/Modals/DeleteModal';
import Modal from 'components/Modals/Modal';

import useModal from 'hooks/useModal';
import { deleteInvoiceMaterial, updateInvoiceMaterial } from 'services/invoiceService';
import { addMaterial, deleteMaterial, updateMaterial } from 'store/slices/invoiceSlice';
import { useAppDispatch } from 'store/store';
import { EstimateMaterial, MaterialOption, TaxOption } from 'types/estimateTypes';
import { hideLocalId, isIdLocal } from 'utils/hideLocalId';

interface Props {
    materials: EstimateMaterial[];
    jobId: number;
    materialOptions: MaterialOption[];
    taxOptions: TaxOption[];
    canEdit: boolean;
}

const InvoiceMaterials = ({ jobId, materials, materialOptions, taxOptions, canEdit }: Props) => {
    const [selectedMaterial, setSelectedMaterial] = useState<EstimateMaterial | null>(null);
    const editModal = useModal();
    const deleteModal = useModal();

    const dispatch = useAppDispatch();

    const handleOpenEdit = useCallback(
        (id: number | string) => {
            setSelectedMaterial(materials.find(material => material.id === id) || null);
            editModal.openModal();
        },
        [editModal, materials]
    );

    const handleCloseEdit = useCallback(() => {
        setSelectedMaterial(null);
        editModal.closeModal();
    }, [editModal]);

    const handleOpenDelete = useCallback(
        (id: number | string) => {
            setSelectedMaterial(materials.find(material => material.id === id) || null);
            deleteModal.openModal();
        },
        [deleteModal, materials]
    );

    const handleAddItem = useCallback(() => {
        const initialMaterial = getInitialMaterial();
        setSelectedMaterial(initialMaterial);
        editModal.openModal();
        dispatch(addMaterial(initialMaterial));
    }, [dispatch, editModal]);

    const handleChangeItem = useCallback(
        (material: EstimateMaterial) => {
            if (material.summary && material.itemName) {
                return updateInvoiceMaterial(jobId, hideLocalId(material), taxOptions).then(newMaterial => {
                    dispatch(updateMaterial(isIdLocal(material.id) ? { ...newMaterial, localId: material.id as string } : newMaterial));
                    editModal.closeModal();
                });
            }
            return Promise.resolve();
        },
        [dispatch, editModal, jobId, taxOptions]
    );

    const handleDeleteItem = useCallback(() => {
        if (isNull(selectedMaterial)) return Promise.resolve();
        if (isIdLocal(selectedMaterial.id)) {
            dispatch(deleteMaterial({ id: selectedMaterial.id }));
            return Promise.resolve();
        }
        return deleteInvoiceMaterial(jobId, selectedMaterial.id, taxOptions).then(prices => {
            dispatch(deleteMaterial({ prices, id: selectedMaterial.id }));
            return;
        });
    }, [dispatch, jobId, selectedMaterial, taxOptions]);

    return (
        <SettingsSection name='Materials' count={materials.length} canEdit={canEdit} addName='Material item' onAdd={handleAddItem}>
            {canEdit && materials.length > 0 && (
                <EstimateEmailOrder
                    orderType='ITEM NAME'
                    list={getTransformedMaterials(materials)}
                    onEdit={handleOpenEdit}
                    onDelete={handleOpenDelete}
                />
            )}
            {editModal.isOpen && !isNull(selectedMaterial) && (
                <Modal isOpen={editModal.isOpen} onClose={handleCloseEdit}>
                    <InvoiceSettingsForm
                        itemData={selectedMaterial}
                        options={materialOptions}
                        onChange={handleChangeItem}
                        onClose={handleCloseEdit}
                    />
                </Modal>
            )}
            {deleteModal.isOpen && !isNull(selectedMaterial) && (
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

export default InvoiceMaterials;
