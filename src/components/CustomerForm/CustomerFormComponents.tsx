import { AddressSelectOption } from './types';
import cn from 'classnames';

import { OptionProps } from 'react-select';

import styles from './CustomerFormComponents.module.css';

interface EnterAddressProps {
    onClick: () => void;
}
export const EnterAddress = ({ onClick }: EnterAddressProps) => {
    return (
        <div
            className={cn(styles.menuEnterAddress, 'body-14M')}
            onMouseDown={e => {
                e.preventDefault();
                onClick();
            }}>
            Enter Address Manually
        </div>
    );
};

export const MenuOption = (props: OptionProps<unknown, false>) => {
    const { data, innerRef, innerProps, isSelected, isFocused } = props;

    return (
        <div ref={innerRef} {...innerProps} className={cn(styles.menuOption, 'body-12R', { [styles.grey100bg]: isFocused || isSelected })}>
            {(data as AddressSelectOption).label}
        </div>
    );
};
