import cn from 'classnames';

import type { CSSObjectWithLabel, GroupBase } from 'react-select';
import CreatableSelect, { CreatableProps } from 'react-select/creatable';

import ErrorMessage from 'components/ui/ErrorMessage';
import getCustomStyles from 'components/ui/Input/customSelectStyles';
import Tooltip from 'components/ui/Tooltip';

import { SelectOption } from 'types/common';

import styles from './CreatableSelect.module.css';

export interface SelectProps extends Partial<CreatableProps<SelectOption, boolean, GroupBase<SelectOption>>> {
    label?: string;
    options: SelectOption[];
    errorMessage?: string;
    isMulti?: boolean;
    menuStyle?: CSSObjectWithLabel;
    disabled?: boolean;
    tooltipText?: string;
    className?: string;
}

const MyCreatableSelect = ({
    label,
    options,
    errorMessage,
    isMulti,
    menuStyle,
    disabled = false,
    className,
    tooltipText,
    ...props
}: SelectProps) => {
    return (
        <div className={cn(styles.container, className)}>
            {label && (
                <label className={cn(styles.label, 'body-12R')}>
                    {label}
                    {tooltipText && (
                        <Tooltip trigger='hover' placement='right' text={tooltipText}>
                            <i className={cn(styles.tooltipIcon, 'icon-info')} />
                        </Tooltip>
                    )}
                </label>
            )}
            <CreatableSelect
                {...props}
                styles={getCustomStyles({ errorMessage, disabled, isMulti, menuStyle })}
                options={options}
                formatCreateLabel={inputValue => `${inputValue} (New Item)`}
                isMulti={isMulti}
                isDisabled={disabled}
                classNames={{
                    placeholder: () => 'body-16R',
                    singleValue: () => 'body-16R',
                    multiValueLabel: () => 'body-12M',
                    menu: () => 'body-14M',
                    input: () => 'body-16R'
                }}
            />
            <ErrorMessage message={errorMessage} className={styles.error} />
        </div>
    );
};

export default MyCreatableSelect;
