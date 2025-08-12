import { paymentTabsData } from '../constants';
import PaymentForm from './PaymentForm';
import cn from 'classnames';
import { Loader } from 'rsuite';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { PaymentByCardForm } from 'components/Invoice/PaymentMethod/PaymentByCardForm.js';

import { createPayment, getCreditCardCredentials } from 'services/invoiceService';
import { addPayment } from 'store/slices/invoiceSlice';
import { useAppDispatch, useAppSelector } from 'store/store';
import { InvoiceEntity, PaymentFormValues, PaymentTabsData } from 'types/invoiceTypes';

import styles from './PaymentTabs.module.css';

interface PaymentTabs {
    closeDrawer: () => void;
}

const PaymentTabs: React.FC<PaymentTabs> = ({ closeDrawer }) => {
    const { jobId } = useParams();
    const dispatch = useAppDispatch();
    const tabsRef = useRef<HTMLUListElement | null>(null);
    const { prices, billing, clientCards } = useAppSelector(state => state.invoice.invoiceInfo as InvoiceEntity);
    const [activeTab, setActiveTab] = useState<PaymentTabsData>(paymentTabsData[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [lineStyle, setLineStyle] = useState<Record<string, string>>({ width: '0px', transform: 'translateX(0px)' });
    const [clientSecret, setClientSecret] = useState('');
    const [currentAmount, setCurrentAmount] = useState(0);

    useEffect(() => {
        const tabsContainer = tabsRef.current;
        if (!tabsContainer) return;

        const activeTabElement = tabsContainer.querySelector(`.${styles.active}`) as HTMLElement;
        if (activeTabElement) {
            setLineStyle({
                width: `${activeTabElement.offsetWidth}px`,
                transform: `translateX(${activeTabElement.offsetLeft}px)`
            });
        }
    }, [activeTab]);

    const onSubmit = (data: PaymentFormValues) => {
        if (jobId) {
            setIsLoading(true);

            if (activeTab.name === 'Card') {
                setCurrentAmount(+data.amount);
                return getCreditCardCredentials({ amount: +data.amount, note: data.note }, jobId, data.paymentCardId)
                    .then(resp => {
                        if (resp.clientSecret === 'PAID') {
                            window.location.reload();
                        }
                        setClientSecret(resp.clientSecret);
                    })
                    .catch(err => toast.error(err.message))
                    .finally(() => setIsLoading(false));
            }

            createPayment(data, activeTab, Number(jobId))
                .then(resp => {
                    dispatch(addPayment(resp));
                    closeDrawer();
                })
                .catch(err => toast.error(err.message))
                .finally(() => setIsLoading(false));
        }
    };

    const handleChangeAmount = useCallback(() => {
        setClientSecret('');
    }, []);

    return (
        <>
            <ul className={styles.tabs} role='tablist' ref={tabsRef}>
                {paymentTabsData.map(tab => (
                    <li
                        key={tab.name}
                        role='tab'
                        aria-selected={tab.name === activeTab.name}
                        className={cn(styles.tab, 'body-14M', {
                            [styles.active]: tab.name === activeTab.name,
                            [styles.disabled]: tab.disabled
                        })}
                        onClick={tab.disabled ? undefined : () => setActiveTab(tab)}>
                        {tab.name}
                    </li>
                ))}
                <li className={styles.line} style={lineStyle} />
            </ul>
            {clientSecret && activeTab.name === 'Card'
                ? jobId && (
                      <PaymentByCardForm
                          clientSecret={clientSecret}
                          jobId={jobId.toString()}
                          amount={currentAmount}
                          onCancel={closeDrawer}
                          onChangeAmount={handleChangeAmount}
                      />
                  )
                : prices &&
                  billing && (
                      <PaymentForm
                          input={activeTab.input}
                          amount={prices.balance > 0 ? prices.balance : 0}
                          //zipCode={billing.address.zipCode}
                          clientCards={activeTab.name === 'Card' ? clientCards : undefined}
                          onSubmit={onSubmit}
                          onClose={closeDrawer}
                          submitBtnTitle='Charge'
                          isCard={activeTab.name === 'Card'}
                      />
                  )}

            {isLoading && <Loader center size='lg' />}
        </>
    );
};

export default PaymentTabs;
