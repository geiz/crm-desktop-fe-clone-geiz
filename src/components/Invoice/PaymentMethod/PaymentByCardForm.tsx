import { AddressElement, Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeAddressElementOptions, StripeElementsOptions, StripePaymentElementOptions, loadStripe } from '@stripe/stripe-js';
import cn from 'classnames';
import { Loader } from 'rsuite';

import { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { PaymentByCardDeclinedModal } from 'components/Invoice/PaymentMethod/PaymentByCardDeclinedModal';
import { getCountryAbbreviation, getStateAbbreviation } from 'components/Invoice/PaymentMethod/utils';
import Button from 'components/ui/Button';

import { APP_ROUTES } from 'constants/routes';
import useModal from 'hooks/useModal';
import { parametrizeRouterURL } from 'routes/utils';
import { useAppSelector } from 'store/store';
import formatPriceValue from 'utils/formatPriceValue';
import { getEnv } from 'utils/getEnv';

import styles from './PaymentByCardForm.module.css';

const stripePromise = loadStripe(`${getEnv('VITE_STRIPE_API_KEY')}`);

interface Props {
    jobId: string;
    amount: number;
    clientSecret: string;
    onCancel: () => void;
    onChangeAmount: () => void;
}

const FORM_ID = 'payment-details';
const paymentElementOptions = {
    layout: 'tabs'
} as StripePaymentElementOptions;

export const PaymentByCardForm = ({ clientSecret, ...props }: Props) => {
    const options = useMemo(
        () =>
            ({
                clientSecret,
                appearance: {
                    theme: 'stripe',
                    variables: {
                        fontFamily: 'Inter',
                        colorText: '#484C59',
                        fontSizeSm: '0.75rem'
                    },
                    rules: {
                        '.Label': {
                            fontWeight: '400',
                            fontSize: '0.875rem'
                        }
                    }
                },
                fonts: [{ cssSrc: 'https://fonts.googleapis.com/css?family=Inter' }]
            }) as StripeElementsOptions,
        [clientSecret]
    );

    return (
        <Elements options={options} stripe={stripePromise}>
            <Form {...props} />
        </Elements>
    );
};

type FormProps = Omit<Props, 'clientSecret'>;

const Form = ({ jobId, amount, onCancel, onChangeAmount }: FormProps) => {
    const billingInfo = useAppSelector(state => state.invoice.invoiceInfo?.billing);
    const [isLoading, setIsLoading] = useState(false);
    const [declineMessage, setDeclinedMessage] = useState('');

    const stripe = useStripe();
    const elements = useElements();
    const transactionDeclinedModal = useModal();

    const stripeIsNotReady = useMemo(() => !stripe || !elements, [stripe, elements]);

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();

            if (!stripe || !elements) {
                // Stripe.js hasn't yet loaded.
                // Make sure to disable form submission until Stripe.js has loaded.
                return;
            }

            setIsLoading(true);

            stripe
                .confirmPayment({
                    elements,
                    confirmParams: {
                        // Make sure to change this to your payment completion page
                        return_url: `${window.location.origin}${parametrizeRouterURL(APP_ROUTES.jobs.invoiceItem, {
                            jobId
                        })}`
                    }
                })
                .then(({ error }) => {
                    // This point will only be reached if there is an immediate error when
                    // confirming the payment. Otherwise, your customer will be redirected to
                    // your `return_url`. For some payment methods like iDEAL, your customer will
                    // be redirected to an intermediate site first to authorize the payment, then
                    // redirected to the `return_url`.
                    if (error.type === 'validation_error') {
                        return toast.error(error.message);
                    }
                    if (error.type === 'card_error') {
                        setDeclinedMessage(error.message || 'Please check your payment details and try again.');

                        return transactionDeclinedModal.openModal();
                    }
                    return toast.error('An unexpected error occurred.');
                })
                .finally(() => setIsLoading(false));
        },
        [stripe, elements, transactionDeclinedModal, jobId]
    );

    const addressElementOptions: StripeAddressElementOptions = useMemo(
        () => ({
            mode: 'billing',
            allowedCountries: ['US', 'CA'],
            defaultValues: {
                name: billingInfo?.name || '',
                address: billingInfo?.address
                    ? {
                          line1: `${billingInfo.address.streetName}, ${billingInfo.address.streetNumber}`,
                          line2: `apt. ${billingInfo.address.apartment}`,
                          city: billingInfo.address.city,
                          state: getStateAbbreviation(billingInfo.address.country, billingInfo.address.state) || '',
                          postal_code: billingInfo.address.zipCode,
                          country: getCountryAbbreviation(billingInfo.address.country) || ''
                      }
                    : undefined
            }
        }),
        [billingInfo]
    );

    if (stripeIsNotReady) {
        return null;
    }

    return (
        <div className={styles.formWrapper}>
            <div className={styles.titleBlock}>
                <p className={cn(styles.formTitle, 'body-16M')}>Amount to be paid {formatPriceValue(amount)}</p>
                <Button btnStyle='outlined-s' type='button' onClick={onChangeAmount}>
                    Change
                </Button>
            </div>
            <p className={cn(styles.formSubtitle, 'body-14M')}>Enter your payment details</p>
            <form id={FORM_ID} className={styles.paymentForm} onSubmit={handleSubmit}>
                <PaymentElement id='payment-element' options={paymentElementOptions} />
                <AddressElement id='address-element' options={addressElementOptions} />
                <div className={styles.formActions}>
                    <Button btnStyle='text-btn-l' type='button' onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button id={FORM_ID} btnStyle='blue-l' type='submit' disabled={stripeIsNotReady || isLoading}>
                        Pay Now
                    </Button>
                </div>
            </form>
            <PaymentByCardDeclinedModal
                message={declineMessage}
                isOpen={transactionDeclinedModal.isOpen}
                onClose={transactionDeclinedModal.closeModal}
            />
            {isLoading && <Loader center size='lg' />}
        </div>
    );
};
