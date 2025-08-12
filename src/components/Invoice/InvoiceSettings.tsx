import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { ServicesAndMaterials } from 'components/Estimate/ServicesAndMaterials';
import InvoiceMaterials from 'components/Invoice/Materials';
import InvoicePrice from 'components/Invoice/Price/InvoicePrice';
import InvoiceServices from 'components/Invoice/Services';

import { APP_ROUTES } from 'constants/routes';
import { parametrizeRouterURL } from 'routes/utils';
import { InvoiceEntity } from 'types/invoiceTypes';

interface Props {
    info: InvoiceEntity;
}

const InvoiceSettings = ({ info }: Props) => {
    const navigate = useNavigate();

    const handleGoToEmailInvoice = useCallback(() => {
        navigate(parametrizeRouterURL(APP_ROUTES.jobs.invoiceEmail, { jobId: `${info.jobId}` }));
    }, [navigate, info]);

    const canGoToEmailInvoice = useMemo(
        () => [...info.services, ...info.materials].some(({ summary }) => !!summary) && !!info.prices?.tax,
        [info]
    );

    return (
        <ServicesAndMaterials
            canEdit
            isSubmitDisabled={!canGoToEmailInvoice}
            submitButtonText={'Email Invoice'}
            priceComponent={<InvoicePrice canEdit jobId={info.jobId} prices={info.prices} taxOptions={info.taxesOptions} />}
            onSubmit={handleGoToEmailInvoice}>
            <InvoiceServices
                canEdit
                jobId={info.jobId}
                services={info.services}
                serviceOptions={info.serviceOptions}
                taxOptions={info.taxesOptions}
            />
            <InvoiceMaterials
                canEdit
                jobId={info.jobId}
                materials={info.materials}
                materialOptions={info.materialOptions}
                taxOptions={info.taxesOptions}
            />
        </ServicesAndMaterials>
    );
};

export default InvoiceSettings;
