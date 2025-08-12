import { CustomOption, MenuList, NoOptions, SearchHeader } from './SelectComponents';
import cn from 'classnames';

import { useCallback, useMemo, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { MenuListProps, components } from 'react-select';
import { toast } from 'react-toastify';

import Button from 'components/ui/Button';
import Dropdown from 'components/ui/Dropdown';
import { Select } from 'components/ui/Input';
import Tooltip from 'components/ui/Tooltip';

import { SearchSelectOption, wideMenuStyle } from './utils';
import { JOB_ENDPOINTS } from 'constants/endpoints';
import { APP_ROUTES } from 'constants/routes';
import { useAuth } from 'hooks/useAuth';
import useLogout from 'hooks/useLogout';
import { parametrizeRouterURL } from 'routes/utils';
import { apiRequest } from 'services/apiUtils';
import { Method, Role } from 'types/common';
import debounceSearch from 'utils/debounceSearch';
import getAbbreviation from 'utils/getAbbreviation';

import styles from './Header.module.css';
import logo from 'assets/img/logo.svg';

const Header = () => {
    const logoutUser = useLogout();
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState<string>('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchSelectOption[]>([]);
    const { user } = useAuth();

    const dropdownOptions = [{ label: 'Logout', onClick: logoutUser }];

    const menuStyle = searchResults.length > 0 ? wideMenuStyle : {};

    const customSelectComponents = {
        DropdownIndicator: null,
        IndicatorSeparator: null,

        MenuList: (props: MenuListProps) => (
            <components.MenuList {...props}>
                {searchResults.length > 0 && <SearchHeader />}
                <MenuList>{props.children}</MenuList>
            </components.MenuList>
        ),

        Option: CustomOption
    };

    const handleSearch = useCallback(async (str: string) => {
        if (str.length >= 1) {
            setIsSearching(true);

            apiRequest<{ jobId: number; clientName: string }[]>({
                url: JOB_ENDPOINTS.search,
                method: Method.GET,
                params: { searchTerm: str }
            })
                .then(resp => setSearchResults(resp.map(({ jobId, clientName }) => ({ value: jobId, data: { jobId, clientName } }))))
                .catch(err => toast.error(err.message))
                .finally(() => setIsSearching(false));
        }
    }, []);

    const debouncedSearch = useMemo(() => debounceSearch(handleSearch, 300), [handleSearch]);

    const handleSearchChange = (inputValue: string) => {
        setSearchValue(inputValue);
        if (inputValue.length === 0) setSearchResults([]);
        else if (inputValue.length >= 1) debouncedSearch(inputValue);
    };

    const handleSelectChange = (option: unknown) =>
        navigate(parametrizeRouterURL(APP_ROUTES.jobs.item, { jobId: `${(option as SearchSelectOption).value}` }));

    return (
        <div className={styles.header}>
            <div className={cn(styles.headerContainer, 'container')}>
                <Link className={styles.logoLink} to={APP_ROUTES.home.main}>
                    <img className='img-contain' src={logo} alt='logo' />
                </Link>

                <nav className={cn(styles.menu, 'body-14M')}>
                    {/* <NavLink className={styles.navLink} to='/#'>
                        <i className={cn(styles.linkIcon, 'icon-writing')}></i>
                        Contacts
                    </NavLink>
                    <NavLink className={styles.navLink} to={APP_ROUTES.jobs.main}>
                        <i className={cn(styles.linkIcon, 'icon-tablet')}></i>
                        Jobs
                    </NavLink> */}
                    <NavLink className={styles.navLink} to={APP_ROUTES.schedule.main}>
                        <i className={cn(styles.linkIcon, 'icon-small-calendar')}></i>
                        Schedule
                    </NavLink>
                    {/* <NavLink className={styles.navLink} to='/#'>
                        <i className={cn(styles.linkIcon, 'icon-accounting')}></i>
                        Accounting
                    </NavLink>
                    <NavLink className={styles.navLink} to='/#'>
                        <i className={cn(styles.linkIcon, 'icon-price-book')}></i>
                        Price Book
                    </NavLink> */}
                </nav>

                <Link to={APP_ROUTES.jobs.create}>
                    <Button btnStyle='blue-l' icon='plus'>
                        Create Job
                    </Button>
                </Link>

                <Select
                    options={searchResults}
                    value={searchValue}
                    onInputChange={handleSearchChange}
                    onChange={handleSelectChange}
                    isLoading={isSearching}
                    isSearchable={true}
                    noOptionsMessage={NoOptions}
                    filterOption={null}
                    components={customSelectComponents}
                    menuStyle={menuStyle}
                    placeholder='Search'
                    className={styles.search}
                />

                {user?.role === Role.ADMIN && (
                    <nav className={styles.settingsContainer}>
                        <Tooltip text='Settings'>
                            <NavLink className={styles.settings} to={APP_ROUTES.settings.profile}>
                                <i className={cn(styles.settingsIcon, 'icon-settings')}>
                                    <span className={cn(styles.settingsTooltip, 'body-12M')} />
                                </i>
                            </NavLink>
                        </Tooltip>
                    </nav>
                )}

                <div className={styles.accountContainer}>
                    <div className={styles.avatarContainer}>
                        {/* TODO: check tocken decoded data */}
                        {user?.image ? (
                            <img className={styles.avatar} src={'user.image'} alt='user avatar' />
                        ) : (
                            <div className={cn(styles.abbreviation, 'body-14M')}>{user ? getAbbreviation(user.name) : 'n/a'}</div>
                        )}
                    </div>

                    <Dropdown trigger={<i className={cn(styles.avatarIcon, 'icon-drop-down')}></i>} options={dropdownOptions} />
                </div>
            </div>
        </div>
    );
};

export default Header;
