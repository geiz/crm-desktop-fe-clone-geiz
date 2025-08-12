import cn from 'classnames';

import { useCallback } from 'react';

import DeleteModal from 'components/Modals/DeleteModal';
import Button from 'components/ui/Button';

import useModal from 'hooks/useModal';
import { DISCOUNT_TYPE, ItemPrices } from 'types/estimateTypes';

import styles from './PriceDiscountLayout.module.css';

interface Props {
    prices: ItemPrices;
    canEdit: boolean;
    onCreate: () => void;
    onEdit: () => void;
    onDelete: () => Promise<void>;
}

const PriceDiscountLayout = ({ prices, canEdit, onCreate, onEdit, onDelete }: Props) => {
    const confirmDeleteModal = useModal();

    const handleDeleteConfirm = useCallback(
        () =>
            onDelete().then(() => {
                confirmDeleteModal.closeModal();
            }),
        [confirmDeleteModal, onDelete]
    );

    return (
        <div>
            <div className={styles.flexBlock}>
                {!canEdit && (
                    <div className={styles.discountActionsRow}>
                        <div className={styles.discountActions}>
                            <p className={cn('body-14M', styles.title, styles.discountTitle)}>Discount</p>
                        </div>
                        {prices.discount.amount > 0 && prices.discount.type === DISCOUNT_TYPE.PERCENTAGE && (
                            <p className={cn('body-14M', styles.discountValue)}>(-{prices.discount.amount}%)</p>
                        )}
                    </div>
                )}
                {!!prices?.discount.amount && canEdit && (
                    <div className={styles.discountActionsRow}>
                        <div className={styles.discountActions}>
                            <p className={cn('body-14M', styles.title, styles.discountTitle)}>Discount</p>
                            <Button btnStyle='icon-btn' className={styles.iconButton} icon='edit' onClick={onEdit} />
                            <Button btnStyle='icon-btn' className={styles.iconButton} icon='trash' onClick={confirmDeleteModal.openModal} />
                        </div>
                        {prices.discount.amount > 0 && prices.discount.type === DISCOUNT_TYPE.PERCENTAGE && (
                            <p className={cn('body-14M', styles.discountValue)}>(-{prices.discount.amount}%)</p>
                        )}
                    </div>
                )}
                {!prices?.discount.amount && canEdit && (
                    <Button btnStyle='text-btn-m' className={styles.btn} icon='plus-square' onClick={onCreate}>
                        Discount
                    </Button>
                )}
                <p className={cn('body-14M', styles.price)}>
                    {prices?.discount.value > 0 ? '-' : ''}${(prices?.discount.value || 0).toFixed(2)}
                </p>
            </div>
            <div className={styles.flexBlock}>
                {prices?.discount.description && (
                    <p className={cn('body-12R', styles.discountDescription)}>{prices.discount.description}</p>
                )}
                <div className={styles.price} />
            </div>
            <DeleteModal
                isOpen={confirmDeleteModal.isOpen}
                onClose={confirmDeleteModal.closeModal}
                onConfirm={handleDeleteConfirm}
                itemName='this discount'
            />
        </div>
    );
};

export default PriceDiscountLayout;
