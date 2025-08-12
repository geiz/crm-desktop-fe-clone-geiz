import { SETTINGS_ENDPOINTS } from 'constants/endpoints';
import { apiRequest } from 'services/apiUtils';
import { parametrizeURL } from 'services/utils';
import { Method } from 'types/common';
import { JobType, JobTypesFormValues } from 'types/settingsTypes';

const formatJobTypePayload = (data: JobTypesFormValues) => ({
    summary: data.summary,
    serviceId: data.serviceType?.value,
    componentId: data.componentType?.value
});

export const getAllJobTypes = (page: number, limit: number) =>
    apiRequest<JobType[]>({
        url: SETTINGS_ENDPOINTS.jobTypes,
        method: Method.GET,
        params: { page, limit },
        withPagination: true
    });

export const deleteJobType = (jobTypeId: string) =>
    apiRequest({
        url: parametrizeURL(SETTINGS_ENDPOINTS.jobTypeById, { jobTypeId }),
        method: Method.DELETE
    });

export const createJobService = (data: JobTypesFormValues) => {
    return apiRequest<JobType>({ url: SETTINGS_ENDPOINTS.jobTypes, method: Method.POST, data: formatJobTypePayload(data) });
};

export const getJobType = (jobTypeId: string) =>
    apiRequest<JobType>({ url: parametrizeURL(SETTINGS_ENDPOINTS.jobTypeById, { jobTypeId }), method: Method.GET });

export const updateJobType = (data: JobTypesFormValues, jobTypeId: string) => {
    return apiRequest<JobType>({
        url: parametrizeURL(SETTINGS_ENDPOINTS.jobTypeById, { jobTypeId }),
        method: Method.PUT,
        data: formatJobTypePayload(data)
    });
};
