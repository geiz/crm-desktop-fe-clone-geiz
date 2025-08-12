import cn from 'classnames';

import { forwardRef, useMemo } from 'react';

import ErrorMessage from 'components/ui/ErrorMessage';

import useUniqueId from 'hooks/useUniqueId';

import styles from './RadioButtons.module.css';

const RadioButtons = forwardRef(
    ({ name, options, label, isVertical = false, errorMessage, className, disabled = false, ...props }, ref) => {
        const groupId = useUniqueId(props.id, props.name, 'radio');

        return (
            <fieldset className={cn(styles.fieldsWrapper, { [styles.vertical]: isVertical }, className)}>
                {label && <legend className={cn(styles.groupLabel, 'body-12R')}>{label}</legend>}
                {options.map((option, i) => {
                    const uniqueId = `${groupId}-${i}`;
                    return (
                        <div className={styles.radioWrap} key={uniqueId}>
                            <input
                                type='radio'
                                id={uniqueId}
                                name={name}
                                value={option.value}
                                disabled={disabled}
                                className={cn(styles.input, { [styles.invalid]: !!errorMessage })}
                                ref={ref}
                                {...props}
                            />
                            <label
                                htmlFor={uniqueId}
                                className={cn(styles.label, 'label-t', {
                                    [styles.disabledLabel]: disabled
                                })}>
                                {option.label}
                            </label>
                        </div>
                    );
                })}
                <ErrorMessage message={errorMessage} className={styles.errorMessage} />
            </fieldset>
        );
    }
);

export default RadioButtons;
