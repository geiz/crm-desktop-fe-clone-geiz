import cn from 'classnames';

import styles from './TableHead.module.css';

const TableHead = ({ columns, gridTemplateColumns }) => {
    return (
        <div className={cn(styles.tableHead, 'table-head')} style={{ gridTemplateColumns }}>
            {columns.map(col => (
                <div key={col} className={cn(styles.cell, styles[col], 'body-12R')}>
                    {col}
                </div>
            ))}
        </div>
    );
};

export default TableHead;
