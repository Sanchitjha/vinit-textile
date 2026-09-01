import { Document, Schema, model } from 'mongoose';

export interface IOtp {
  email: string;
  codeHash: string;
  expiresAt: Date;
  attempts: number;
  consumedAt: Date | null;
  createdAt: Date;
}

export interface IOtpDocument extends IOtp, Document {}

const OtpSchema = new Schema<IOtpDocument>(
  {
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    consumedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// Mongo TTL index — documents are auto-deleted once expiresAt passes, so
// expired/used codes don't pile up and can never be replayed after cleanup.
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OtpModel = model<IOtpDocument>('Otp', OtpSchema);
