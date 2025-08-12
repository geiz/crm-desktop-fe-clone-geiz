import cn from 'classnames';

import React, { Ref, forwardRef, useState } from 'react';

import ErrorMessage from 'components/ui/ErrorMessage';

import useUniqueId from 'hooks/useUniqueId';

import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    disabled?: boolean;
    className?: string;
    errorMessage?: string;
    helperText?: string;
    isPassword?: boolean;
    isSearch?: boolean;
    startIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        { label, disabled = false, className, errorMessage, helperText, isPassword = false, isSearch = false, startIcon, ...props },
        ref: Ref<HTMLInputElement>
    ) => {
        const [isPasswordVisible, setPasswordVisibility] = useState(false);
        const uniqueId = useUniqueId(props.id, props.name, 'input');

        const togglePasswordVisibility = () => setPasswordVisibility(prev => !prev);

        return (
            <div
                className={cn(styles.inputWrap, className, {
                    [styles.disabledWrap]: disabled,
                    [styles.searchWrap]: isSearch,
                    [styles.passwordWrap]: isPassword
                })}>
                {label && (
                    <label className={cn(styles.label, 'body-12R')} htmlFor={uniqueId}>
                        {label}
                    </label>
                )}
                <div className={styles.inputContainer}>
                    {isSearch && <i className={cn('icon-search', styles.searchIcon)}></i>}
                    {startIcon}
                    <input
                        id={uniqueId}
                        name={props.name}
                        type={isPassword ? (isPasswordVisible ? 'text' : 'password') : isSearch ? 'text' : props.type || 'text'}
                        className={cn(styles.input, 'body-16R', {
                            [styles.invalid]: !!errorMessage,
                            [styles.passwordInput]: isPassword,
                            [styles.search]: isSearch
                        })}
                        disabled={disabled}
                        ref={ref}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type='button'
                            className={cn(styles.eyeButton, {
                                'icon-eye': isPasswordVisible,
                                'icon-eye-closed': !isPasswordVisible
                            })}
                            onClick={togglePasswordVisibility}
                            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                        />
                    )}
                </div>
                {errorMessage ? (
                    <ErrorMessage message={errorMessage} className={styles.errorMessage} />
                ) : helperText ? (
                    <span className={cn(styles.helperText, 'body-12R')}>{helperText}</span>
                ) : null}
            </div>
        );
    }
);

export default Input;
