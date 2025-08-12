import { useCallback, useState } from 'react';

import DiscountForm from 'components/Estimate/Price/DiscountForm';
import Modal from 'components/Modals/Modal';

import { updateInvoiceDiscount } from 'services/invoiceService';
import { storePrices } from 'store/slices/invoiceSlice';
import { useAppDispatch } from 'store/store';
import { DiscountFormValues, TaxOption } from 'types/estimateTypes';

interface Props {
    jobId: number;
    isOpen: boolean;
    taxOptions: TaxOption[];
    onClose: () => void;
}

const CreateInvoiceDiscountModal = ({ jobId, isOpen, taxOptions, onClose }: Props) => {
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

    return (
        <Modal isOpen={isOpen} onClose={onClose} closeOnClickOutside={false}>
            <DiscountForm title='Add Discount' isLoading={isLoading} onSubmit={handleSubmit} onClose={onClose} />
        </Modal>
    );
};

export default CreateInvoiceDiscountModal;
