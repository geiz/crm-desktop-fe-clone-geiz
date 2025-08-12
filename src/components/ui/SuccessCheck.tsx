import cn from 'classnames';

import styles from './SuccessCheck.module.css';

interface SuccessCheckProps {
    className?: string;
}

const SuccessCheck = ({ className }: SuccessCheckProps) => (
    <div className={cn(styles.wrap, className)}>
        <i className={cn(styles.checkIcon, 'icon-check')} />
    </div>
);

export default SuccessCheck;
