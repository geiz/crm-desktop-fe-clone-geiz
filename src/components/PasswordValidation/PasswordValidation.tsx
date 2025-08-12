import cn from 'classnames';

import { FieldErrors, UseFormRegister, UseFormWatch } from 'react-hook-form';

import { Input } from 'components/ui/Input';

import { RecoveryFormValues } from 'types/authTypes';

import styles from './PasswordValidation.module.css';

interface PasswordValidationProps {
    register: UseFormRegister<RecoveryFormValues>;
    errors: FieldErrors<RecoveryFormValues>;
    watch: UseFormWatch<RecoveryFormValues>;
}

const PasswordValidation = ({ register, errors, watch }: PasswordValidationProps) => {
    const passwordValue = watch('password') || '';

    const isLengthValid = passwordValue.length >= 8;
    const hasUppercase = /[A-Z]/.test(passwordValue);
    const hasDigit = /\d/.test(passwordValue);

    const renderItem = (text: string, isValid: boolean) => {
        const showIcon = passwordValue.length > 0;

        return (
            <li className={styles.listItem}>
                {showIcon ? (
                    <i
                        className={cn(styles.icon, {
                            'icon-check-circle': isValid,
                            'icon-error': !isValid
                        })}
                    />
                ) : (
                    <span className={styles.defaultDot} />
                )}
                <span>{text}</span>
            </li>
        );
    };

    return (
        <>
            <Input
                isPassword
                label='Password'
                placeholder='Enter password'
                className={styles.passwordInput}
                errorMessage={errors.password?.message}
                {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Must be at least 8 characters' },
                    pattern: {
                        value: /^(?=.*[A-Z])(?=.*\d)/,
                        message: 'Must include one uppercase letter and one digit'
                    }
                })}
            />
            <span className={cn(styles.requirements, 'body-10M')}>Your password must meet the following requirements:</span>
            <ul className={cn(styles.requirementsList, 'body-12R')}>
                {renderItem('Be at least 8 characters in length', isLengthValid)}
                {renderItem('Include at least one uppercase letter', hasUppercase)}
                {renderItem('Contain at least one digit', hasDigit)}
            </ul>
            <Input
                isPassword
                label='Confirm password'
                placeholder='Repeat password'
                errorMessage={errors.confirmpassword?.message}
                {...register('confirmpassword', {
                    required: 'Please confirm your password',
                    validate: (value: string) => value === passwordValue || 'Passwords do not match'
                })}
            />
        </>
    );
};

export default PasswordValidation;
