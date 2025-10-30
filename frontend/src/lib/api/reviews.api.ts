import { apiClient } from "./client";
import {
  Review,
  PageResponse,
  ReviewFilterParams,
  CreateReviewRequest,
  UpdateReviewRequest,
} from "../types";

export const reviewsApi = {
  // Get reviews with filters
  getReviews: async (
    params?: ReviewFilterParams
  ): Promise<PageResponse<Review>> => {
    const response = await apiClient.get<PageResponse<Review>>("/reviews", {
      params,
    });
    return response.data;
  },

  // Get review by ID
  getReviewById: async (id: number): Promise<Review> => {
    const response = await apiClient.get<Review>(`/reviews/${id}`);
    return response.data;
  },

  // Create review (Customer)
  createReview: async (data: CreateReviewRequest): Promise<Review> => {
    const response = await apiClient.post<Review>("/reviews", data);
    return response.data;
  },

  // Update review (Customer)
  updateReview: async (
    id: number,
    data: UpdateReviewRequest
  ): Promise<Review> => {
    const response = await apiClient.put<Review>(`/reviews/${id}`, data);
    return response.data;
  },

  // Delete review (Customer)
  deleteReview: async (id: number): Promise<void> => {
    await apiClient.delete(`/reviews/${id}`);
  },

  // Mark review as helpful (Any authenticated user)
  markHelpful: async (id: number): Promise<Review> => {
    const response = await apiClient.post<Review>(`/reviews/${id}/helpful`);
    return response.data;
  },

  // Unmark review as helpful
  unmarkHelpful: async (id: number): Promise<Review> => {
    const response = await apiClient.delete<Review>(`/reviews/${id}/helpful`);
    return response.data;
  },

  // Approve review (Admin)
  approveReview: async (id: number): Promise<Review> => {
    const response = await apiClient.post<Review>(`/reviews/${id}/approve`);
    return response.data;
  },

  // Reject review (Admin)
  rejectReview: async (id: number, reason: string): Promise<Review> => {
    const response = await apiClient.post<Review>(`/reviews/${id}/reject`, {
      reason,
    });
    return response.data;
  },

  // Reply to review (Seller)
  replyToReview: async (id: number, reply: string): Promise<Review> => {
    const response = await apiClient.post<Review>(`/reviews/${id}/reply`, {
      reply,
    });
    return response.data;
  },

  // Get product rating statistics
  getProductRatingStats: async (productId: number): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<number, number>;
  }> => {
    const response = await apiClient.get(`/reviews/products/${productId}/stats`);
    return response.data;
  },
};