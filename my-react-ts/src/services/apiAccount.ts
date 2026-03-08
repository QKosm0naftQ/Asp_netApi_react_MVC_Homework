import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../utilities/createBaseQuery.ts';
import {serialize} from "object-to-formdata";
import type {IRegister} from "./types.ts";

export interface ILoginRequest {
    email: string;
    password: string;
}

interface ILoginResponse {
    token: string;
}

export interface IForgotPasswordRequest {
    email: string;
}

export  interface IValidateTokenRequest {
    token: string;
    email: string;
}

export  interface IResetPasswordRequest {
    newPassword: string;
    token: string;
    email: string;
}


export const apiAccount = createApi({
    reducerPath: 'api/account',
    baseQuery: createBaseQuery('account'),
    tagTypes: ['Account'],
    endpoints: (builder) => ({
        login: builder.mutation<ILoginResponse, ILoginRequest>({
            query: (credentials) => ({
                url: 'login',
                method: 'POST',
                body: credentials,
            }),
        }),
        loginByGoogle: builder.mutation<{token: string}, string>({
            query: (token) => ({
                url: 'googleLogin',
                method: 'POST',
                body: {token}
            })
        }),
        //запускаємо процедуру відновлення паролю по пошті
        forgotPassword: builder.mutation<void, IForgotPasswordRequest>({
            query: (data) => ({
                url: 'forgotPassword',
                method: 'POST',
                body: data
            })
        }),
        //перевіряємо чи токен дійсний

        validateResetToken: builder.query<{ isValid: boolean }, IValidateTokenRequest>({
            query: (params) => ({
                url: 'validateResetToken',
                params, // це додасть параметри як query string: ?token=abc&email=...
            }),
            providesTags: ['Account'],
        }),

        // validateResetToken: builder.query<{isValid: boolean}, IValidateTokenRequest>({
        //     query: (data) => ({
        //         url: 'validateResetToken',
        //         method: 'GET',
        //         body: {data}
        //     })
        // }),

        //встановлюємо новий пароль
        resetPassword: builder.mutation<void, IResetPasswordRequest>({
            query: (data) => ({
                url: 'resetPassword',
                method: 'POST',
                body: data
            })
        }),

        register: builder.mutation<ILoginResponse, IRegister>({
            query: (credentials) => {
                const formData = serialize(credentials);

                return{
                    url: 'register',
                    method: 'POST',
                    body: formData};
            },
        }),
    }),
});

export const {
    useLoginMutation,
    useLoginByGoogleMutation,
    useForgotPasswordMutation,
    useValidateResetTokenQuery,
    useResetPasswordMutation,
    useRegisterMutation } = apiAccount;