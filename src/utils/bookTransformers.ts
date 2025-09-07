/**
 * Book Data Transformers
 * Converts between backend API format and frontend display format
 */

import { Book, BookDisplay } from '@/types';

/**
 * Transform backend Book to frontend BookDisplay format
 */
export const transformBookForDisplay = (book: Book): BookDisplay => {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    description: book.description,
    coverImage: book.cover_image_url,
    publishedDate: book.publication_date,
    averageRating: parseFloat(book.average_rating) || 0,
    totalReviews: book.total_reviews,
    createdAt: book.created_at,
    updatedAt: book.updated_at,
    genres: book.genres || [],
    recentReviews: book.recent_reviews,
  };
};

/**
 * Transform array of backend Books to frontend BookDisplay format
 */
export const transformBooksForDisplay = (books: Book[]): BookDisplay[] => {
  return books.map(transformBookForDisplay);
};

/**
 * Get primary genre from book (first genre or fallback)
 */
export const getPrimaryGenre = (book: BookDisplay): string => {
  return book.genres?.[0]?.name || 'Uncategorized';
};

/**
 * Get formatted publication year from book
 */
export const getPublicationYear = (book: BookDisplay): string => {
  if (!book.publishedDate) return 'Unknown';
  return new Date(book.publishedDate).getFullYear().toString();
};

/**
 * Check if book has valid cover image
 */
export const hasValidCoverImage = (book: BookDisplay): boolean => {
  return !!book.coverImage && book.coverImage.trim() !== '';
};

/**
 * Get fallback cover image URL
 */
export const getFallbackCoverImage = (): string => {
  return '/images/default-book-cover.jpg';
};

/**
 * Get book cover image with fallback
 */
export const getBookCoverImage = (book: BookDisplay): string => {
  return hasValidCoverImage(book) ? book.coverImage! : getFallbackCoverImage();
};
