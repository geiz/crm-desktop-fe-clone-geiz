import { useState } from 'react';

export interface UseTableCellPopoverReturn {
    isEdit: boolean;
    openEditPopover: () => void;
    closeEditPopover: () => void;
}

const useTableCellPopover = (): UseTableCellPopoverReturn => {
    const [isEdit, setIsEdit] = useState(false);

    const openEditPopover = () => setIsEdit(true);
    const closeEditPopover = () => setIsEdit(false);

    return { isEdit, openEditPopover, closeEditPopover };
};

export default useTableCellPopover;
