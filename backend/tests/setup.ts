process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'test-access-secret';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh-secret';
// Not actually connected to — tests spin up an in-memory replica set (see
// tests/testDb.ts) and connect mongoose directly to that URI instead. This
// placeholder only satisfies env.ts's required-field validation at import time.
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/test-placeholder';
