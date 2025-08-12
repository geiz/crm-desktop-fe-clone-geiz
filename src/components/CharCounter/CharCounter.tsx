import cn from 'classnames';

import styles from './CharCounter.module.css';

interface CharCounterProps {
    current: number;
    max: number;
    className?: string;
}

const CharCounter = ({ current, max, className }: CharCounterProps) => {
    if (current === 0) return null;

    return (
        <span className={cn(styles.counter, 'body-12R', className)}>
            {current}/{max}
        </span>
    );
};

export default CharCounter;
