import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { editPayment } from 'services/invoiceService';
import { updatePayment } from 'store/slices/invoiceSlice';
import { useAppDispatch } from 'store/store';
import { InvoiceEntity, InvoicePayment, PaymentFormValues } from 'types/invoiceTypes';

export interface UseUpdatePaymentReturn {
    handleUpdatePayment: (data: Partial<PaymentFormValues>) => void;
    isLoading: boolean;
}

const useUpdatePayment = (rowData: InvoicePayment, closeEditPopover?: () => void) => {
    const { jobId } = useParams();
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(false);

    const handleUpdatePayment = (data: Partial<PaymentFormValues>) => {
        if (jobId) {
            setIsLoading(true);
            editPayment(data, rowData.id, +jobId)
                .then((resp: { payment: InvoicePayment; prices: InvoiceEntity['prices'] }) => {
                    dispatch(updatePayment(resp));
                    toast.success('Saved!');
                    if (closeEditPopover) closeEditPopover();
                })
                .catch(err => toast.error(err.message))
                .finally(() => setIsLoading(false));
        }
    };

    return { handleUpdatePayment, isLoading };
};

export default useUpdatePayment;
