import cn from 'classnames';

import { FC, ReactNode } from 'react';
import { useState } from 'react';

import styles from './Tabs.module.css';

interface TabsProps {
    tabsData: Record<string, ReactNode>;
    tabsContainerStyle?: string;
    tabNavBtnStyle?: string;
}

const Tabs: FC<TabsProps> = ({ tabsData, tabsContainerStyle, tabNavBtnStyle }) => {
    const tabNames = Object.keys(tabsData);
    const [activeTab, setActiveTab] = useState(tabNames[0]);

    return (
        <div className={cn(styles.tabsContainer, tabsContainerStyle)}>
            <ul className={styles.tabNavList} role='tablist'>
                {tabNames.map(tab => (
                    <li
                        key={tab}
                        role='tab'
                        aria-selected={tab === activeTab}
                        className={cn(styles.tabNavItem, tabNavBtnStyle, 'body-14M', { [styles.active]: tab === activeTab })}
                        onClick={() => setActiveTab(tab)}>
                        {tab}
                    </li>
                ))}
            </ul>
            {tabsData[activeTab]}
        </div>
    );
};

export default Tabs;
