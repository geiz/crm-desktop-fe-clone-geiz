import cn from 'classnames';

import { FC, ReactNode, useState } from 'react';

import Block from 'components/Block/Block';

import styles from './Expander.module.css';

interface ExpanderProps {
    title: string;
    children: ReactNode;
}

const Expander: FC<ExpanderProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [overflow, setOverflow] = useState<'visible' | 'hidden'>('visible');

    const handleOpen = () => {
        setIsOpen(prev => !prev);
        setOverflow('hidden');

        setTimeout(() => {
            setOverflow('visible');
        }, 300); // 500 -> transitions time
        // grid height animation only works with overflow:hidden but we need visible for select
    };

    return (
        <Block className={cn(styles.block, { [styles.open]: isOpen })}>
            <div onClick={handleOpen} className={styles.dropDownWrapper}>
                <h2 className={cn(styles.title, 'body-14M')}>{title}</h2>
                <i className={cn(styles.dropDownIcon, 'icon-drop-down', { [styles.open]: isOpen })}></i>
            </div>

            <div className={cn(styles.wrapper, { [styles.isOpen]: isOpen })}>
                <div className={cn(styles[isOpen ? overflow : 'hidden'])}>{children}</div>
            </div>
        </Block>
    );
};

export default Expander;
