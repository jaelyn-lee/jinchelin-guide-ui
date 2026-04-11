import { emptySplitApi } from './empty-api'

const uploadApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadPhoto: builder.mutation<{ url: string }, FormData>({
      query: (formData) => ({
        url: '/api/upload',
        method: 'POST',
        body: formData,
        formData: true,
      }),
    }),
  }),
})

export const { useUploadPhotoMutation } = uploadApi
