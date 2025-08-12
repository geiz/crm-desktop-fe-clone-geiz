import { CSSObjectWithLabel, GroupBase, StylesConfig } from 'react-select';

import { SelectOption } from 'types/common';

interface GetCustomStylesArgs {
    errorMessage?: string;
    disabled?: boolean;
    isMulti?: boolean;
    menuStyle?: CSSObjectWithLabel;
}

const getCustomStyles = ({
    errorMessage,
    disabled,
    isMulti,
    menuStyle
}: GetCustomStylesArgs): StylesConfig<SelectOption, boolean, GroupBase<SelectOption>> => ({
    container: (base: CSSObjectWithLabel) => ({ ...base, width: '100%' }),
    control: (base: CSSObjectWithLabel, state) => ({
        ...base,
        padding: '0',
        height: isMulti ? 'auto' : '4.4rem',
        minHeight: '4.4rem',
        width: '100%',
        color: 'var(--color-grey-800)',
        border: errorMessage
            ? '0.1rem solid var(--color-red-300)'
            : state.isFocused
              ? '0.1rem solid var(--color-blue-300)'
              : '0.1rem solid var(--color-grey-200)',
        borderRadius: '0.8rem',
        background: disabled ? 'var(--color-grey-100)' : 'var(--color-white)',
        outline: state.isFocused && !errorMessage ? '0.2rem solid var(--color-blue-200)' : 'none',
        transition: 'border-color 0.3s ease',
        boxShadow: 'none',
        '&:hover': {
            borderColor: errorMessage ? 'var(--color-red-300)' : 'var(--color-blue-300)'
        },
        cursor: disabled ? 'not-allowed' : 'pointer'
    }),
    menu: (base: CSSObjectWithLabel) => ({
        ...base,
        padding: '0.2rem',
        marginTop: '1.2rem',
        border: '0.1rem solid var(--color-grey-200)',
        borderRadius: '0.8rem',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-8)',
        ...menuStyle
    }),
    menuList: (base: CSSObjectWithLabel) => ({
        ...base,
        padding: '0',
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--color-grey-400) transparent'
    }),
    option: (base: CSSObjectWithLabel, state) => ({
        ...base,
        padding: '1.3rem 1.2rem',
        fontSize: '1.4rem',
        color: state.isSelected ? 'var(--color-grey-800)' : 'var(--color-grey-600)',
        backgroundColor: state.isSelected ? 'var(--color-grey-100)' : 'var(--color-white)',
        borderRadius: '0.8rem',
        cursor: 'pointer',
        '&:hover': {
            color: 'var(--color-grey-800)',
            backgroundColor: 'var(--color-grey-100)'
        }
    }),
    singleValue: (base: CSSObjectWithLabel) => ({
        ...base,
        color: disabled ? 'var(--color-grey-400)' : 'var(--color-grey-800)'
    }),
    placeholder: (base: CSSObjectWithLabel) => ({
        ...base,
        color: disabled ? 'var(--color-grey-400)' : 'var(--color-grey-600)',
        opacity: 1
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    indicatorsContainer: (base: CSSObjectWithLabel, state) => ({
        ...base,
        padding: '0',
        i: {
            fontSize: '1.6rem',
            color: state.selectProps.menuIsOpen ? 'var(--color-grey-800)' : 'var(--color-grey-600)'
        }
    }),
    dropdownIndicator: (base: CSSObjectWithLabel, state) => ({
        ...base,
        padding: '0.8rem',
        transition: 'transform 0.3s ease',
        transform: state.selectProps.menuIsOpen ? 'scaleY(-1)' : 'scaleY(1)'
    }),
    valueContainer: (base: CSSObjectWithLabel) => ({
        ...base,
        padding: '0.9rem 1.2rem',
        gap: '0.4rem'
    }),
    input: (base: CSSObjectWithLabel) => ({
        ...base,
        padding: '0',
        margin: '0'
    }),
    multiValue: (base: CSSObjectWithLabel) => ({
        ...base,
        padding: '0.3rem 0.8rem',
        margin: '0',
        columnGap: '0.6rem',
        backgroundColor: 'var(--color-blue-100)',
        border: '0.1rem solid var(--color-grey-200)',
        borderRadius: '0.4rem'
    }),
    multiValueLabel: (base: CSSObjectWithLabel) => ({
        ...base,
        padding: '0',
        paddingLeft: '0',
        color: 'var(--color-grey-700)',
        fontSize: '1.4rem'
    }),
    multiValueRemove: (base: CSSObjectWithLabel) => ({
        ...base,
        padding: '0',
        color: 'var(--color-grey-600)',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'var(--color-blue-100)',
            color: 'var(--color-grey-600)'
        },
        svg: {
            width: '1.6rem',
            height: '1.6rem'
        }
    }),
    clearIndicator: (base: CSSObjectWithLabel) => ({
        ...base,
        color: 'var(--color-grey-600)',
        cursor: 'pointer',
        svg: {
            width: '1.6rem',
            height: '1.6rem'
        }
    })
});

export default getCustomStyles;
