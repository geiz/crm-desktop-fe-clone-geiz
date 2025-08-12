import cn from 'classnames';
import dayjs from 'dayjs';

import { Ref, forwardRef } from 'react';

import Block from 'components/Block/Block';
import EstimateEmailOrder from 'components/Estimate/Email/EstimateEmailOrder';
import InvoicePreviewPayments from 'components/Invoice/Email/InvoicePreviewPayments';
import Button from 'components/ui/Button';

import { getGeneratedAddress } from './utils';
import { DATE_FORMAT } from 'constants/common';
import { DISCOUNT_TYPE, ESTIMATE_STATUS, EstimateEmailResponse } from 'types/estimateTypes';
import formatIdTo8Digits from 'utils/formatIdTo8digits';

import styles from './EstimateEmailPreview.module.css';

interface Props {
    emailInfo: EstimateEmailResponse;
    type: 'Estimate' | 'Invoice';
    onSave: () => void;
}

const EstimateEmailPreview = forwardRef(({ emailInfo, type, onSave }: Props, ref: Ref<HTMLDivElement>) => {
    return (
        <Block className={styles.paper}>
            <div ref={ref}>
                {emailInfo?.status !== ESTIMATE_STATUS.DRAFT && (
                    <Button className={cn(styles.savePdf, 'body-14M')} icon='file-text' onClick={onSave}>
                        Save as PDF
                    </Button>
                )}
                <div className={styles.paperContent}>
                    <div className={styles.generalInfo}>
                        <div className={styles.companyBlock}>
                            <div className={styles.logoWrapper}>
                                <img src={emailInfo.company.image} alt='logo' />
                            </div>
                            <div className={styles.companyInfo}>
                                <p className={cn('h-16B', styles.companyName)}>{emailInfo.company.name}</p>
                                <div className={styles.companyRow}>
                                    <i className={cn('icon-map-pin', styles.icon)} />
                                    <p className={cn('body-12M', styles.text)}>{getGeneratedAddress(emailInfo.company.address)}</p>
                                </div>
                                <div className={styles.companyRow}>
                                    <i className={cn('icon-phone', styles.icon)} />
                                    <p className={cn('body-12M', styles.text)}>{emailInfo.company.phone}</p>
                                </div>
                                <div className={styles.companyRow}>
                                    <i className={cn('icon-mail', styles.icon)} />
                                    <p className={cn('body-12M', styles.text)}>{emailInfo.company.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.contactInfoBlock}>
                            <p className={cn('body-12SB', styles.blockTitle)}>Contact Info:</p>
                            <div className={styles.infoWrapper}>
                                <p className={cn('body-12M', styles.text)}>{emailInfo.client.name}</p>
                                <p className={cn('body-12M', styles.text)}>{getGeneratedAddress(emailInfo.client.address)}</p>
                            </div>
                        </div>

                        <div className={styles.contactInfoBlock}>
                            <p className={cn('body-12SB', styles.blockTitle)}>Billing Info:</p>
                            <div className={styles.infoWrapper}>
                                <p className={cn('body-12M', styles.text)}>{emailInfo.client.billing.name}</p>
                                <p className={cn('body-12M', styles.text)}>{getGeneratedAddress(emailInfo.client.billing.address)}</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.estimateInfoBlock}>
                        <p className={cn('body-14M', styles.estimateInfoTitle)}>
                            {type} ID:
                            <span>{formatIdTo8Digits(emailInfo.id)}</span>
                        </p>
                        <p className={cn('body-14M', styles.estimateInfoTitle)}>
                            Job ID:
                            <span>{formatIdTo8Digits(emailInfo.jobId)}</span>
                        </p>
                        <p className={cn('body-14M', styles.estimateInfoTitle)}>
                            {type} date:
                            <span>{formatIdTo8Digits(dayjs.unix(emailInfo.createdAt).format(DATE_FORMAT))}</span>
                        </p>
                    </div>

                    {!!emailInfo.services.length && <EstimateEmailOrder orderType='Services' list={emailInfo.services} />}
                    {!!emailInfo.materials.length && <EstimateEmailOrder orderType='Materials' list={emailInfo.materials} />}

                    <div className={styles.subtotalBlock}>
                        <div className={styles.subtotalRow}>
                            <span className={cn('body-14M', styles.subtotalText)}>Subtotal</span>
                            <span className={cn('body-14M', styles.subtotalText)}>
                                ${Number(emailInfo.prices.subTotal.toFixed(2)).toLocaleString('en-IN')}
                            </span>
                        </div>
                        {emailInfo.prices.discount && (
                            <div className={styles.subtotalRow}>
                                <span className={cn('body-14M', styles.subtotalText)}>
                                    Discount
                                    {emailInfo.prices.discount.type === DISCOUNT_TYPE.PERCENTAGE &&
                                        ` (-${emailInfo.prices.discount.amount}%)`}
                                </span>
                                <span className={cn('body-14M', styles.subtotalText)}>
                                    {emailInfo.prices.discount.value > 0 ? '-' : ''}$
                                    {Number((emailInfo.prices.discount.value || 0).toFixed(2)).toLocaleString('en-IN')}
                                </span>
                            </div>
                        )}
                        {emailInfo.prices.tax && (
                            <div className={styles.subtotalRow}>
                                <span className={cn('body-14M', styles.subtotalText)}>
                                    Tax ({emailInfo.prices.tax.name} {emailInfo.prices.tax.percent}%)
                                </span>
                                <span className={cn('body-14M', styles.subtotalText)}>
                                    ${Number(emailInfo.prices.tax.value.toFixed(2)).toLocaleString('en-IN')}
                                </span>
                            </div>
                        )}
                        <div className={styles.subtotalRow}>
                            <span className={cn('h-16B', styles.total)}>Total {type}</span>
                            <span className={cn('h-16B', styles.total)}>
                                ${Number(emailInfo.prices.total.toFixed(2)).toLocaleString('en-IN')}
                            </span>
                        </div>
                    </div>

                    {type === 'Invoice' && emailInfo.payments && <InvoicePreviewPayments payments={emailInfo.payments} />}

                    <p className={cn('body-10M', styles.agreement)}>{emailInfo.agreement}</p>
                    <p className={cn('body-10M', styles.terms)}>{emailInfo.terms}</p>
                </div>
            </div>
        </Block>
    );
});

EstimateEmailPreview.displayName = 'EstimateEmailPreview';

export default EstimateEmailPreview;
