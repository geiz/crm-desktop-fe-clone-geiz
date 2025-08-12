import { FC } from 'react';
import { Outlet } from 'react-router-dom';

const StatusesLayout: FC = () => {
    return (
        <>
            <Outlet />
        </>
    );
};

export default StatusesLayout;
