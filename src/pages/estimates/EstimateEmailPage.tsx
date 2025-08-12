import cn from 'classnames';
import html2canvas from 'html2canvas';
import { jsPDF as JsPDF } from 'jspdf';
import { Loader } from 'rsuite';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import EstimateEmailPreview from 'components/Estimate/Email/EstimateEmailPreview';
import EstimateNotificationSendTo from 'components/Estimate/Email/EstimateNotificationSendTo';
import DeleteModal from 'components/Modals/DeleteModal';

import { ESTIMATE_ENDPOINTS } from 'constants/endpoints';
import { APP_ROUTES } from 'constants/routes';
import { useDidMount } from 'hooks/useDidMount';
import useModal from 'hooks/useModal';
import { parametrizeRouterURL } from 'routes/utils';
import { createEstimateNotify, getEstimateNotify } from 'services/estimateService';
import { parametrizeURL } from 'services/utils';
import { EstimateEmailResponse } from 'types/estimateTypes';
import downloadPdf from 'utils/downloadPdf';

import styles from './EstimateEmailPage.module.css';

const EstimateEmailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isOpen, openModal, closeModal } = useModal();
    const emailPreviewRef = useRef<HTMLDivElement>(null);

    const [emailInfo, setEmailInfo] = useState<EstimateEmailResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [createIsLoading, setCreateIsLoading] = useState(false);

    const emails = useMemo(() => (emailInfo ? [...new Set([emailInfo.client.email, emailInfo.client.billing.email])] : []), [emailInfo]);
    const phones = useMemo(() => {
        if (!emailInfo) return [];

        const phoneNumbers = [emailInfo.client.phone, emailInfo.client.billing.phone]
            .filter(phone => phone != null && phone !== 0)
            .map(phone => String(phone));

        return [...new Set(phoneNumbers)];
    }, [emailInfo]);

    const handleSend = useCallback(
        async (data: { emails: string[]; phones: string[] }) => {
            const docPreview = emailPreviewRef.current;
            if (docPreview && id && emailInfo?.jobId) {
                try {
                    setCreateIsLoading(true);

                    // Generate PDF only for email sending
                    let pdf = '';
                    if (data.emails.length > 0) {
                        const { width, height } = docPreview.getBoundingClientRect();
                        const doc = new JsPDF('p', 'px', [width, height]);
                        await document.fonts.ready;
                        const canvas = await html2canvas(docPreview, {
                            scale: 1,
                            useCORS: true
                        });
                        const updatedTemplateImage = canvas.toDataURL('image/png');

                        doc.addImage(updatedTemplateImage, 'PNG', 0, 0, width, height);

                        const base64 = await doc.output('datauristring');
                        pdf = base64.replace('filename=generated.pdf;', '');
                    }

                    await createEstimateNotify(
                        {
                            emails: data.emails,
                            phones: data.phones,
                            pdf: pdf || undefined
                        },
                        id
                    );
                    navigate(parametrizeRouterURL(APP_ROUTES.estimates.notificationSuccess, { id: `${emailInfo.jobId}` }));
                } finally {
                    setCreateIsLoading(false);
                }
            }
        },
        [emailPreviewRef, id, emailInfo, navigate]
    );

    useDidMount(() => {
        if (id) {
            setIsLoading(true);
            getEstimateNotify(+id)
                .then(setEmailInfo)
                .finally(() => setIsLoading(false));
        }
    });

    const handleCancel = useCallback(() => {
        navigate(-1);
        return Promise.resolve();
    }, [navigate]);

    const handleSavePdf = useCallback(() => {
        downloadPdf(parametrizeURL(ESTIMATE_ENDPOINTS.savePdf, { estimateId: String(id) }), `Estimate_${id}`);
    }, [id]);

    if (isLoading) {
        return <Loader center size='lg' />;
    }

    if (emailInfo === null) {
        return null;
    }

    return (
        <section className={styles.content}>
            <h1 className={cn('h-20B', styles.title)}>Email Estimate</h1>
            <div className={styles.mainContent}>
                <EstimateEmailPreview ref={emailPreviewRef} emailInfo={emailInfo} type='Estimate' onSave={handleSavePdf} />

                <EstimateNotificationSendTo
                    isLoading={createIsLoading}
                    emails={emails}
                    phones={phones}
                    type='Estimate'
                    onSend={handleSend}
                    onCancel={openModal}
                />
            </div>
            <DeleteModal isOpen={isOpen} onClose={closeModal} onConfirm={handleCancel} itemName='this changes and go back' />
        </section>
    );
};

export default EstimateEmailPage;
