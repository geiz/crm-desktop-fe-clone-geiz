import { useCallback, useState } from 'react';

import { useDebouncedCallback } from 'hooks/useDebouncedCallback';

type UseVirtualPaginationProps = {
    rowsPerPage?: number;
    loadMore: () => void;
    hasMore: boolean;
    isLoading: boolean;
    onScrollChange?: (scrollTop: number) => void;
};

const useVirtualPagination = ({ rowsPerPage = 10, loadMore, hasMore, isLoading, onScrollChange }: UseVirtualPaginationProps) => {
    const [visiblePage, setVisiblePage] = useState(1);
    const debouncedScrollChange = useDebouncedCallback((scrollTop: number) => {
        if (onScrollChange) {
            onScrollChange(scrollTop);
        }
    }, 500);

    const handleScroll = useCallback(
        (e: React.UIEvent<HTMLDivElement>) => {
            const container = e.currentTarget;
            const scrollTop = container.scrollTop;

            debouncedScrollChange(scrollTop);

            const rowHeight = container.firstElementChild?.clientHeight || 0;
            if (!rowHeight) return;

            const firstVisibleRow = Math.floor(scrollTop / rowHeight);
            const currentPage = Math.floor(firstVisibleRow / rowsPerPage) + 1;
            setVisiblePage(currentPage);

            const isNearBottom = container.scrollHeight - (scrollTop + container.clientHeight) < 50;
            if (isNearBottom && !isLoading && hasMore) {
                loadMore();
            }
        },
        [rowsPerPage, loadMore, hasMore, isLoading, debouncedScrollChange]
    );

    return { handleScroll, visiblePage };
};

export default useVirtualPagination;
