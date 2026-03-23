export interface Category {
  id: string;
  name: string;
  cuisine: string;
}

export interface Dish {
  id: string;
  name: string;
  category: string | null;
  cuisine: string | null;
  avgRating: number;
  reviewCount: number;
  createdAt: string;
}

export interface Review {
  id: string;
  dishId: string;
  dishName: string;
  category: string | null;
  rating: number;
  reviewText: string | null;
  photoUrl: string | null;
  reviewedAt: string;
  createdAt: string;
}

export interface CreateDishRequest {
  name: string;
  categoryId: string | null;
}

export interface CreateReviewRequest {
  dishId: string;
  rating: number;
  reviewText: string | null;
  photoUrl: string | null;
}
