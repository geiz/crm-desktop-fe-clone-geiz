import Header from './Header/Header';
import SettingsSidebar from './SettingsSidebar';

import { FC } from 'react';
import { Outlet } from 'react-router-dom';

import styles from './SettingsLayout.module.css';

const SettingsLayout: FC = () => {
    return (
        <>
            <Header />
            <main className={styles.content}>
                <SettingsSidebar />
                <section className={styles.contentInner}>
                    <Outlet />
                </section>
            </main>
        </>
    );
};

export default SettingsLayout;
