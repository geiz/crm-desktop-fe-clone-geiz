import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { BaseItem, Note } from 'types/common';
import { EstimateEntity, EstimateMaterial, EstimateService, ItemPrices, MaterialWithPrices, ServiceWithPrices } from 'types/estimateTypes';

export interface EstimateState {
    estimateInfo: EstimateEntity | null;
}

const initialState: EstimateState = { estimateInfo: null };

const estimateSlice = createSlice({
    name: 'estimate',
    initialState,
    reducers: {
        storeEstimate: (state, action: PayloadAction<EstimateEntity>) => {
            state.estimateInfo = action.payload;
        },
        clearEstimateInfo: state => {
            state.estimateInfo = null;
        },
        deleteNote: (state, action: PayloadAction<Note['id']>) => {
            if (state.estimateInfo) {
                state.estimateInfo.notes = state.estimateInfo.notes.filter(el => el.id !== action.payload);
            }
        },
        addEditNote: (state, action: PayloadAction<Note>) => {
            const { id } = action.payload;
            if (state.estimateInfo) {
                state.estimateInfo.notes = state.estimateInfo.notes.some(note => note.id === id)
                    ? state.estimateInfo.notes.map(note => (note.id === id ? action.payload : note))
                    : [...state.estimateInfo.notes, action.payload];
            }
        },
        storeTags: (state, action: PayloadAction<BaseItem[]>) => {
            if (state.estimateInfo) {
                state.estimateInfo.tags = action.payload || [];
            }
        },
        addService: (state, action: PayloadAction<EstimateService>) => {
            if (state.estimateInfo) {
                state.estimateInfo.services = [...state.estimateInfo.services, action.payload];
            }
        },
        updateService: (state, action: PayloadAction<ServiceWithPrices & { localId?: string }>) => {
            if (state.estimateInfo) {
                state.estimateInfo.services = state.estimateInfo.services.map(service => {
                    if (action.payload.localId) {
                        return service.id === action.payload.localId ? action.payload.item : service;
                    }
                    return service.id === action.payload.item.id ? action.payload.item : service;
                });
                state.estimateInfo.prices = action.payload.prices;
            }
        },
        deleteService: (state, action: PayloadAction<{ prices?: ItemPrices; id: number | string }>) => {
            if (state.estimateInfo) {
                state.estimateInfo.services = state.estimateInfo.services.filter(service => service.id !== action.payload.id);

                if (action.payload.prices) {
                    state.estimateInfo.prices = action.payload.prices;
                }
            }
        },
        addMaterial: (state, action: PayloadAction<EstimateMaterial>) => {
            if (state.estimateInfo) {
                state.estimateInfo.materials = [...state.estimateInfo.materials, action.payload];
            }
        },
        updateMaterial: (state, action: PayloadAction<MaterialWithPrices & { localId?: string }>) => {
            if (state.estimateInfo) {
                state.estimateInfo.materials = state.estimateInfo.materials.map(material => {
                    if (action.payload.localId) {
                        return material.id === action.payload.localId ? action.payload.item : material;
                    }
                    return material.id === action.payload.item.id ? action.payload.item : material;
                });
                state.estimateInfo.prices = action.payload.prices;
            }
        },
        deleteMaterial: (state, action: PayloadAction<{ prices?: ItemPrices; id: number | string }>) => {
            if (state.estimateInfo) {
                state.estimateInfo.materials = state.estimateInfo.materials.filter(material => material.id !== action.payload.id);

                if (action.payload.prices) {
                    state.estimateInfo.prices = action.payload.prices;
                }
            }
        },
        storePrices: (state, action: PayloadAction<ItemPrices>) => {
            if (state.estimateInfo) {
                state.estimateInfo.prices = action.payload;
            }
        }
    }
});

export const {
    storeEstimate,
    clearEstimateInfo,
    deleteNote,
    addEditNote,
    storeTags,
    addService,
    updateService,
    deleteService,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    storePrices
} = estimateSlice.actions;

export default estimateSlice.reducer;
