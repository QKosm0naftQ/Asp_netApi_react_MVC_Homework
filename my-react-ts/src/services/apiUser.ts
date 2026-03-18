import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../utilities/createBaseQuery.ts";
import type {
  IAdminUserItem, ISearchResult, IUserSearchParams
} from "./types.ts";

export const apiUser = createApi({
  reducerPath: 'api/user',
  baseQuery: createBaseQuery('Users'),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    // Отримати всіх (старий метод)
    getAllUsers: builder.query<IAdminUserItem[], void>({
      query: () => 'list',
      providesTags: ['Users'],
    }),

    // Пошук з пагінацією
    searchUsers: builder.query<ISearchResult<IAdminUserItem>, IUserSearchParams>({
      query: (params) => ({
        url: 'search',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.items.map(({ id }) => ({ type: 'Users' as const, id })),
            { type: 'Users', id: 'PARTIAL-LIST' },
          ]
          : [{ type: 'Users', id: 'PARTIAL-LIST' }],
    }),

    // 1. Отримати одного користувача за ID (для модалки)
    getUserById: builder.query<IAdminUserItem, number>({
      query: (id) => `${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Users', id }],
    }),

    // 2. Оновлення користувача (FormData для фото)
    updateUser: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: 'edit',
        method: 'POST', // або 'PUT', залежно від твого контролера
        body: formData,
      }),
      // Після успішного редагування скидаємо кеш списку, щоб дані оновилися
      invalidatesTags: (_result, _error, formData) => [
        { type: 'Users', id: 'PARTIAL-LIST' },
        { type: 'Users', id: Number(formData.get('id')) }
      ],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useSearchUsersQuery,
  useGetUserByIdQuery,    // Експортуємо новий хук
  useUpdateUserMutation,  // Експортуємо нову мутацію
} = apiUser;
