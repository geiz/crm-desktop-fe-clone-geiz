import cn from 'classnames';
import { Loader } from 'rsuite';

import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { TitleWithIdentifier } from 'components/@shared/TitleWithIdentifier';
import Block from 'components/Block/Block';
import EstimateFiles from 'components/Estimate/EstimateFiles';
import EstimateNotes from 'components/Estimate/EstimateNotes';
import EstimateSettings from 'components/Estimate/EstimateSettings';
import EstimateStatusLabel from 'components/Estimate/Status/EstimateStatusLabel';
import EstimateTags from 'components/Estimate/Tags/EstimateTags';
import Expander from 'components/Expander/Expander';
import PersonalInfoSection from 'components/PersonalInfo/PersonalInfoSection';
import SummarySection from 'components/PersonalInfo/SummarySection';
import Button from 'components/ui/Button';
import Popover from 'components/ui/Popover';

import { ESTIMATE_ENDPOINTS } from 'constants/endpoints';
import { useDidMount } from 'hooks/useDidMount';
import { getEstimateById } from 'services/estimateService';
import { parametrizeURL } from 'services/utils';
import { clearEstimateInfo, storeEstimate } from 'store/slices/estimateSlice';
import { useAppDispatch, useAppSelector } from 'store/store';
import { ESTIMATE_STATUS } from 'types/estimateTypes';
import downloadPdf from 'utils/downloadPdf';

import styles from './EstimateItemPage.module.css';

const EstimateItemPage = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const estimateInfo = useAppSelector(state => state.estimate.estimateInfo);

    const isEditable = useMemo(() => estimateInfo?.status === ESTIMATE_STATUS.DRAFT, [estimateInfo?.status]);

    useDidMount(
        () => {
            if (id && estimateInfo === null) {
                setIsLoading(true);
                getEstimateById(+id)
                    .then(response => {
                        dispatch(storeEstimate(response));
                    })
                    .finally(() => setIsLoading(false));
            }
        },
        () => {
            dispatch(clearEstimateInfo());
        }
    );

    const handleSavePdf = useCallback(async () => {
        downloadPdf(parametrizeURL(ESTIMATE_ENDPOINTS.savePdf, { estimateId: String(id) }), `Estimate_${id}`);
    }, [id]);

    if (isLoading) {
        return <Loader center size='lg' />;
    }

    if (estimateInfo === null) {
        return null;
    }

    return (
        <section className={styles.content}>
            <div className={styles.header}>
                <TitleWithIdentifier name='Estimate ID' identifier={id} />
                <EstimateStatusLabel status={estimateInfo.status} />
                {estimateInfo.status === ESTIMATE_STATUS.REJECTED && estimateInfo.reasonNote && (
                    <Popover
                        tooltipText='Rejected reason'
                        childrenStyle={styles.rejectedInfo}
                        popoverContent={<p className='body-14M'>{estimateInfo.reasonNote}</p>}>
                        <i className={cn(styles.rejectInfoIcon, 'icon-info')} />
                    </Popover>
                )}
                <div className={styles.businessUnit}>
                    <span className={cn('body-14M', styles.businessUnitTitle)}>Job Business Unit:</span>
                    <span className={cn('body-14M', styles.businessUnitName)}>{estimateInfo.businessUnit}</span>
                </div>
                {estimateInfo.status !== ESTIMATE_STATUS.DRAFT && (
                    <Button className={cn(styles.savePdf, 'body-14M')} icon='file-text' onClick={handleSavePdf}>
                        Save as PDF
                    </Button>
                )}
            </div>
            <div className={styles.contentWrapper}>
                <div className={styles.leftSide}>
                    <SummarySection createdAt={estimateInfo.createdAt} jobId={estimateInfo.jobId} soldBy={estimateInfo.soldBy} />
                    <Block className={cn(styles.personalInfo)}>
                        <PersonalInfoSection name='contact' section={estimateInfo.client} />
                        <PersonalInfoSection name='billing' section={estimateInfo.billing} />
                    </Block>
                    <Expander title='Estimate Notes'>
                        {estimateInfo.jobId && (
                            <EstimateNotes estimateId={estimateInfo.id.toString()} notes={estimateInfo.notes} isEditable={isEditable} />
                        )}
                    </Expander>
                    <EstimateTags tags={estimateInfo.tags} isEditable={isEditable} estimateId={estimateInfo.id.toString()} />
                    <Expander title='Estimate Files'>
                        <EstimateFiles uploadedFiles={estimateInfo.files} isEditable={isEditable} />
                    </Expander>
                </div>
                <EstimateSettings info={estimateInfo} />
            </div>
        </section>
    );
};

export default EstimateItemPage;
