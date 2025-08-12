import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Employee } from 'types/settingsTypes';

interface EmployeesState {
    employees: Employee[];
    page: number;
    scrollTop: number;
    total: number;
    selectedEmployee: Employee | null;
}

const initialState: EmployeesState = {
    employees: [],
    page: 0,
    scrollTop: 0,
    total: 0,
    selectedEmployee: null
};

const employeesSlice = createSlice({
    name: 'employees',
    initialState,
    reducers: {
        storeEmployees: (state, action: PayloadAction<Employee[]>) => {
            state.employees = action.payload;
        },
        clearEmployeesStore: () => initialState,
        updateEmployee: (state, action: PayloadAction<Employee>) => {
            const { id } = action.payload;
            state.employees = state.employees.map(el => (el.id === id ? action.payload : el));
        },
        addEmployee: (state, action: PayloadAction<Employee>) => {
            state.employees = [...state.employees, action.payload];
        },
        deleteEmployee: (state, action: PayloadAction<Employee>) => {
            state.employees = state.employees.filter(e => e.id !== action.payload.id);
        },
        setEmployeesPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setEmployeesScrollTop: (state, action: PayloadAction<number>) => {
            state.scrollTop = action.payload;
        },
        setEmployeesTotal: (state, action: PayloadAction<number>) => {
            state.total = action.payload;
        },
        setSelectedEmployee: (state, action: PayloadAction<Employee | null>) => {
            state.selectedEmployee = action.payload;
        }
    }
});

export const {
    storeEmployees,
    updateEmployee,
    addEmployee,
    clearEmployeesStore,
    deleteEmployee,
    setEmployeesPage,
    setEmployeesScrollTop,
    setEmployeesTotal,
    setSelectedEmployee
} = employeesSlice.actions;

export default employeesSlice.reducer;
