import { configureStore } from '@reduxjs/toolkit';
import { todoApi } from './api/todoApi.ts'
import snackbarReducer from './slices/snackbarSlice';

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
    reducer: {
        [todoApi.reducerPath]: todoApi.reducer,
        snackbar: snackbarReducer,

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(todoApi.middleware),
});

export default store;