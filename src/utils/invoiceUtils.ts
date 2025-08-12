import dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'constants/common';

export const formatInvoiceDetailsData = (section: Job['details']) => {
    return [
        {
            title: 'Created',
            data: dayjs.unix(section.createdAt).format(DATE_TIME_FORMAT)
        },
        {
            title: 'Job ID',
            data: section.leadSource?.name
        },
        {
            title: 'Category',
            data: capitalizeFirst(section.category)
        }
    ];
};
