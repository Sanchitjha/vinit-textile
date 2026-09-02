import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../shared/utils/logger.util';

class Database {
  private static instance: Database;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect(): Promise<void> {
    mongoose.set('strictQuery', true);

    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connected');
    });
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error', err);
    });
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    // Fail fast on an unreachable/misconfigured host rather than hanging —
    // matters most in serverless, where a stuck connection burns function time.
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 8000 });
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }
}

export const database = Database.getInstance();
