import { useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

import { useDebouncedCallback } from 'hooks/useDebouncedCallback';

type UseIntersectionPaginationProps = {
    loadMore: () => void;
    hasMore: boolean;
    isLoading: boolean;
    onScrollChange?: (scrollTop: number) => void;
    threshold?: number;
    rootMargin?: string;
};

const useIntersectionPagination = ({
    loadMore,
    hasMore,
    isLoading,
    onScrollChange,
    threshold = 0.1,
    rootMargin = '100px'
}: UseIntersectionPaginationProps) => {
    const debouncedScrollChange = useDebouncedCallback((scrollTop: number) => {
        if (onScrollChange) {
            onScrollChange(scrollTop);
        }
    }, 500);

    const { ref: intersectionRef, inView } = useInView({
        threshold,
        rootMargin,
        onChange: inView => {
            if (inView && !isLoading && hasMore) {
                loadMore();
            }
        }
    });

    const handleScroll = useCallback(
        (e: React.UIEvent<HTMLDivElement>) => {
            const container = e.currentTarget;
            const scrollTop = container.scrollTop;
            debouncedScrollChange(scrollTop);
        },
        [debouncedScrollChange]
    );

    return {
        intersectionRef,
        handleScroll,
        inView
    };
};

export default useIntersectionPagination;
