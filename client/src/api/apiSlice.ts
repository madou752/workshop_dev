import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  OrderConfirmation,
  OrderRequest,
  Product,
} from "../types/product";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => "/products",
      providesTags: ["Product"],
    }),
    getProductBySlug: builder.query<Product, string>({
      query: (slug) => `/products/${slug}`,
      providesTags: ["Product"],
    }),
    placeOrder: builder.mutation<OrderConfirmation, OrderRequest>({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  usePlaceOrderMutation,
} = apiSlice;
