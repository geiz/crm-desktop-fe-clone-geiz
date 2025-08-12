import { useCallback, useMemo, useState } from 'react';

import DiscountForm from 'components/Estimate/Price/DiscountForm';
import Modal from 'components/Modals/Modal';

import { updateInvoiceDiscount } from 'services/invoiceService';
import { storePrices } from 'store/slices/invoiceSlice';
import { useAppDispatch } from 'store/store';
import { DISCOUNT_TYPE, Discount, DiscountFormValues, TaxOption } from 'types/estimateTypes';

interface Props {
    discountInfo: Discount;
    jobId: number;
    isOpen: boolean;
    taxOptions: TaxOption[];
    onClose: () => void;
}

const EditInvoiceDiscountModal = ({ jobId, discountInfo, isOpen, taxOptions, onClose }: Props) => {
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useAppDispatch();

    const handleSubmit = useCallback(
        (formData: DiscountFormValues) => {
            setIsLoading(true);
            updateInvoiceDiscount(formData, jobId, taxOptions)
                .then(prices => {
                    dispatch(storePrices(prices));
                    onClose();
                })
                .finally(() => setIsLoading(false));
        },
        [jobId, taxOptions, onClose, dispatch]
    );

    const initialValues: DiscountFormValues = useMemo(
        () => ({
            type: discountInfo?.type || DISCOUNT_TYPE.PERCENTAGE,
            amount: discountInfo?.amount.toString(),
            description: discountInfo?.description || ''
        }),
        [discountInfo]
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} closeOnClickOutside={false}>
            <DiscountForm title='Edit Discount' values={initialValues} isLoading={isLoading} onSubmit={handleSubmit} onClose={onClose} />
        </Modal>
    );
};

export default EditInvoiceDiscountModal;
