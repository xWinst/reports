import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    records: [],
    locations: [],
    subdivisions: [],
    frequencies: [],
};

const database = createSlice({
    name: 'database',
    initialState,

    reducers: {
        addRecord: (state, { payload }) => {
            state.records = [...state.records, payload];
        },
        deleteRecord: (state, { payload }) => {
            state.records = state.records.filter(({ id }) => id !== payload);
        },

        updateRecord: (state, { payload }) => {
            const { id, data } = payload;
            state.records = state.records.map(record =>
                record.id === id ? { ...record, ...data } : record
            );
        },
        setLocations: (state, { payload }) => {
            state.locations = payload;
        },
        setSubdivisions: (state, { payload }) => {
            state.subdivisions = payload;
        },
        setFrequencies: (state, { payload }) => {
            state.frequencies = payload;
        },
        setDataBase: (state, { payload }) => {
            state.records = payload.records;
            state.frequencies = payload.frequencies;
        },
        clear: state => {
            state.records = [];
        },

        reset: () => initialState,
    },
});

export const {
    addRecord,
    setFrequencies,
    setDataBase,
    clear,
    deleteRecord,
    updateRecord,
    setLocations,
    setSubdivisions,
} = database.actions;

export default database.reducer;
