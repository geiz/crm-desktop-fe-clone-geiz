import cn from 'classnames';
import html2canvas from 'html2canvas';
import { jsPDF as JsPDF } from 'jspdf';
import { Loader } from 'rsuite';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import EstimateEmailPreview from 'components/Estimate/Email/EstimateEmailPreview';
import EstimateNotificationSendTo from 'components/Estimate/Email/EstimateNotificationSendTo';
import DeleteModal from 'components/Modals/DeleteModal';

import { INVOICE_ENDPOINTS } from 'constants/endpoints';
import { APP_ROUTES } from 'constants/routes';
import { useDidMount } from 'hooks/useDidMount';
import useModal from 'hooks/useModal';
import { parametrizeRouterURL } from 'routes/utils';
import { createInvoiceNotify, getInvoiceNotify } from 'services/invoiceService';
import { parametrizeURL } from 'services/utils';
import { EstimateEmailResponse } from 'types/estimateTypes';
import downloadPdf from 'utils/downloadPdf';

import styles from './InvoiceEmailPage.module.css';

const InvoiceEmailPage = () => {
    const emailPreviewRef = useRef<HTMLDivElement>(null);
    const { isOpen, openModal, closeModal } = useModal();
    const { jobId } = useParams();
    const navigate = useNavigate();

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
            if (docPreview && jobId) {
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

                        const base64 = await doc.output('datauristring', { filename: `email_invoice.pdf` });
                        pdf = base64.split('base64,')[1];
                    }

                    await createInvoiceNotify(
                        {
                            emails: data.emails,
                            phones: data.phones,
                            pdf: pdf || undefined
                        },
                        jobId
                    );
                    navigate(parametrizeRouterURL(APP_ROUTES.jobs.invoiceNotificationSuccess, { jobId }));
                } finally {
                    setCreateIsLoading(false);
                }
            }
        },
        [emailPreviewRef, jobId, navigate]
    );

    useDidMount(() => {
        if (jobId) {
            setIsLoading(true);
            getInvoiceNotify(+jobId)
                .then(setEmailInfo)
                .finally(() => setIsLoading(false));
        }
    });

    const handleCancel = useCallback(() => {
        navigate(-1);
        return Promise.resolve();
    }, [navigate]);

    const handleSavePdf = useCallback(() => {
        downloadPdf(parametrizeURL(INVOICE_ENDPOINTS.savePdf, { jobId: String(jobId) }), `Invoice_job_${jobId}`);
    }, [jobId]);

    if (isLoading) {
        return <Loader center size='lg' />;
    }

    if (emailInfo === null) {
        return null;
    }

    return (
        <section className={styles.content}>
            <h1 className={cn('h-20B', styles.title)}>Email Invoice</h1>
            <div className={styles.mainContent}>
                <EstimateEmailPreview ref={emailPreviewRef} emailInfo={emailInfo} type='Invoice' onSave={handleSavePdf} />
                <EstimateNotificationSendTo
                    isLoading={createIsLoading}
                    emails={emails}
                    phones={phones}
                    type='Invoice'
                    onSend={handleSend}
                    onCancel={openModal}
                />
            </div>
            <DeleteModal isOpen={isOpen} onClose={closeModal} onConfirm={handleCancel} itemName='this changes and go back' />
        </section>
    );
};

export default InvoiceEmailPage;
