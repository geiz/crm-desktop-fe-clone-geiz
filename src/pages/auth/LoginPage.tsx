import cn from 'classnames';

import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import Button from 'components/ui/Button';
import { Input } from 'components/ui/Input';

import { REQUIRED_FIELD } from 'constants/common';
import { AUTH_ENDPOINTS } from 'constants/endpoints';
import { APP_ROUTES } from 'constants/routes';
import useLogin from 'hooks/useLogin';
import { authRequest } from 'services/authService';
import { LoginFormValues, LoginResponse } from 'types/authTypes';

import styles from './LoginPage.module.css';
import companyLogo from 'assets/temp/company-logo.svg';

const LoginPage = () => {
    const loginUser = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginFormValues>();

    const onSubmit = async (data: LoginFormValues) => {
        const { meta, response } = await authRequest<LoginResponse>({
            url: AUTH_ENDPOINTS.login,
            data: { email: data.email, password: data.password }
        });

        if (meta.success && response) {
            loginUser(response.accessToken);
        } else toast.error(meta.message);
    };

    return (
        <div className={styles.container}>
            <img className={styles.companyLogo} src={companyLogo} alt='company logo' />
            <h1 className={cn(styles.title, 'h-20B')}>Log In</h1>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Input
                    className={styles.inputEmail}
                    type='email'
                    label='Email address'
                    placeholder='Enter email'
                    errorMessage={errors.email?.message}
                    {...register('email', { required: REQUIRED_FIELD })}
                />
                <Input
                    isPassword
                    label='Password'
                    placeholder='Enter password'
                    className={styles.passwordInput}
                    errorMessage={errors.password?.message}
                    {...register('password', { required: REQUIRED_FIELD })}
                />
                <Link className={cn(styles.forgotLink, 'body-12R')} to={APP_ROUTES.auth.forgotPassword}>
                    Forgot your password?
                </Link>
                <Button btnStyle='blue-l' type='submit' className={styles.btn} disabled={isSubmitting}>
                    {isSubmitting ? 'Logging in...' : 'Log In'}
                </Button>
            </form>
        </div>
    );
};

export default LoginPage;
