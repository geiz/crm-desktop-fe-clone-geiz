import cn from 'classnames';

import { ESTIMATE_STATUS } from 'types/estimateTypes';

import styles from './EstimateStatusLabel.module.css';

interface Props {
    status: ESTIMATE_STATUS;
}

const EstimateStatusLabel = ({ status }: Props) => {
    return (
        <div className={cn('body-12M', styles[status.toLowerCase()], styles.label)}>
            <span>{status}</span>
        </div>
    );
};

export default EstimateStatusLabel;
