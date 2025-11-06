import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import type {ICategoryItem} from "./types.ts";

export const apiCategory = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:5126/api/'}),
    endpoints: (builder) => ({
        getAllCategories: builder.query<ICategoryItem[], void>({
            query: () => 'categories'
        }),
    }),
});

export const { useGetAllCategoriesQuery } = apiCategory;