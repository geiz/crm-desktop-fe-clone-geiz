import EstimatePriceDiscount from './EstimatePriceDiscount';

import { useCallback } from 'react';

import PricesSection from 'components/Estimate/Price/PricesSection';

import { updateEstimateTax } from 'services/estimateService';
import { storePrices } from 'store/slices/estimateSlice';
import { useAppDispatch } from 'store/store';
import { ItemPrices, TaxOption } from 'types/estimateTypes';

interface Props {
    canEdit: boolean;
    prices: ItemPrices;
    estimateId: number;
    taxOptions: TaxOption[];
}

const EstimatePrice = ({ estimateId, prices, taxOptions, canEdit }: Props) => {
    const dispatch = useAppDispatch();

    const handleTaxSelect = useCallback(
        (id: number) =>
            updateEstimateTax(id, estimateId, taxOptions).then(prices => {
                dispatch(storePrices(prices));
            }),
        [dispatch, estimateId, taxOptions]
    );

    return (
        <PricesSection canEdit={canEdit} prices={prices} taxOptions={taxOptions} onTaxChange={handleTaxSelect}>
            <EstimatePriceDiscount estimateId={estimateId} prices={prices} canEdit={canEdit} taxOptions={taxOptions} />
        </PricesSection>
    );
};

export default EstimatePrice;
