import cn from 'classnames';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import Button from 'components/ui/Button';
import { Input } from 'components/ui/Input';

import { EMAIL_PATTERN, INVALID_EMAIL_FORMAT, REQUIRED_FIELD, UNKNOWN_ERROR } from 'constants/common';
import { AUTH_ENDPOINTS } from 'constants/endpoints';
import { authRequest } from 'services/authService';
import { LoginFormValues } from 'types/authTypes';

import styles from './ForgotPassword.module.css';

const ForgotPassword = () => {
    const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<Partial<LoginFormValues>>({ mode: 'onChange' });

    const onSubmit = async (data: Partial<LoginFormValues>) => {
        const { meta, response } = await authRequest<string>({
            url: AUTH_ENDPOINTS.forgotPassword,
            data: { email: data.email }
        });

        if (meta.success) {
            setIsSubmitSuccessful(true);
            toast.info(response);
        } else toast.error(meta.message || UNKNOWN_ERROR);
    };

    return (
        <>
            {isSubmitSuccessful ? (
                <div className={styles.successMessage}>
                    <h1 className={cn(styles.title, 'h-20B')}>Thanks, check your email!</h1>
                    <p className={cn(styles.descriptionSubmitted, 'body-12R')}>
                        We have sent you instructions on how to change your password.
                    </p>
                </div>
            ) : (
                <div className={styles.container}>
                    <h1 className={cn(styles.title, 'h-20B')}>Forgot Password?</h1>
                    <div className={cn(styles.description, 'body-12R')}>
                        Don't worry! It happens. Please enter the email associated with your account.
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <Input
                            type='email'
                            label='Email address'
                            placeholder='Enter email'
                            errorMessage={errors.email?.message}
                            className={styles.inputEmail}
                            {...register('email', {
                                required: REQUIRED_FIELD,
                                pattern: {
                                    value: EMAIL_PATTERN,
                                    message: INVALID_EMAIL_FORMAT
                                }
                            })}
                        />
                        <Button btnStyle='blue-l' type='submit' className={styles.btn} disabled={isSubmitting}>
                            {isSubmitting ? 'Sending...' : 'Reset Password'}
                        </Button>
                    </form>
                </div>
            )}
        </>
    );
};

export default ForgotPassword;
