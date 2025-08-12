import cn from 'classnames';

import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { SETTINGS_SIDEBAR_NAV } from 'constants/routes';
import { SettingsNavItem, SidebarRoute } from 'types/settingsTypes';

import styles from './SettingsSidebar.module.css';

const Sidebar = () => {
    const location = useLocation();
    const subMenuRefs = useRef<Record<string, HTMLElement | null>>({});

    const currentMenu = SETTINGS_SIDEBAR_NAV.find(({ routes }) => routes.some(({ path }) => path === location.pathname))?.name || null;
    const [openMenu, setOpenMenu] = useState<string | null>(currentMenu);

    useEffect(() => {
        Object.entries(subMenuRefs.current).forEach(([menu, el]) => {
            if (el) {
                el.style.height = openMenu === menu ? `${el.scrollHeight}px` : '0px';
            }
        });
    }, [openMenu]);

    return (
        <nav className={styles.sidebar}>
            <h1 className={cn(styles.title, 'h-20B')}>Settings</h1>

            {SETTINGS_SIDEBAR_NAV.map(({ name, routes }: SettingsNavItem) => (
                <div className={styles.menuItem} key={name}>
                    <button
                        className={cn(styles.menuButton, 'body-14M', { [styles.active]: openMenu === name })}
                        onClick={() => setOpenMenu(prev => (prev === name ? null : name))}>
                        {name}
                        <i className={cn(styles.arrow, openMenu === name && styles.rotate180, 'icon-drop-down')}></i>
                    </button>
                    <div
                        ref={(el: HTMLDivElement | null) => {
                            subMenuRefs.current[name] = el;
                        }}
                        className={cn(styles.subMenu, { [styles.open]: openMenu === name })}>
                        {routes.map((nested: SidebarRoute) => (
                            <NavLink
                                key={nested.name}
                                to={nested.path}
                                className={({ isActive }: { isActive: boolean }) =>
                                    cn(styles.link, 'body-12M', { [styles.active]: isActive })
                                }>
                                {nested.name}
                            </NavLink>
                        ))}
                    </div>
                </div>
            ))}
        </nav>
    );
};

export default Sidebar;
