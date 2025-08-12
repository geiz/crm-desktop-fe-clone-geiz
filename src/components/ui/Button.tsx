import cn from 'classnames';
import { Loader } from 'rsuite';

import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    onClick?: () => void;
    btnStyle?: string;
    className?: string;
    disabled?: boolean;
    icon?: string;
    isRedIcon?: boolean;
    isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, btnStyle, className, disabled, icon, isRedIcon, isLoading, ...props }) => {
    const classes = cn('btn-t', styles.btn, btnStyle && styles[btnStyle], className, {
        'body-14M': btnStyle && btnStyle !== 'icon-btn',
        [styles.isRedIcon]: isRedIcon
    });

    return (
        <button {...props} className={classes} disabled={disabled || isLoading} onClick={onClick}>
            {isLoading && <Loader center className={styles.loader} />}
            {icon && <i className={cn(styles.icon, `icon-${icon}`)}></i>}
            {children}
        </button>
    );
};

export default Button;
