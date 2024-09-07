import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    date: '',
    shift: 'Денна',
};

const date = createSlice({
    name: 'date',
    initialState,

    reducers: {
        setDate: (state, { payload }) => {
            state.date = payload;
        },
        setShift: (state, { payload }) => {
            state.shift = payload;
        },
    },
});

export const { setDate, setShift } = date.actions;

export default date.reducer;
