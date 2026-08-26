import { Document, Types } from 'mongoose';

export interface ICategory {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory: Types.ObjectId | string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ICategoryDocument = ICategory & Document;
