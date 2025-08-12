import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';

import AppRouter from 'routes/AppRouter';

dayjs.extend(utc);
dayjs.extend(timezone);

const App = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <AppRouter />
        <ToastContainer draggable pauseOnHover hideProgressBar autoClose={4000} position='bottom-center' />
    </Suspense>
);

export default App;
