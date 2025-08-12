import cn from 'classnames';

import { OptionProps } from 'react-select';

import { SearchSelectOption } from './utils';
import highlightMatch from 'utils/highlightMatch';

import styles from './SelectComponents.module.css';

export const SearchHeader = () => <div className={cn(styles.searchHeader, 'body-12SM')}>Jobs</div>;

export const MenuList = ({ children }: { children: React.ReactNode }) => <div className={styles.menuListWrap}>{children}</div>;

export const CustomOption = (props: OptionProps<unknown, false>) => {
    const { data, innerRef, innerProps, isSelected, isFocused, selectProps } = props;
    const searchTerm = selectProps.inputValue || '';

    return (
        <div ref={innerRef} {...innerProps} className={cn('body-12R', styles.option, { [styles.bgGrey100]: isFocused || isSelected })}>
            <div>{highlightMatch(String((data as SearchSelectOption).data.jobId), searchTerm)}</div>
            <div className={styles.clientName}>{highlightMatch((data as SearchSelectOption).data.clientName, searchTerm)}</div>
        </div>
    );
};

export const NoOptions = () => (
    <div className={styles.noMatches}>
        <i className={cn('icon-no-data', styles.searchIcon)} />
        <p className={cn('body-12M', styles.grey700)}>No matches found.</p>
        <p className='body-12R'>Try different keywords.</p>
    </div>
);
