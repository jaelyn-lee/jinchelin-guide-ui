import type { Review, CreateReviewDto } from './types'
import { emptySplitApi } from './empty-api'

const reviewsApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query<Review[], void>({
      query: () => ({ url: '/api/reviews', method: 'GET' }),
      providesTags: ['Reviews'],
    }),

    getReviewsByDish: builder.query<Review[], string>({
      query: (dishId: string) => ({
        url: `/api/reviews/dish/${dishId}`,
        method: 'GET',
      }),
    }),

    getReview: builder.query<Review, string>({
      query: (id: string) => ({ url: `/api/reviews/${id}`, method: 'GET' }),
    }),

    createReview: builder.mutation<Review, CreateReviewDto>({
      query: (body: CreateReviewDto) => ({
        url: '/api/reviews',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Reviews', 'Ranking'],
    }),

    deleteReview: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `/api/reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reviews', 'Ranking'],
    }),
  }),
})

export const {
  useGetReviewsQuery,
  useGetReviewsByDishQuery,
  useGetReviewQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
} = reviewsApi
