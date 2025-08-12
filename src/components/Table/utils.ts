import { FormatTableValueProps, TableCellColumn, TableCellValue } from './types';
import dayjs from 'dayjs';

import { DATE_ALPHABETICAL } from 'constants/common';
import capitalizeString from 'utils/capitalizeString';
import formatPriceValue from 'utils/formatPriceValue';
import phoneToMaskString from 'utils/phoneToMaskString';

export const formatCells = <T>(item: T, columns: TableCellColumn[]) =>
    columns
        .filter(col => col.key !== 'actions')
        .map(col => ({
            value: item[col.key as keyof T] as TableCellValue, // value of the cell
            typography: col.typography, // cell typography
            format: col.format, // lowercase, capitalize, uppercase
            handleValue: col.handleValue, // function to handle the value
            isDescription: col.isDescription,
            nowrap: col.nowrap,
            key: col.key,
            label: col.label,
            components: col.components
        }));

export const formatValue = ({ value, format, handleValue }: Partial<FormatTableValueProps> = {}) => {
    let result = value;

    if (handleValue) result = handleValue(value);
    if (format === 'capitalize' && value) result = capitalizeString(String(value));
    if (format === 'date') result = dayjs.unix(Number(value)).format(DATE_ALPHABETICAL);
    if (format === 'phone') result = value ? phoneToMaskString(String(value)) : '';
    if (format === 'price') result = formatPriceValue(Number(value));

    return result;
};

export const colapse = (el: HTMLDivElement) => {
    el.style.height = '1.6rem';
    setTimeout(() => (el.style.whiteSpace = 'nowrap'), 300);
};
export const expand = (el: HTMLDivElement) => {
    el.style.whiteSpace = 'normal';
    el.style.height = `${el.scrollHeight}px`;
};
