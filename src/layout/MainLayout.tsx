import Header from './Header/Header';

import { FC } from 'react';
import { Outlet } from 'react-router-dom';

import styles from './MainLayout.module.css';

const MainLayout: FC = () => (
    <>
        <Header />
        <main className={styles.content}>
            <Outlet />
        </main>
    </>
);

export default MainLayout;
