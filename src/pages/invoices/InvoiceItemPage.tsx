import cn from 'classnames';
import { Drawer, Loader } from 'rsuite';

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { TitleWithIdentifier } from 'components/@shared/TitleWithIdentifier';
import Block from 'components/Block/Block';
import { InvoicePayments } from 'components/Invoice/InvoicePayments';
import InvoiceSettings from 'components/Invoice/InvoiceSettings';
import PaymentTabs from 'components/Invoice/PaymentMethod/PaymentTabs';
import PersonalInfoSection from 'components/PersonalInfo/PersonalInfoSection';
import SummarySection from 'components/PersonalInfo/SummarySection';
import Button from 'components/ui/Button';
import Dropdown from 'components/ui/Dropdown';

import { INVOICE_ENDPOINTS } from 'constants/endpoints';
import { useDidMount } from 'hooks/useDidMount';
import { getInvoiceById } from 'services/invoiceService';
import { parametrizeURL } from 'services/utils';
import { clearInvoiceInfo, storeInvoice } from 'store/slices/invoiceSlice';
import { useAppDispatch, useAppSelector } from 'store/store';
import { InvoiceEntity } from 'types/invoiceTypes';
import downloadPdf from 'utils/downloadPdf';
import formatPriceValue from 'utils/formatPriceValue';

import styles from './InvoiceItemPage.module.css';

import 'rsuite/dist/rsuite-no-reset.min.css';

const InvoiceItemPage = () => {
    const { jobId } = useParams();
    const dispatch = useAppDispatch();
    const invoiceInfo = useAppSelector(state => state.invoice.invoiceInfo);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isPaymentFormOpen, setIsPaymentFormOpen] = useState<boolean>(false);

    const toggleDrawer = () => setIsPaymentFormOpen(prev => !prev);

    useDidMount(
        () => {
            if (jobId && invoiceInfo === null) {
                setIsLoading(true);
                getInvoiceById(+jobId)
                    .then(response => dispatch(storeInvoice(response as InvoiceEntity)))
                    .finally(() => setIsLoading(false));
            }
        },
        () => {
            dispatch(clearInvoiceInfo());
        }
    );

    const invoiceActionsOptions = [
        { label: 'Cancel Invoice', onClick: () => toast.info('function not implemented') },
        {
            label: 'Save as PDF',
            onClick: () => downloadPdf(parametrizeURL(INVOICE_ENDPOINTS.savePdf, { jobId: String(jobId) }), `Invoice_job_${jobId}`)
        }
    ];

    if (isLoading) {
        return <Loader center size='lg' />;
    }

    if (invoiceInfo === null) {
        return null;
    }

    return (
        <section className={styles.content}>
            <div className={styles.header}>
                <TitleWithIdentifier name='Invoice ID' identifier={invoiceInfo.id} />
                {invoiceInfo.prices && (
                    <div className={styles.summary}>
                        <span className={cn(styles.label, 'body-14M')}>Total:</span>
                        <span className={cn(styles.value, 'body-14M')}>{formatPriceValue(invoiceInfo.prices?.total)}</span>
                        <span className={cn(styles.label, 'body-14M')}>Paid:</span>
                        <span className={cn(styles.value, 'body-14M')}>{formatPriceValue(invoiceInfo.prices?.amountPaid)}</span>
                        <span className={cn(styles.label, 'body-14M')}>Outstanding Balance:</span>
                        <span className={cn(styles.value, 'body-14M')}>{formatPriceValue(invoiceInfo.prices?.balance)}</span>
                    </div>
                )}
                <Button
                    btnStyle='blue-l'
                    icon='plus'
                    disabled={invoiceInfo.prices?.total === 0}
                    onClick={toggleDrawer}
                    className={styles.collectBtn}>
                    Collect Payment
                </Button>
                <Dropdown
                    className={styles.jobActionsDropdown}
                    trigger={
                        <Button className={cn(styles.jobActionsBtn, 'body-14M')}>
                            Invoice Actions
                            <i className={cn(styles.avatarIcon, 'icon-drop-down')} />
                        </Button>
                    }
                    options={invoiceActionsOptions}
                />
            </div>
            <div className={styles.contentWrapper}>
                <div className={styles.leftSide}>
                    <SummarySection createdAt={invoiceInfo.createdAt} jobId={invoiceInfo.jobId} />
                    <Block className={cn(styles.personalInfo)}>
                        <PersonalInfoSection name='contact' section={invoiceInfo.client} />
                        <PersonalInfoSection name='billing' section={invoiceInfo.billing} />
                    </Block>
                </div>
                <div className={styles.mainContentWrapper}>
                    {!!invoiceInfo.payments?.length && <InvoicePayments list={invoiceInfo.payments || []} />}
                    <InvoiceSettings info={invoiceInfo} />
                </div>
            </div>

            <Drawer open={isPaymentFormOpen} onClose={toggleDrawer} placement='right' size='48.6rem'>
                <div className={styles.drawerContent}>
                    <p className={cn('h-16B', styles.paymentTitle)}>Payment Method</p>
                    <PaymentTabs closeDrawer={toggleDrawer} />
                </div>
            </Drawer>
        </section>
    );
};

export default InvoiceItemPage;
