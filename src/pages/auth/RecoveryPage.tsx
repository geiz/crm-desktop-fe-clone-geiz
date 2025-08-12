import cn from 'classnames';

import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import PasswordValidation from 'components/PasswordValidation/PasswordValidation';
import Button from 'components/ui/Button';

import { APP_ROUTES } from 'constants/routes';
import useAuthPassword from 'hooks/useAuthPassword';
import { RecoveryFormValues } from 'types/authTypes';

import styles from './RecoveryPage.module.css';
import companyLogo from 'assets/temp/company-logo.svg';

const RecoveryPage = () => {
    const { resetPassword, isAuthMessage, email } = useAuthPassword();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch
    } = useForm<RecoveryFormValues>({ mode: 'onChange' });

    return (
        <div className={styles.container}>
            {isAuthMessage ? (
                <div className={styles.expiredContainer}>
                    <h1 className={cn(styles.title, 'h-20B')}>The password reset link has expired</h1>
                    <p className={cn(styles.subtitle, 'body-12R')}>Please request a new one to reset your password.</p>
                    <Link to={APP_ROUTES.auth.forgotPassword}>
                        <Button btnStyle='blue-l' className={styles.btn}>
                            Reset Password
                        </Button>
                    </Link>
                </div>
            ) : (
                <>
                    <img className={styles.companyLogo} src={companyLogo} alt='company logo' />
                    <h1 className={cn(styles.title, 'h-20B')}>Create a New Password</h1>

                    <div className={cn(styles.emailLabel, 'body-10M')}>You're resetting password for</div>
                    <div className={cn(styles.email, 'body-14M')}>
                        <i className='icon-mail' />
                        {email || 'user@email.com'}
                    </div>

                    <form onSubmit={handleSubmit(resetPassword)} className={styles.form} noValidate>
                        <h3 className={cn(styles.subTitle, 'h-16B')}>Create a Password</h3>

                        <PasswordValidation register={register} errors={errors} watch={watch} />

                        <Button btnStyle='blue-l' type='submit' className={cn(styles.btn)} disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save & Log In'}
                        </Button>
                    </form>
                </>
            )}
        </div>
    );
};

export default RecoveryPage;
