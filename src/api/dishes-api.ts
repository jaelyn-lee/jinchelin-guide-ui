import type { Dish, CreateDishDto, DishRanking } from './types'
import { emptySplitApi } from './empty-api'

const dishesApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getDishes: builder.query<
      Dish[],
      { search?: string; categoryId?: string; sortBy?: string } | void
    >({
      query: ({ search, categoryId, sortBy } = {}) => ({
        url: '/api/dishes',
        method: 'GET',
        params: { search, categoryId, sortBy },
      }),
    }),
    getDishRanking: builder.query<DishRanking[], void>({
      query: () => ({
        url: '/api/dishes/ranking',
        method: 'GET',
      }),
    }),
    getDish: builder.query<Dish, string>({
      query: (id: string) => ({
        url: `/api/dishes/${id}`,
        method: 'GET',
      }),
    }),
    createDish: builder.mutation<Dish, CreateDishDto>({
      query: (body: CreateDishDto) => ({
        url: '/api/dishes',
        method: 'POST',
        body,
      }),
    }),
    deleteDish: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `/api/dishes/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useGetDishesQuery,
  useGetDishRankingQuery,
  useGetDishQuery,
  useCreateDishMutation,
  useDeleteDishMutation,
} = dishesApi
