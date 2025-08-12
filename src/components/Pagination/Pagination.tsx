import cn from 'classnames';

import styles from './Pagination.module.css';

interface PaginationProps {
    totalItems: number;
    loadedItems: number;
    className?: string;
}

const Pagination = ({ totalItems, loadedItems, className }: PaginationProps) => {
    return (
        <div className={cn(styles.pagination, 'body-12M', className)}>
            1-{loadedItems} of {totalItems}
        </div>
    );
};

export default Pagination;
