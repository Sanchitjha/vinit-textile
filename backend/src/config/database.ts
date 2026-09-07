import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../shared/utils/logger.util';

class Database {
  private static instance: Database;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private replSet: any = null;

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

    if (env.mongoUri === 'in-memory' || !env.mongoUri) {
      logger.info('Starting in-memory MongoDB replica set via mongodb-memory-server...');
      const { MongoMemoryReplSet } = await import('mongodb-memory-server');
      this.replSet = await MongoMemoryReplSet.create({ replSet: { count: 1, storageEngine: 'wiredTiger' } });
      const uri = this.replSet.getUri();
      logger.info(`In-memory MongoDB replica set running at ${uri}`);
      await mongoose.connect(uri);
      return;
    }

    try {
      await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 });
    } catch (err) {
      logger.warn('Could not connect to external MongoDB, falling back to in-memory replica set...', err);
      const { MongoMemoryReplSet } = await import('mongodb-memory-server');
      this.replSet = await MongoMemoryReplSet.create({ replSet: { count: 1, storageEngine: 'wiredTiger' } });
      const uri = this.replSet.getUri();
      logger.info(`Fallback in-memory MongoDB replica set running at ${uri}`);
      await mongoose.connect(uri);
    }
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
    if (this.replSet) {
      await this.replSet.stop();
    }
  }
}

export const database = Database.getInstance();
