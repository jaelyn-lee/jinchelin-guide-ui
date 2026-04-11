import type { Category } from './types';
import { emptySplitApi } from './empty-api';

const categoriesApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => ({ url: '/api/categories', method: 'GET' }),
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApi;