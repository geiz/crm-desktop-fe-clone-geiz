import { CSSObjectWithLabel } from 'react-select';

import { Job } from 'types/jobTypes';

export interface SearchSelectOption {
    value: Job['id'];
    data: { jobId: Job['id']; clientName: string };
}

export const wideMenuStyle: CSSObjectWithLabel = {
    width: '36rem',
    padding: '0 0.2rem 1.2rem'
};
