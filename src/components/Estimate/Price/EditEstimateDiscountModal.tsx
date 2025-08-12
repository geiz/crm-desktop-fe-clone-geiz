import DiscountForm from './DiscountForm';

import { useCallback, useMemo, useState } from 'react';

import Modal from 'components/Modals/Modal';

import { updateDiscount } from 'services/estimateService';
import { storePrices } from 'store/slices/estimateSlice';
import { useAppDispatch } from 'store/store';
import { DISCOUNT_TYPE, Discount, DiscountFormValues, TaxOption } from 'types/estimateTypes';

interface Props {
    discountInfo: Discount;
    estimateId: number;
    isOpen: boolean;
    taxOptions: TaxOption[];
    onClose: () => void;
}

const EditEstimateDiscountModal = ({ estimateId, discountInfo, isOpen, taxOptions, onClose }: Props) => {
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

export default EditEstimateDiscountModal;
