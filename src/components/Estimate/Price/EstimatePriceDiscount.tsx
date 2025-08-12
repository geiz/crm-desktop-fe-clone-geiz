import { useCallback } from 'react';

import CreateDiscountModal from 'components/Estimate/Price/CreateEstimateDiscountModal';
import EditDiscountModal from 'components/Estimate/Price/EditEstimateDiscountModal';
import PriceDiscountLayout from 'components/Estimate/Price/PriceDiscountLayout';

import useModal from 'hooks/useModal';
import { deleteDiscount } from 'services/estimateService';
import { storePrices } from 'store/slices/estimateSlice';
import { useAppDispatch } from 'store/store';
import { ItemPrices, TaxOption } from 'types/estimateTypes';

interface Props {
    prices: ItemPrices;
    estimateId: number;
    canEdit: boolean;
    taxOptions: TaxOption[];
}

const EstimatePriceDiscount = ({ estimateId, prices, canEdit, taxOptions }: Props) => {
    const createDiscountModal = useModal();
    const editDiscountModal = useModal();
    const confirmDeleteModal = useModal();

    const dispatch = useAppDispatch();

    const handleDeleteConfirm = useCallback(
        () =>
            deleteDiscount(estimateId, taxOptions).then(updatedPrices => {
                dispatch(storePrices(updatedPrices));
                confirmDeleteModal.closeModal();
            }),
        [confirmDeleteModal, taxOptions, dispatch, estimateId]
    );

    return (
        <div>
            <PriceDiscountLayout
                prices={prices}
                canEdit={canEdit}
                onCreate={createDiscountModal.openModal}
                onEdit={editDiscountModal.openModal}
                onDelete={handleDeleteConfirm}
            />
            <CreateDiscountModal
                estimateId={estimateId}
                isOpen={createDiscountModal.isOpen}
                taxOptions={taxOptions}
                onClose={createDiscountModal.closeModal}
            />
            <EditDiscountModal
                estimateId={estimateId}
                discountInfo={prices?.discount}
                isOpen={editDiscountModal.isOpen}
                taxOptions={taxOptions}
                onClose={editDiscountModal.closeModal}
            />
        </div>
    );
};

export default EstimatePriceDiscount;
