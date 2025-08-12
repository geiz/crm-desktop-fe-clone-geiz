import { useState } from 'react';

import { SETTINGS_ENDPOINTS } from 'constants/endpoints';
import { apiRequest } from 'services/apiUtils';
import { getAllAppointmentTypes } from 'services/appointmentsService';
import { getAllTechnicians } from 'services/settings/userService';
import { BaseItem, Method, SelectOption } from 'types/common';

interface SelectState {
    options: SelectOption[];
    isLoading: boolean;
    summaries?: { value: number; summary: string }[];
}

type JobTypeItem = BaseItem & { summary: string };

const useSelectOptions = () => {
    const formatOptions = (resp: BaseItem[]) => resp.map(el => ({ value: el.id, label: el.name }));
    const initState = { options: [], isLoading: false };

    const [technicians, setTechnicians] = useState<SelectState>(initState);
    const [types, setTypes] = useState<SelectState>(initState);
    const [allTags, setAllTags] = useState<SelectState>(initState);
    const [businessUnits, setBusinessUnits] = useState<SelectState>(initState);
    const [cancelReasons, setCancelReasons] = useState<SelectState>(initState);
    const [leadSources, setLeadSources] = useState<SelectState>(initState);
    const [brands, setBrands] = useState<SelectState>(initState);
    const [jobTypes, setJobTypes] = useState<SelectState>(initState);
    const [serviceTypes, setServiceTypes] = useState<SelectState>(initState);
    const [componentTypes, setComponentTypes] = useState<SelectState>(initState);

    const getTechnicians = (businessUnitId?: number) => {
        setTechnicians(prev => ({ ...prev, isLoading: true }));
        getAllTechnicians(businessUnitId).then(resp => {
            setTechnicians({ options: formatOptions(resp), isLoading: false });
        });
    };

    const getTypes = () => {
        setTypes(prev => ({ ...prev, isLoading: true }));
        getAllAppointmentTypes(100).then(resp => {
            setTypes({ options: formatOptions(resp), isLoading: false });
        });
    };

    const getAllTags = () => {
        setAllTags(prev => ({ ...prev, isLoading: true }));
        apiRequest<BaseItem[]>({ url: SETTINGS_ENDPOINTS.tags, method: Method.GET, params: { limit: 100 } }).then(resp => {
            setAllTags({ options: formatOptions(resp), isLoading: false });
        });
    };

    const getBusinessUnits = () => {
        setBusinessUnits(prev => ({ ...prev, isLoading: true }));
        apiRequest<BaseItem[]>({ url: SETTINGS_ENDPOINTS.businessUnits, method: Method.GET, params: { limit: 100 } }).then(resp =>
            setBusinessUnits({ options: formatOptions(resp), isLoading: false })
        );
    };

    const getCancelationReasons = () => {
        setCancelReasons(prev => ({ ...prev, isLoading: true }));
        apiRequest<BaseItem[]>({ url: SETTINGS_ENDPOINTS.cancelReasons, method: Method.GET, params: { limit: 100 } }).then(resp =>
            setCancelReasons({ options: formatOptions(resp), isLoading: false })
        );
    };

    const getLeadSources = () => {
        setLeadSources(prev => ({ ...prev, isLoading: true }));
        apiRequest<BaseItem[]>({ url: SETTINGS_ENDPOINTS.leadSources, method: Method.GET, params: { limit: 100 } }).then(resp =>
            setLeadSources({ options: formatOptions(resp), isLoading: false })
        );
    };

    const getBrands = () => {
        setBrands(prev => ({ ...prev, isLoading: true }));
        apiRequest<BaseItem[]>({ url: SETTINGS_ENDPOINTS.brands, method: Method.GET, params: { limit: 100 } }).then(resp =>
            setBrands({ options: formatOptions(resp), isLoading: false })
        );
    };

    const getJobTypes = () => {
        setJobTypes(prev => ({ ...prev, isLoading: true }));
        apiRequest<JobTypeItem[]>({ url: SETTINGS_ENDPOINTS.jobTypes, method: Method.GET, params: { limit: 100 } }).then(resp =>
            setJobTypes({
                options: formatOptions(resp),
                isLoading: false,
                summaries: resp.map(el => ({ value: el.id, summary: el.summary }))
            })
        );
    };

    const getServiceTypes = () => {
        setServiceTypes(prev => ({ ...prev, isLoading: true }));
        apiRequest<BaseItem[]>({ url: SETTINGS_ENDPOINTS.serviceTypes, method: Method.GET, params: { limit: 100 } }).then(resp =>
            setServiceTypes({ options: formatOptions(resp), isLoading: false })
        );
    };

    const createServiceType = (name: string) => {
        setServiceTypes(prev => ({ ...prev, isLoading: true }));

        return apiRequest<BaseItem>({
            url: SETTINGS_ENDPOINTS.serviceTypes,
            method: Method.POST,
            data: { name }
        }).then(resp => {
            const newOption = { value: resp.id, label: resp.name };
            setServiceTypes(prev => ({
                options: [...prev.options, newOption],
                isLoading: false
            }));
            return newOption;
        });
    };

    const getComponentTypes = () => {
        setComponentTypes(prev => ({ ...prev, isLoading: true }));
        apiRequest<BaseItem[]>({ url: SETTINGS_ENDPOINTS.componentTypes, method: Method.GET, params: { limit: 100 } }).then(resp =>
            setComponentTypes({ options: formatOptions(resp), isLoading: false })
        );
    };

    const createComponentType = (name: string) => {
        setComponentTypes(prev => ({ ...prev, isLoading: true }));
        return apiRequest<BaseItem>({
            url: SETTINGS_ENDPOINTS.componentTypes,
            method: Method.POST,
            data: { name }
        }).then(resp => {
            const newOption = { value: resp.id, label: resp.name };
            setComponentTypes(prev => ({
                options: [...prev.options, newOption],
                isLoading: false
            }));
            return newOption;
        });
    };

    return {
        technicians,
        getTechnicians,
        types,
        getTypes,
        allTags,
        getAllTags,
        businessUnits,
        getBusinessUnits,
        cancelReasons,
        getCancelationReasons,
        serviceTypes,
        getServiceTypes,
        createServiceType,
        componentTypes,
        getComponentTypes,
        createComponentType,
        leadSources,
        getLeadSources,
        brands,
        getBrands,
        jobTypes,
        getJobTypes
    };
};

export default useSelectOptions;
