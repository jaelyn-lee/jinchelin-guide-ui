export interface Dish {
  id: string
  name: string
  category: string
  createdAt: string
}

export interface Review {
  id: string
  dishId: string
  dishName: string
  category: string
  rating: number
  reviewText?: string
  photoUrl?: string | null
  reviewedAt: string
  createdAt: string
}

export interface CreateReviewDto {
  dishId: string
  rating: number
  reviewText?: string
  photoUrl?: string
}

export interface DishRanking extends Dish {
  averageRating: number
  cuisine: string
  avgRating: number
  reviewCount: number
}

export interface Category {
  id: string
  name: string
  cuisine: string
  createdAt: string
}

export interface CreateDishDto {
  name: string
  categoryId: string
}

export interface CreateReviewDto {
  dishId: string
  rating: number
  reviewText?: string
  photoUrl?: string
}
