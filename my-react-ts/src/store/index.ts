import {configureStore} from "@reduxjs/toolkit";
import {apiCategory} from "../services/apiCategory.ts";
import {apiAccount} from "../services/apiAccount.tsx";
import authReducer from './authSlice.ts';
import {type TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
export const store = configureStore({
    reducer: {
        [apiCategory.reducerPath]: apiCategory.reducer,
        [apiAccount.reducerPath]: apiAccount.reducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiCategory.middleware, apiAccount.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector