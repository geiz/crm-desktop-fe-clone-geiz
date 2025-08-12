import { useCallback } from 'react';

import PricesSection from 'components/Estimate/Price/PricesSection';
import InvoicePriceDiscount from 'components/Invoice/Price/InvoicePriceDiscount';

import { updateInvoiceTax } from 'services/invoiceService';
import { storePrices } from 'store/slices/invoiceSlice';
import { useAppDispatch } from 'store/store';
import { ItemPrices, TaxOption } from 'types/estimateTypes';

interface Props {
    canEdit: boolean;
    prices: ItemPrices;
    jobId: number;
    taxOptions: TaxOption[];
}

const InvoicePrice = ({ jobId, prices, taxOptions, canEdit }: Props) => {
    const dispatch = useAppDispatch();

    const handleTaxSelect = useCallback(
        (id: number) =>
            updateInvoiceTax(id, jobId, taxOptions).then(prices => {
                dispatch(storePrices(prices));
            }),
        [dispatch, jobId, taxOptions]
    );

    return (
        <PricesSection canEdit={canEdit} prices={prices} taxOptions={taxOptions} onTaxChange={handleTaxSelect}>
            <InvoicePriceDiscount jobId={jobId} prices={prices} canEdit={canEdit} taxOptions={taxOptions} />
        </PricesSection>
    );
};

export default InvoicePrice;
