import cn from 'classnames';

import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
    message?: string;
    className?: string;
}

const ErrorMessage = ({ message, className }: ErrorMessageProps) =>
    message ? <span className={cn(styles.errorMessage, 'body-12R', className)}>{message}</span> : null;

export default ErrorMessage;
