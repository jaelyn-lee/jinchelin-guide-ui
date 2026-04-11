import { configureStore } from '@reduxjs/toolkit'
import { emptySplitApi } from './api/empty-api'

export const store = configureStore({
  reducer: {
    [emptySplitApi.reducerPath]: emptySplitApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(emptySplitApi.middleware),
})
