import { Document, Types } from 'mongoose';

export interface ISaree {
  name: string;
  slug: string;
  description: string;
  category: Types.ObjectId | string;
  subCategory: Types.ObjectId | string | null;
  images: string[];
  price: number;
  compareAtPrice?: number;
  discount: number;
  sku: string;
  stock: number;
  fabric: string;
  sareeType?: string;
  weave?: string;
  color: string;
  colors: string[];
  pattern?: string;
  borderType?: string;
  blousePiece: boolean;
  blouseColor?: string;
  sareeLength?: number;
  blouseLength?: number;
  occasion: string[];
  region?: string;
  tags: string[];
  careInstructions?: string;
  isFeatured: boolean;
  isActive: boolean;
  ratings: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ISareeDocument = ISaree & Document;

export interface SareeFilterOptions {
  search?: string;
  category?: string;
  subCategory?: string;
  fabric?: string;
  sareeType?: string;
  color?: string;
  occasion?: string;
  region?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  isActive?: boolean;
}

export type SareeSortOption =
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'oldest'
  | 'rating_desc'
  | 'name_asc';
