import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import EstimateMaterials from 'components/Estimate/Materials';
import EstimatePrice from 'components/Estimate/Price';
import EstimateServices from 'components/Estimate/Services';
import { ServicesAndMaterials } from 'components/Estimate/ServicesAndMaterials';

import { APP_ROUTES } from 'constants/routes';
import { parametrizeRouterURL } from 'routes/utils';
import { ESTIMATE_STATUS, EstimateEntity } from 'types/estimateTypes';

interface Props {
    info: EstimateEntity;
}

const EstimateSettings = ({ info }: Props) => {
    const navigate = useNavigate();

    const handleGoToEmailEstimate = useCallback(() => {
        navigate(parametrizeRouterURL(APP_ROUTES.estimates.email, { id: `${info.id}` }));
    }, [navigate, info]);

    const canGoToEmailEstimate = useMemo(
        () => [...info.services, ...info.materials].some(({ summary }) => !!summary) && !!info.prices?.tax,
        [info]
    );

    const canEdit = useMemo(() => info.status === ESTIMATE_STATUS.DRAFT, [info.status]);

    return (
        <ServicesAndMaterials
            canEdit={canEdit}
            priceComponent={<EstimatePrice canEdit={canEdit} estimateId={info.id} prices={info.prices} taxOptions={info.taxesOptions} />}
            isSubmitDisabled={!canGoToEmailEstimate}
            submitButtonText={canEdit ? 'Email Estimate' : 'Resend Estimate'}
            onSubmit={handleGoToEmailEstimate}>
            <EstimateServices
                canEdit={canEdit}
                estimateId={info.id}
                services={info.services}
                serviceOptions={info.serviceOptions}
                taxOptions={info.taxesOptions}
            />
            <EstimateMaterials
                canEdit={canEdit}
                estimateId={info.id}
                materials={info.materials}
                materialOptions={info.materialOptions}
                taxOptions={info.taxesOptions}
            />
        </ServicesAndMaterials>
    );
};

export default EstimateSettings;
