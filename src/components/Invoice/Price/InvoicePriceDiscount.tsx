import { useCallback } from 'react';

import PriceDiscountLayout from 'components/Estimate/Price/PriceDiscountLayout';
import CreateDiscountModal from 'components/Invoice/Price/CreateInvoiceDiscountModal';
import EditDiscountModal from 'components/Invoice/Price/EditInvoiceDiscountModal';

import useModal from 'hooks/useModal';
import { deleteInvoiceDiscount } from 'services/invoiceService';
import { storePrices } from 'store/slices/invoiceSlice';
import { useAppDispatch } from 'store/store';
import { ItemPrices, TaxOption } from 'types/estimateTypes';

interface Props {
    prices: ItemPrices;
    jobId: number;
    canEdit: boolean;
    taxOptions: TaxOption[];
}

const InvoicePriceDiscount = ({ jobId, prices, canEdit, taxOptions }: Props) => {
    const createDiscountModal = useModal();
    const editDiscountModal = useModal();
    const confirmDeleteModal = useModal();

    const dispatch = useAppDispatch();

    const handleDeleteConfirm = useCallback(
        () =>
            deleteInvoiceDiscount(jobId, taxOptions).then(updatedPrices => {
                dispatch(storePrices(updatedPrices));
                confirmDeleteModal.closeModal();
            }),
        [confirmDeleteModal, taxOptions, dispatch, jobId]
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
                jobId={jobId}
                isOpen={createDiscountModal.isOpen}
                taxOptions={taxOptions}
                onClose={createDiscountModal.closeModal}
            />
            <EditDiscountModal
                jobId={jobId}
                discountInfo={prices?.discount}
                isOpen={editDiscountModal.isOpen}
                taxOptions={taxOptions}
                onClose={editDiscountModal.closeModal}
            />
        </div>
    );
};

export default InvoicePriceDiscount;
