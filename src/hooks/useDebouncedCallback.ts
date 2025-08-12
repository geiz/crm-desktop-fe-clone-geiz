import { useCallback, useEffect, useRef } from 'react';

// callback might contain arguments of different types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDebouncedCallback = <A extends any[]>(callback: (...args: A) => void, wait: number) => {
    // track args & timeout handle between calls
    const argsRef = useRef<A>(null);
    const timeout = useRef<ReturnType<typeof setTimeout>>(null);

    const cleanup = useCallback(() => {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
    }, []);

    // make sure our timeout gets cleared if
    // our consuming component gets unmounted
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => cleanup, []);

    return useCallback(
        (...args: A) => {
            // capture latest args
            argsRef.current = args;

            // clear debounce timer
            cleanup();

            // start waiting again
            timeout.current = setTimeout(() => {
                if (argsRef.current) {
                    callback(...argsRef.current);
                }
            }, wait);
        },
        [callback, cleanup, wait]
    );
};
