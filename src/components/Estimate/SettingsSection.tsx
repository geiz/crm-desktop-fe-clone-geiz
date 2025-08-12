import cn from 'classnames';

import { memo } from 'react';

import styles from './SettingsSection.module.css';

import 'rsuite/Divider/styles/index.css';

import AddDivider from 'components/AddDivider/AddDivider';

interface Props {
    name: string;
    addName: string;
    count: number;
    canEdit: boolean;
    children?: React.ReactNode;
    onAdd: () => void;
    containerStyle?: string;
}

const SettingsSection = ({ name, addName, count, canEdit, children, onAdd, containerStyle }: Props) => {
    return (
        <div className={cn(styles.container, { [styles.onlyRead]: !canEdit }, containerStyle)}>
            <p className={cn('h-16B', styles.title)}>
                {name} <span className={cn('body-16M', styles.count)}>{count > 1 ? `(${count})` : ''}</span>
            </p>
            {children}
            {canEdit && <AddDivider addName={addName} onAdd={onAdd} />}
        </div>
    );
};

export default memo(SettingsSection);
