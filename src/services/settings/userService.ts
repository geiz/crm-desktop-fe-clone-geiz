import { USERS_ENDPOINTS } from 'constants/endpoints';
import { apiRequest } from 'services/apiUtils';
import { parametrizeURL } from 'services/utils';
import { BaseItem, Method } from 'types/common';
import { CustomFieldsRequest, CustomFieldsResponse } from 'types/settingsTypes';

export const getAllTechnicians = (businessUnitId?: number) => {
    return apiRequest<BaseItem[]>({
        url: USERS_ENDPOINTS.technicians,
        method: Method.GET,
        params: businessUnitId ? { businessUnitId } : undefined
    });
};

export const updateCustomFields = (userId: number, payload: CustomFieldsRequest) => {
    return apiRequest<CustomFieldsResponse>({
        url: parametrizeURL(USERS_ENDPOINTS.updateCustomFields, { userId }),
        method: Method.PUT,
        data: payload
    });
};
