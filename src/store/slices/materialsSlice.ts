import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Material } from 'types/settingsTypes';

interface MaterialsState {
    materials: Material[] | null;
    page: number;
    scrollTop: number;
    total: number;
}

const initialState: MaterialsState = {
    materials: [],
    page: 0,
    scrollTop: 0,
    total: 0
};

const materialsSlice = createSlice({
    name: 'materials',
    initialState,
    reducers: {
        storeMaterials: (state, action: PayloadAction<Material[]>) => {
            state.materials = action.payload;
        },
        clearMaterialsSlice: state => {
            state.materials = null;
        },
        updateMaterialReducer: (state, action: PayloadAction<Material>) => {
            const { id } = action.payload;
            if (state.materials) state.materials = state.materials.map(el => (el.id === id ? action.payload : el));
        },
        createMaterialReducer: (state, action: PayloadAction<Material>) => {
            if (state.materials) state.materials = [...state.materials, action.payload];
            else state.materials = [action.payload];
        },
        setMaterialsPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setMaterialsScrollTop: (state, action: PayloadAction<number>) => {
            state.scrollTop = action.payload;
        },
        setMaterialsTotal: (state, action: PayloadAction<number>) => {
            state.total = action.payload;
        }
    }
});

export const {
    storeMaterials,
    clearMaterialsSlice,
    updateMaterialReducer,
    createMaterialReducer,
    setMaterialsPage,
    setMaterialsScrollTop,
    setMaterialsTotal
} = materialsSlice.actions;

export default materialsSlice.reducer;
