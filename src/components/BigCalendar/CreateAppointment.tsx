import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { useNavigate } from 'react-router-dom';

import Button from 'components/ui/Button';

dayjs.extend(utc);

export const CreateAppointment = ({ slot: { start } }: { slot: { start: number } }) => {
    const navigate = useNavigate();

    const startUtc = dayjs.utc(start).startOf('hour');
    const endUtc = startUtc.add(1, 'hour');

    return (
        <div>
            <Button
                btnStyle='blue-m'
                onClick={() => {
                    navigate(`/jobs/create?start=${startUtc.unix()}&end=${endUtc.unix()}`);
                }}>
                🔧 Create Job
            </Button>
        </div>
    );
};
