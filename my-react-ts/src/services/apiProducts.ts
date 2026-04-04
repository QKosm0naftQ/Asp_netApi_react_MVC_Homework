import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../utilities/createBaseQuery.ts";
import type { IProductCreate, ProductIngredientModel, ProductItemModel, ProductSizeModel } from "./types.ts";
import { serialize } from "object-to-formdata";

export const apiProducts = createApi({
  reducerPath: 'api/products',
  baseQuery: createBaseQuery('products'),
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    getAllProducts: builder.query<ProductItemModel[], void>({
      query: () => '',
      providesTags: ['Products'],
    }),
    addProduct: builder.mutation<void, IProductCreate>({
      query: (product) => {
        const formData = serialize(product);
        return {
          url: "create",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ['Products'],
    }),
    // ... твій існуючий код apiProduct
    getProducts: builder.query<ProductItemModel[], void>({
      query: () => 'Products/list', // або твій ендпоінт для всіх товарів
      providesTags: ['Products'],
    }),
    getProductBySlug: builder.query<ProductItemModel[], string>({
      query: (slug) => `Products/slug/${slug}`,
    }),
    getIngredients: builder.query<ProductIngredientModel[], void>({
      query: () => {

        return {
          url: "ingredients",
          method: "GET"
        };
      }
    }),
    getSizes: builder.query<ProductSizeModel[], void>({
      query: () => {

        return {
          url: "sizes",
          method: "GET"
        };
      }
    }),

    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `${id}`, // Результат: DELETE /api/products/5
        method: "DELETE",
      }),
      invalidatesTags: ['Products'],
    }),

    // 1. Отримання одного товару для форми редагування
    getProductById: builder.query<ProductItemModel, number | string>({
      query: (id) => `id/${id}`, // Результат: /api/products/id/5
      providesTags: ['Products'],
    }),

    // 2. Редагування товару
    editProduct: builder.mutation<void, any>({ // замість any краще IProductEdit
      query: (product) => {
        const formData = serialize(product);
        return {
          url: "edit", // Результат: /api/products/edit
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ['Products'],
    }),

  }),
});

export const {
  useGetAllProductsQuery,
  useAddProductMutation,
  useGetIngredientsQuery,
  useGetSizesQuery,
  useGetProductByIdQuery, // Експортуємо
  useEditProductMutation,  // Експортуємо
  useDeleteProductMutation
} = apiProducts;
