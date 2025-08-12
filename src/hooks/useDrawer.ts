import { useState } from 'react';

const useDrawer = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => setIsDrawerOpen(prev => !prev);

    return { isDrawerOpen, toggleDrawer };
};

export default useDrawer;
