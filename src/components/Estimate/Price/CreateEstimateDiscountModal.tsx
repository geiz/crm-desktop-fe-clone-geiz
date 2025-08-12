import { useCallback, useState } from 'react';

import DiscountForm from 'components/Estimate/Price/DiscountForm';
import Modal from 'components/Modals/Modal';

import { updateDiscount } from 'services/estimateService';
import { storePrices } from 'store/slices/estimateSlice';
import { useAppDispatch } from 'store/store';
import { DiscountFormValues, TaxOption } from 'types/estimateTypes';

interface Props {
    estimateId: number;
    isOpen: boolean;
    taxOptions: TaxOption[];
    onClose: () => void;
}

const CreateEstimateDiscountModal = ({ estimateId, isOpen, taxOptions, onClose }: Props) => {
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useAppDispatch();

    const handleSubmit = useCallback(
        (formData: DiscountFormValues) => {
            setIsLoading(true);
            updateDiscount(formData, estimateId, taxOptions)
                .then(prices => {
                    dispatch(storePrices(prices));
                    onClose();
                })
                .finally(() => setIsLoading(false));
        },
        [estimateId, taxOptions, onClose, dispatch]
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} closeOnClickOutside={false}>
            <DiscountForm title='Add Discount' isLoading={isLoading} onSubmit={handleSubmit} onClose={onClose} />
        </Modal>
    );
};

export default CreateEstimateDiscountModal;
