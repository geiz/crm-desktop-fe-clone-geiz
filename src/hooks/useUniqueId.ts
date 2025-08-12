import { useMemo } from 'react';
import { nanoid } from 'nanoid';

const useUniqueId = (id?: string, name?: string, prefix: string = 'input'): string => {
    return useMemo(() => {
        return id || `${name || prefix}-${nanoid(4)}`;
    }, [id, name, prefix]);
};

export default useUniqueId;
