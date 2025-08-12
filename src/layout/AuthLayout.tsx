import { FC } from 'react';
import { Outlet } from 'react-router-dom';

import styles from './AuthLayout.module.css';
import logo from 'assets/img/logo-white.svg';
import welcome from 'assets/img/welcome.svg';

const AuthLayout: FC = () => {
    return (
        <div className={styles.authLayout}>
            <div className={styles.content}>
                <div className={styles.contentInner}>
                    <Outlet />
                </div>
            </div>

            <div className={styles.background}>
                <img src={logo} className={styles.logo} alt='logo workflow-pros' />
                <img src={welcome} className={styles.wellcome} alt='welcome text' />
            </div>
        </div>
    );
};

export default AuthLayout;
