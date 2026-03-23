import axios from 'axios'
import {
  CategoriesClient,
  DishesClient,
  ReviewsClient,
  UploadClient,
} from './apiClient'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5102'

// Disable Axios's automatic JSON parsing — the NSwag-generated client
// calls JSON.parse() itself on response.data, so we must keep it as a raw string.
const axiosInstance = axios.create({ transformResponse: [] })

//TODO: Need to check if it is a right place to convert
axiosInstance.interceptors.response.use((response) => {
  if (response.status === 201) response.status = 200
  return response
})

export const dishesClient = new DishesClient(BASE_URL, axiosInstance)
export const reviewsClient = new ReviewsClient(BASE_URL, axiosInstance)
export const categoriesClient = new CategoriesClient(BASE_URL, axiosInstance)
export const uploadClient = new UploadClient(BASE_URL, axiosInstance)
