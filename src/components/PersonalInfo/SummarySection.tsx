import cn from 'classnames';

import { Link } from 'react-router-dom';

import Block from 'components/Block/Block';

import { DATE_TIME_FORMAT } from 'constants/common';
import { APP_ROUTES } from 'constants/routes';
import useTimezone from 'hooks/useTimezone';
import { parametrizeRouterURL } from 'routes/utils';
import formatIdTo8Digits from 'utils/formatIdTo8digits';

import styles from './Details.module.css';

interface Props {
    createdAt: number;
    jobId: number;
    soldBy?: string;
}

const SummarySection = ({ createdAt, jobId, soldBy }: Props) => {
    const { getTimezonedFormatedDate } = useTimezone();
    const sectionTitleStyle = cn(styles.sectionTitle, 'body-12M');

    return (
        <Block className={styles.block}>
            <h2 className={cn(styles.title, 'h-16B')}>SUMMARY</h2>

            <div className={cn(styles.infoField, 'body-14M')}>
                <span className={sectionTitleStyle}>Created:</span>
                <div className={styles.sectionValue}>{getTimezonedFormatedDate(createdAt, DATE_TIME_FORMAT)}</div>

                <span className={sectionTitleStyle}>Job ID:</span>
                <div className={styles.sectionValue}>
                    <Link to={parametrizeRouterURL(APP_ROUTES.jobs.item, { jobId: `${jobId}` })} className={styles.link}>
                        {formatIdTo8Digits(jobId)}
                    </Link>
                </div>

                {soldBy && (
                    <>
                        <span className={sectionTitleStyle}>Sold by:</span>
                        <div className={styles.sectionValue}>{soldBy}</div>
                    </>
                )}
            </div>
        </Block>
    );
};

export default SummarySection;
