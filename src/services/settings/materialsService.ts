import { SETTINGS_ENDPOINTS } from 'constants/endpoints';
import { apiRequest } from 'services/apiUtils';
import { parametrizeURL } from 'services/utils';
import { Method } from 'types/common';
import { Material, MaterialPriceFormValues } from 'types/settingsTypes';

const formatMaterialPayload = (data: MaterialPriceFormValues) => ({
    businessUnitId: data.businessUnit?.value,
    name: data.name,
    price: data.price,
    description: data.description
});

export const getAllMaterials = (page: number, limit: number) =>
    apiRequest<Material[]>({
        url: SETTINGS_ENDPOINTS.materials,
        method: Method.GET,
        params: { page, limit },
        withPagination: true
    });

export const deleteMaterial = (materialId: string) =>
    apiRequest<string>({
        url: parametrizeURL(SETTINGS_ENDPOINTS.materialById, { materialId }),
        method: Method.DELETE
    });

export const createMaterial = (data: MaterialPriceFormValues): Promise<Material> =>
    apiRequest<Material>({ url: SETTINGS_ENDPOINTS.materials, method: Method.POST, data: formatMaterialPayload(data) });

export const getMaterial = (materialId: string) =>
    apiRequest<Material>({ url: parametrizeURL(SETTINGS_ENDPOINTS.materialById, { materialId }), method: Method.GET });

export const updateMaterial = (data: MaterialPriceFormValues, materialId: string) =>
    apiRequest<Material>({
        url: parametrizeURL(SETTINGS_ENDPOINTS.materialById, { materialId }),
        method: Method.PUT,
        data: formatMaterialPayload(data)
    });
