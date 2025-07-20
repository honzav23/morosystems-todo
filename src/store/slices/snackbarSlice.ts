import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type SnackbarType } from "../../types/Snackbar.ts";

interface SnackbarState {
    snackbarOpen: boolean;
    message: string;
    type: SnackbarType;
}

const initialState: SnackbarState = {
    snackbarOpen: false,
    message: '',
    type: 'error',
}

const snackbarSlice = createSlice({
    name: 'snackbar',
    initialState,
    reducers: {
        openSuccessSnackbar: (state, action: PayloadAction<string>) => {
            state.snackbarOpen = true;
            state.message = action.payload;
            state.type = 'success'
        },
        openErrorSnackbar: (state, action: PayloadAction<string>) => {
            state.snackbarOpen = true
            state.message = action.payload;
            state.type = 'error'
        },
        closeSnackbar: (state) => {
            state.snackbarOpen = false;
            state.message = '';
            state.type = 'error';
        }
    }
})

export const { openSuccessSnackbar, openErrorSnackbar, closeSnackbar } = snackbarSlice.actions;

export default snackbarSlice.reducer;