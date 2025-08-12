import cn from 'classnames';

import styles from './WarningMessage.module.css';

interface WarningMessageProps {
    text: string;
    show: boolean;
    className?: string;
}

const WarningMessage = ({ text, className, show }: WarningMessageProps) => {
    const messageStyles = cn('body-12R', styles.warning, { [styles.showWarning]: show }, className);

    return (
        <div className={messageStyles}>
            <i className='icomoon icon-alert-triangle' />
            {text}
        </div>
    );
};

export default WarningMessage;
