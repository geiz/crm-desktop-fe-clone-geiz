import { SETTINGS_ENDPOINTS } from 'constants/endpoints';
import { apiRequest } from 'services/apiUtils';
import { Company, Method } from 'types/common';
import { CompanyFormValues } from 'types/settingsTypes';
import maskToDigitString from 'utils/maskToDigitString';

export const updateCompany = (data: CompanyFormValues) => {
    const { company } = data;

    return apiRequest<Company>({
        url: SETTINGS_ENDPOINTS.companies,
        method: Method.PUT,
        data: { ...company, phone: company?.phone ? maskToDigitString(company.phone) : null }
    });
};

export const getCompany = () => apiRequest<Company>({ url: SETTINGS_ENDPOINTS.companies, method: Method.GET });
