import { EffectCallback, useEffect, useRef } from 'react';

export function useDidMount(callback: EffectCallback, cleanupCb?: () => void) {
    const runStatus = useRef(true);

    useEffect(() => {
        if (runStatus.current) {
            callback();
        }

        return () => {
            runStatus.current = false;

            // call additional cleanup if provided
            if (cleanupCb) {
                cleanupCb();
            }
        };
        // Disabled because we are not interested in callback changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
