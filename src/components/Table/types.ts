import { RefundPayment } from 'types/invoiceTypes';

export interface ComponentsProps<T> {
    rowData: T;
}

export type TableBaseItem = {
    id: string | number;
    parentId?: number;
    refundIcon?: string;
    refunds?: RefundPayment[];
};

export interface TableComponents<T> {
    Row?: (props: ComponentsProps<T>) => React.ReactNode;
}

export interface TableCellColumn extends Omit<TableCellProps, 'value'> {
    label: string;
    components?: boolean;
}

export type TableCellValue = string | number | boolean | undefined | null;
export type TableCellFormat = 'lowercase' | 'capitalize' | 'uppercase' | 'date' | 'price' | 'phone';

export interface TableCellProps extends Partial<FormatTableValueProps> {
    typography?: string;
    isDescription?: boolean;
    nowrap?: boolean;
    key: string;
    components?: boolean;
    label: string;
}

export interface FormatTableValueProps {
    value: TableCellValue;
    format?: TableCellFormat;
    handleValue: (value: TableCellValue) => string;
}
