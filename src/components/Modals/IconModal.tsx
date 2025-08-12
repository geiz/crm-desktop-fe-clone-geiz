import cn from 'classnames';

import React, { ReactNode } from 'react';

import Modal from 'components/Modals/Modal';

import styles from './IconModal.module.css';

interface IconModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    children: ReactNode;
    icon: { font: string; red?: boolean };
}

const IconModal: React.FC<IconModalProps> = ({ isOpen, onClose, title, subtitle, children, icon }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className={styles.modal}>
            <i className={cn(styles.icon, icon.font, styles[icon.red ? 'red300' : 'grey800'])} />
            <h2 className={cn(styles.title, 'h-16B')}>{title}</h2>
            {subtitle && <p className={cn(styles.subtitle, 'body-14R')}>{subtitle}</p>}
            {children}
        </Modal>
    );
};

export default IconModal;
