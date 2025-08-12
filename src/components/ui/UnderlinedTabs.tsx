import cn from 'classnames';

import { memo, useEffect, useRef, useState } from 'react';

import Button from 'components/ui/Button';

import styles from './UnderlinedTabs.module.css';

interface Props {
    isLoading?: boolean;
    onCreateEstimate: () => void;
}

const tabsData = [
    { name: 'Estimate', disabled: false },
    { name: 'Invoice', disabled: false }
];

const UnderlinedTabs = ({ isLoading, onCreateEstimate }: Props) => {
    const [activeTab, setActiveTab] = useState(tabsData[0].name);
    const tabsRef = useRef(null);

    useEffect(() => {
        const tabsContainer = tabsRef.current;
        if (!tabsContainer) return;

        const activeTabElement = tabsContainer.querySelector(`.${styles.active}`);
        if (activeTabElement) {
            setLineStyle({
                width: `${activeTabElement.offsetWidth}px`,
                transform: `translateX(${activeTabElement.offsetLeft}px)`
            });
        }
    }, [activeTab]);

    const [lineStyle, setLineStyle] = useState({ width: '0px', transform: 'translateX(0px)' });

    return (
        <div className={styles.tabsContainer}>
            <ul className={styles.tabs} role='tablist' ref={tabsRef}>
                {tabsData.map(tab => (
                    <li
                        key={tab.name}
                        role='tab'
                        aria-selected={tab.name === activeTab}
                        className={cn(styles.tab, 'body-14M', {
                            [styles.active]: tab.name === activeTab,
                            [styles.disabled]: tab.disabled
                        })}
                        onClick={tab.disabled ? undefined : () => setActiveTab(tab.name)}>
                        {tab.name}
                    </li>
                ))}
                <li className={styles.line} style={lineStyle} />
            </ul>
            <div className={styles.tabContent}>
                <div className={styles.underlineTabContent}>
                    {activeTab === 'Estimate' && (
                        <Button icon='plus' btnStyle='outlined-s' isLoading={isLoading} onClick={onCreateEstimate}>
                            Create an Estimate
                        </Button>
                    )}
                    {activeTab === 'Invoice' && (
                        <Button icon='plus' btnStyle='outlined-s'>
                            Create an Invoice
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

UnderlinedTabs.displayName = 'UnderlinedTabs';

export default memo(UnderlinedTabs);
