import PaymentForm from '../PaymentMethod/PaymentForm';
import { getMaxRefund } from '../constants';
import cn from 'classnames';

import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import DeleteModal from 'components/Modals/DeleteModal';
import Modal from 'components/Modals/Modal';
import Button from 'components/ui/Button';
import Tooltip from 'components/ui/Tooltip';

import useModal from 'hooks/useModal';
import { createRefundPayment, deletePayment } from 'services/invoiceService';
import { storePrices } from 'store/slices/estimateSlice';
import { addRefundPayment, removePayment } from 'store/slices/invoiceSlice';
import { useAppDispatch } from 'store/store';
import { INVOICE_PAYMENT_TYPE, InvoicePayment, PaymentFormValues } from 'types/invoiceTypes';

import styles from './PaymentActions.module.css';

interface PaymentActionsProps {
    rowData: InvoicePayment;
}

const PaymentActions = ({ rowData }: PaymentActionsProps) => {
    const deleteModal = useModal();
    const refundModal = useModal();
    const { jobId } = useParams();
    const dispatch = useAppDispatch();

    const maxRefund = getMaxRefund(rowData);

    const handleRefundPayment = async (data: PaymentFormValues) => {
        if (jobId) {
            return createRefundPayment(data, rowData.id, +jobId)
                .then(resp => {
                    dispatch(addRefundPayment(resp));
                    refundModal.closeModal();
                })
                .catch(err => {
                    toast.error(err.message);
                });
        }
        return Promise.reject();
    };

    const confirmDeletePayment = async () => {
        if (jobId) {
            return deletePayment(rowData.id, +jobId)
                .then(resp => {
                    dispatch(storePrices(resp.prices));
                    dispatch(removePayment({ id: rowData.id, prices: resp.prices }));
                })
                .catch(err => {
                    toast.error(err.message);
                });
        }
        return Promise.reject();
    };

    return (
        <div className={styles.componentsWrap}>
            {maxRefund > 0 && (
                <Tooltip text='Refund'>
                    <Button
                        btnStyle='icon-btn'
                        className={styles.paymentIconButton}
                        aria-label='refund'
                        icon='refund'
                        onClick={refundModal.openModal}
                    />
                </Tooltip>
            )}
            {rowData.type !== INVOICE_PAYMENT_TYPE.CREDIT_CARD && (
                <Tooltip text='Delete'>
                    <Button
                        btnStyle='icon-btn'
                        className={cn(styles.paymentIconButton, styles.deleteButton)}
                        aria-label='delete'
                        icon='trash'
                        onClick={deleteModal.openModal}
                    />
                </Tooltip>
            )}

            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.closeModal}
                itemName={`this Payment${rowData.refunds && rowData.refunds.length > 0 ? ' and all related Refunds' : ''}`}
                onConfirm={confirmDeletePayment}
            />

            <Modal onClose={refundModal.closeModal} isOpen={refundModal.isOpen}>
                <PaymentForm
                    onSubmit={handleRefundPayment}
                    formTitle='Refund Payment'
                    onClose={refundModal.closeModal}
                    amount={maxRefund}
                    submitBtnTitle='Issue Refund'
                    input={null}
                    formStyles={styles.formStyles}
                    isRefund
                />
            </Modal>
        </div>
    );
};

export default PaymentActions;
