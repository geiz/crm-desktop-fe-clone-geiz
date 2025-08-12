import cn from 'classnames';
import { Loader } from 'rsuite';

import { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MultiValue } from 'react-select';
import { toast } from 'react-toastify';

import { TitleWithIdentifier } from 'components/@shared/TitleWithIdentifier';
import AppointmentForm from 'components/Appointment/AppointmentForm/AppointmentForm';
import CancelForm from 'components/Appointment/CancelForm';
import OnHoldForm from 'components/Appointment/OnHoldForm';
import Block from 'components/Block/Block';
import EstimatesCard from 'components/DocumentCards/EstimatesCard';
import InvoiceCard from 'components/DocumentCards/InvoiceCard';
import Expander from 'components/Expander/Expander';
import Map from 'components/Map/Map';
import IconModal from 'components/Modals/IconModal';
import Modal from 'components/Modals/Modal';
import Details from 'components/PersonalInfo/Details';
import PersonalInfoSection from 'components/PersonalInfo/PersonalInfoSection';
import JobFiles from 'components/jobs/JobFiles';
import JobNotes from 'components/jobs/JobNotes';
import Summary from 'components/jobs/Summary/Summary';
import Button from 'components/ui/Button';
import Dropdown from 'components/ui/Dropdown';
import { Select } from 'components/ui/Input';
import Popover from 'components/ui/Popover';
import Tabs from 'components/ui/Tabs';

import { JOB_ENDPOINTS } from 'constants/endpoints';
import { APP_ROUTES } from 'constants/routes';
import useJob from 'hooks/useJob';
import useModal from 'hooks/useModal';
import useSelectOptions from 'hooks/useSelectOptions';
import { parametrizeRouterURL } from 'routes/utils';
import { apiRequest } from 'services/apiUtils';
import { createEstimate } from 'services/estimateService';
import { createInvoice } from 'services/invoiceService';
import { getJob } from 'services/jobService';
import { parametrizeURL } from 'services/utils';
import { storeEstimate } from 'store/slices/estimateSlice';
import { storeInvoice } from 'store/slices/invoiceSlice';
import { setEstimates, setInvoice, setSelectedJob, setTags, updateJobStatuses, updateSummary } from 'store/slices/jobSlice';
import { useAppDispatch, useAppSelector } from 'store/store';
import { BaseItem, Method, SelectOption } from 'types/common';
import { ESTIMATE_STATUS, EstimateCardItem } from 'types/estimateTypes';
import { InvoiceCardItem } from 'types/invoiceTypes';
import { CancelFormValues, Job, JobStatus } from 'types/jobTypes';
import { formatAddress } from 'utils/formatAddress';
import { formatJobDetailsData, formatTags, getTabsData, mapContainerStyles } from 'utils/jobUtils';

import styles from './JobItemPage.module.css';

const JobItemPage: FC = () => {
    const { jobId } = useParams();
    const dispatch = useAppDispatch();
    const { allTags, getAllTags } = useSelectOptions();
    const { isOpen: isOpenAppForm, openModal: openAppForm, closeModal: closeAppForm } = useModal();
    const { isOpen: isCancelJobOpen, openModal: openCancelJob, closeModal: closeCancelJob } = useModal();
    const { isOpen: isHoldJobOpen, openModal: openHoldJob, closeModal: closeHoldJob } = useModal();
    const [isCreating, setIsCreating] = useState<{ invoice: boolean; estimate: boolean }>({ invoice: false, estimate: false });
    const [isLoading, setIsLoading] = useState(false);
    const { tags, details, appointments, statuses, client, notes, billing, estimates, invoice, files } = useAppSelector(state => state.job);

    const isInactiveStatus = [JobStatus.ON_HOLD, JobStatus.CANCELLED].includes(statuses?.status);
    const hasEstimates = estimates && estimates.length > 0;

    useEffect(() => {
        setIsLoading(true);
        getJob(String(jobId))
            .then(resp => dispatch(setSelectedJob(resp)))
            .catch(err => toast.error(err.message))
            .finally(() => setIsLoading(false));
    }, [dispatch, jobId]);

    const handleTagChange = (newValue: unknown) => {
        const newTags = newValue as MultiValue<SelectOption>;

        const addedTag = newTags.find(tag => !tags.some(t => t.id === tag.value));
        const removedTag = tags.find(tag => !newTags.some(t => t.value === tag.id));
        const tag: { id: number; action: string } = {
            id: Number(addedTag?.value || removedTag?.id),
            action: newTags.length > tags.length ? 'add' : 'remove'
        };

        apiRequest<BaseItem[]>({
            url: parametrizeURL(JOB_ENDPOINTS.updateTags, { jobId: String(jobId), tagAction: tag.action, tagId: tag.id }),
            method: Method.PUT
        })
            .then(resp => dispatch(setTags(resp)))
            .catch(err => toast.error(err.message));
    };

    const handleRestoreJob = () => {
        setIsLoading(true);
        apiRequest<Job['statuses']>({ url: parametrizeURL(JOB_ENDPOINTS.restore, { jobId: String(jobId) }), method: Method.PUT })
            .then(resp => dispatch(updateJobStatuses(resp)))
            .catch(err => toast.error(err))
            .finally(() => setIsLoading(false));
    };

    const jobActionsOptions = [
        { label: 'Hold Job', onClick: openHoldJob },
        { label: 'Cancel Job', onClick: openCancelJob }
    ];

    const handleCancelJobSubmit = useCallback(
        async (data: CancelFormValues) => {
            const requestData = {
                status: JobStatus.CANCELLED,
                cancelReasonId: data.cancelReasonId?.toString() || '',
                reasonNote: data.reasonNote || '',
                applyCancellationFee: data.applyCancellationFee || false
            };

            return apiRequest<Job>({
                url: parametrizeURL(JOB_ENDPOINTS.changeStatus, { jobId: String(jobId) }),
                method: Method.PUT,
                data: requestData
            })
                .then(resp => {
                    dispatch(setSelectedJob(resp));
                    closeCancelJob();
                })
                .catch(err => {
                    toast.error(err.message);
                });
        },
        [jobId, dispatch, closeCancelJob]
    );

    const handleOnHoldJobSubmit = useCallback(
        async (data: { reasonNote: string }) => {
            const requestData = {
                status: JobStatus.ON_HOLD,
                reasonNote: data.reasonNote
            };
            return apiRequest<Job>({
                url: parametrizeURL(JOB_ENDPOINTS.changeStatus, { jobId: String(jobId) }),
                method: Method.PUT,
                data: requestData
            })
                .then(resp => {
                    dispatch(setSelectedJob(resp));
                    closeHoldJob();
                })
                .catch(err => {
                    toast.error(err.message);
                });
        },
        [jobId, dispatch, closeHoldJob]
    );

    const handleCreateEstimate = () => {
        setIsCreating(prev => ({ ...prev, estimate: true }));
        createEstimate(Number(jobId))
            .then(response => {
                dispatch(storeEstimate(response));
                dispatch(
                    setEstimates([
                        ...estimates,
                        {
                            id: response.id,
                            serviceName: 'Unassigned',
                            total: 0,
                            status: ESTIMATE_STATUS.DRAFT
                        } as EstimateCardItem
                    ])
                );
                const url = parametrizeRouterURL(APP_ROUTES.estimates.item, { id: `${response.id}` });
                window.open(url, '_blank');
            })
            .finally(() => setIsCreating(prev => ({ ...prev, estimate: false })));
    };

    const handleCreateInvoice = () => {
        setIsCreating(prev => ({ ...prev, invoice: true }));
        createInvoice(Number(jobId))
            .then(response => {
                dispatch(storeInvoice(response));
                dispatch(
                    setInvoice({
                        id: response.id,
                        total: 0,
                        amountPaid: 0,
                        balance: 0
                    } as InvoiceCardItem)
                );
                const url = parametrizeRouterURL(APP_ROUTES.jobs.invoiceItem, { jobId: `${response.jobId}` });
                window.open(url, '_blank');
            })
            .finally(() => setIsCreating(prev => ({ ...prev, invoice: false })));
    };

    const handleSaveSummary = (summary: string) => {
        if (!jobId) return Promise.reject();

        return apiRequest<{ summary: string }>({
            url: JOB_ENDPOINTS.updateSummary(Number(jobId)),
            method: Method.PUT,
            data: { summary }
        })
            .then(resp => {
                dispatch(updateSummary(resp.summary));
            })
            .catch(error => {
                toast.error(error);
                throw error;
            });
    };

    return (
        <>
            {isLoading && <Loader size='lg' center />}
            {isInactiveStatus && (
                <div className={styles.statusBanner}>
                    <span className='body-14M'>This job is currently on hold or has been canceled</span>
                    <Button btnStyle='blue-l' icon='refresh' onClick={handleRestoreJob}>
                        Restore Job
                    </Button>
                </div>
            )}
            <section className={styles.content}>
                <div className={styles.header}>
                    <TitleWithIdentifier name='Job ID' identifier={jobId} />
                    <div className={cn(styles.statuses, 'body-14M')}>
                        Job Status:
                        <div className={styles.statusesItems}>
                            <div className={styles.jobStatus}>
                                {statuses?.status.replace('_', ' ') || ''}
                                {isInactiveStatus && (
                                    <Popover
                                        className={cn('body-14M', styles.grey1000)}
                                        tooltipText='Click to see more'
                                        popoverContent={details?.reasonNote}>
                                        <i className='icomoon icon-info' />
                                    </Popover>
                                )}
                            </div>
                            <div>{statuses?.done} Done</div>
                            <div>{statuses?.booked} Booked</div>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <Button
                            btnStyle='outlined-s'
                            icon='plus'
                            onClick={handleCreateEstimate}
                            isLoading={isCreating.estimate}
                            disabled={isLoading}>
                            Create Estimate
                        </Button>
                        {!invoice && (
                            <Button
                                btnStyle='outlined-s'
                                icon='plus'
                                onClick={handleCreateInvoice}
                                isLoading={isCreating.invoice}
                                disabled={isLoading}>
                                Create Invoice
                            </Button>
                        )}
                        {!isInactiveStatus && (
                            <Dropdown
                                className={styles.jobActionsDropdown}
                                trigger={
                                    <Button className={cn(styles.jobActionsBtn, 'body-14M')}>
                                        Job Actions
                                        <i className={cn(styles.avatarIcon, 'icon-drop-down')} />
                                    </Button>
                                }
                                options={jobActionsOptions}
                            />
                        )}
                    </div>
                </div>

                <div className={styles.leftSide}>
                    {details && <Details section={formatJobDetailsData(details)} title='job details' />}
                    {client && billing && (
                        <Block className={cn(styles.personalInfo)}>
                            <PersonalInfoSection name='contact' section={client} editable />
                            <PersonalInfoSection name='billing' section={billing} editable />
                        </Block>
                    )}

                    {client?.address?.geoLocation && (
                        <Map styles={mapContainerStyles} geoLocation={client.address.geoLocation} address={formatAddress(client.address)} />
                    )}
                    {jobId && notes && (
                        <Expander title='Job Notes'>
                            <JobNotes jobId={jobId} notes={notes} isEditable={!isInactiveStatus} />
                        </Expander>
                    )}
                    {tags && (
                        <Expander title='Job Tags'>
                            <Select
                                options={allTags.options}
                                value={formatTags(tags)}
                                isMulti
                                isClearable={false}
                                onFocus={getAllTags}
                                onChange={handleTagChange}
                                placeholder='Select tags...'
                                disabled={isInactiveStatus}
                                isLoading={allTags.isLoading}
                            />
                        </Expander>
                    )}
                    {files && (
                        <Expander title='Job Files'>
                            <JobFiles uploadedFiles={files} disabled={isInactiveStatus} />
                        </Expander>
                    )}
                </div>

                <div className={styles.rightSide}>
                    {details && <Summary text={details.summary} onSave={handleSaveSummary} />}

                    {hasEstimates && <EstimatesCard items={estimates || []} className={styles.estimatesCard} />}

                    {invoice && jobId && <InvoiceCard invoice={invoice} jobId={jobId} className={styles.invoiceCard} />}

                    {appointments && details && (
                        <Block className={styles.appointments}>
                            <div className={styles.appHeader}>
                                <h2 className={cn(styles.title, 'h-16B')}>Scheduled Appointments</h2>
                                <Button
                                    icon='plus'
                                    className={styles.addAppBtn}
                                    btnStyle='outlined-s'
                                    onClick={openAppForm}
                                    disabled={isInactiveStatus}>
                                    Add Appointment
                                </Button>
                            </div>
                            <Tabs
                                tabsData={getTabsData(appointments, details)}
                                tabsContainerStyle={styles.tabsContainerStyle}
                                tabNavBtnStyle={styles.tabNavBtnStyle}
                            />
                        </Block>
                    )}
                </div>

                {jobId && details && (
                    <Modal isOpen={isOpenAppForm} onClose={closeAppForm} className={styles.addAppointmentModal}>
                        <AppointmentForm
                            closeModal={closeAppForm}
                            submitBtnTitle='Schedule'
                            formTitle='Schedule a New Appointment'
                            businessUnitId={details.businessUnit.id}
                        />
                    </Modal>
                )}

                <IconModal
                    isOpen={isCancelJobOpen}
                    onClose={closeCancelJob}
                    icon={{ font: 'icon-delete-square', red: true }}
                    title='Are you sure you want to cancel this job?'>
                    <CancelForm closeModal={closeCancelJob} onSubmit={handleCancelJobSubmit} />
                </IconModal>

                <IconModal
                    isOpen={isHoldJobOpen}
                    onClose={closeHoldJob}
                    icon={{ font: 'icon-hold' }}
                    title='Are you sure you want to place this job on hold?'>
                    <OnHoldForm closeModal={closeHoldJob} onSubmit={handleOnHoldJobSubmit} />
                </IconModal>
            </section>
        </>
    );
};

export default JobItemPage;
