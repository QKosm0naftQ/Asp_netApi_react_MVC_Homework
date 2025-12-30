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

interface IForgotPasswordRequest {
    email: string;
}


export const apiAccount = createApi({
    reducerPath: 'api/account',
    baseQuery: createBaseQuery('account'),
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
        forgotPassword: builder.mutation<IForgotPasswordRequest, void>({
            query: (data) => ({
                url: 'forgotPassword',
                method: 'POST',
                body: data
            })
        }),
        //перевіряємо чи токен дійсний
        validateResetToken: builder.mutation<{token: string}, boolean>({
            query: (token) => ({
                url: 'validateResetToken',
                method: 'POST',
                body: {token}
            })
        }),

        //встановлюємо новий пароль
        resetPassword: builder.mutation<{password: string}, void>({
            query: (password) => ({
                url: 'resetPassword',
                method: 'POST',
                body: {password}
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
    useValidateResetTokenMutation,
    useResetPasswordMutation,
    useRegisterMutation } = apiAccount;