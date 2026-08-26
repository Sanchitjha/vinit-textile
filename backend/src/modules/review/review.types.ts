import { Document, Types } from 'mongoose';

export interface IReview {
  user: Types.ObjectId;
  saree: Types.ObjectId;
  order: Types.ObjectId;
  rating: number;
  comment: string;
  images: string[];
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type IReviewDocument = IReview & Document;
