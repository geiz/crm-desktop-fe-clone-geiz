import cn from 'classnames';

import { ComponentProps, forwardRef } from 'react';
import RSelect, { CSSObjectWithLabel, components } from 'react-select';

import ErrorMessage from 'components/ui/ErrorMessage';
import getCustomStyles from 'components/ui/Input/customSelectStyles';

import styles from './Select.module.css';

export interface SelectProps extends ComponentProps<typeof RSelect> {
    className?: string;
    options: unknown[];
    label?: string;
    errorMessage?: string;
    disabled?: boolean;
    isMulti?: boolean;
    menuStyle?: CSSObjectWithLabel;
    helperText?: string;
    hideDropdownIndicator?: boolean;
}

const Select = forwardRef(
    (
        {
            className,
            options,
            label,
            helperText,
            errorMessage,
            disabled = false,
            isMulti,
            menuStyle,
            hideDropdownIndicator = false,
            ...props
        }: SelectProps,
        ref
    ) => {
        const customComponents = {
            MultiValueRemove: (props: any) => (
                <components.MultiValueRemove {...props}>
                    <i className='icon-close-l' />
                </components.MultiValueRemove>
            ),
            DropdownIndicator: hideDropdownIndicator
                ? () => null
                : (props: any) => (
                      <components.DropdownIndicator {...props}>
                          <i className='icon-drop-down' />
                      </components.DropdownIndicator>
                  )
        };

        return (
            <div className={cn(styles.selectWrap, className)}>
                {label && <label className={cn(styles.label, 'body-12R')}>{label}</label>}
                <RSelect
                    options={options}
                    classNames={{
                        placeholder: () => 'body-16R',
                        singleValue: () => 'body-16R',
                        multiValueLabel: () => 'body-12M',
                        menu: () => 'body-14M',
                        input: () => 'body-16R'
                    }}
                    styles={getCustomStyles({ errorMessage, disabled, isMulti, menuStyle })}
                    components={customComponents}
                    isMulti={isMulti}
                    isDisabled={disabled}
                    noOptionsMessage={() => (options.length > 0 ? undefined : null)}
                    loadingMessage={() => null}
                    ref={ref}
                    {...props}
                />

                {errorMessage ? (
                    <ErrorMessage message={errorMessage} className={styles.error} />
                ) : helperText ? (
                    <span className={cn(styles.helperText, 'body-12R')}>{helperText}</span>
                ) : null}
            </div>
        );
    }
);

export default Select;
