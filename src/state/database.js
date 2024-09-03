import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    records: [],
    // locations: [
    //     { name: '', subdivisions: [{ name: '', frequencies: [{ value: 0, nicknames: [] }] }] },
    // ],
    // subdivisions: [],
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
            state.records = state.records.filter( ({id}) => id !== payload);
        },
        // setLocations: (state, { payload }) => {
        //     state.locations.name = payload;
        // },
        // setSubdivisions: (state, { payload }) => {
        //     state.subdivisions = payload;
        // },
        setFrequencies: (state, { payload }) => {
            state.frequencies = payload;
        },
        setDataBase: (state, {payload}) => {
            state.records = payload.records;
            state.frequencies = payload.frequencies;
        },
        clear: (state) => { state.records = []},

        reset: () => initialState,
    },
});

export const { addRecord, setFrequencies, setDataBase, clear, deleteRecord } = database.actions;

export default database.reducer;
