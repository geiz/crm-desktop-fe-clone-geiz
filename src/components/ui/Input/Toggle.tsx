import cn from 'classnames';

import { forwardRef } from 'react';

import ErrorMessage from 'components/ui/ErrorMessage';

import useUniqueId from 'hooks/useUniqueId';

import styles from './Toggle.module.css';

type ToggleProps = {
    label?: string;
    className?: string;
    errorMessage?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(({ label, className, errorMessage, ...props }, ref) => {
    const uniqueId = useUniqueId(props.id, props.name, 'toggle');

    return (
        <>
            <label className={cn(styles.toggleLabelWrap, className)} htmlFor={uniqueId}>
                {label && <span className={cn(styles.labelText, 'body-12M')}>{label}</span>}
                <span className={styles.toggleContainer}>
                    <input type='checkbox' className={styles.toggleInput} id={uniqueId} ref={ref} {...props} />
                    <span className={styles.toggleSlider} />
                </span>
            </label>
            <ErrorMessage message={errorMessage} className={styles.errorMessage} />
        </>
    );
});

export default Toggle;
