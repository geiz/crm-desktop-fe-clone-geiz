import cn from 'classnames';

import React, { ReactNode } from 'react';

import Button from 'components/ui/Button';

import styles from './SettingsHeader.module.css';

interface SettingsHeaderProps {
    children?: ReactNode;
    title: string;
    btnText?: string;
    btnWidth?: string | number;
    className?: string;
    onAddClick: () => void;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({ children, title, btnText, btnWidth, className, onAddClick }) => {
    return (
        <div className={cn(styles.header, className)}>
            <h2 className={cn(styles.title, 'h-16B')}>{title}</h2>
            <Button style={{ width: btnWidth }} className={styles.addButton} btnStyle='blue-l' icon='plus' onClick={onAddClick}>
                {btnText ? btnText : 'Add New'}
            </Button>
            {children && <div className={styles.content}>{children}</div>}
        </div>
    );
};

export default SettingsHeader;
