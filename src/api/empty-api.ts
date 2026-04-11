import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const emptySplitApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
    prepareHeaders: (headers) => {
      // 나중에 JWT 추가할 때 여기만 수정
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Reviews', 'Dishes', 'Ranking'],
  endpoints: () => ({}),
})
