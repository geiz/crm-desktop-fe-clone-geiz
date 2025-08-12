import cn from 'classnames';

import { useState } from 'react';

import Button from 'components/ui/Button';

import styles from './Drawer.module.css';

export const Drawer = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(true);
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <Button className={styles.sandwichButton} onClick={toggleMenu}>
                ☰
            </Button>
            <div
                className={cn(styles.drawer, {
                    [styles.visible]: isOpen,
                    [styles.hidden]: !isOpen
                })}>
                {children}
            </div>
        </>
    );
};
