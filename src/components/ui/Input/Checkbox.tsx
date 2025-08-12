import cn from 'classnames';

import { forwardRef } from 'react';

import ErrorMessage from 'components/ui/ErrorMessage';

import useUniqueId from 'hooks/useUniqueId';

import styles from './Checkbox.module.css';

type CheckboxProps = {
    label?: string;
    disabled?: boolean;
    className?: string;
    errorMessage?: string;
    color?: string;
    labelStyle?: React.CSSProperties;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, disabled = false, className, labelStyle, errorMessage, color, ...props }, ref) => {
        const uniqueId = useUniqueId(props.id, props.name, 'checkbox');

        // Create a dynamic style with CSS custom properties
        const checkboxStyle = color
            ? ({
                  '--checkbox-checked-bg': color,
                  '--checkbox-checked-border': color,
                  '--checkbox-hover-border': color,
                  '--checkbox-focus-border': color
              } as React.CSSProperties)
            : undefined;

        return (
            <div className={cn(styles.checkboxWrap, { [styles.disabledWrap]: disabled }, className)} style={checkboxStyle}>
                <input
                    type='checkbox'
                    id={uniqueId}
                    name={props.name}
                    disabled={disabled}
                    className={styles.checkboxInput}
                    ref={ref}
                    {...props}
                />
                {label && (
                    <label
                        htmlFor={uniqueId}
                        className={cn(styles.checkboxLabel, 'body-14R', { [styles.invalid]: !!errorMessage })}
                        style={labelStyle}>
                        {label}
                    </label>
                )}
                <ErrorMessage message={errorMessage} className={styles.errorMessage} />
            </div>
        );
    }
);

export default Checkbox;
