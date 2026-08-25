import request from 'supertest';
import { createApp } from '../../src/app';
import { clearTestDb, connectTestDb, disconnectTestDb } from '../testDb';

const app = createApp();

describe('Auth flow', () => {
  beforeAll(async () => {
    await connectTestDb();
  }, 60000);

  afterEach(async () => {
    await clearTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  const credentials = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '9876543210',
    password: 'password123',
  };

  it('registers a new user and never returns the password hash', async () => {
    const res = await request(app).post('/api/v1/auth/register').send(credentials);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(credentials.email);
    expect(res.body.data.user.password).toBeUndefined();
    expect(res.body.data.accessToken).toEqual(expect.any(String));
  });

  it('rejects registering the same email twice', async () => {
    await request(app).post('/api/v1/auth/register').send(credentials);
    const res = await request(app).post('/api/v1/auth/register').send(credentials);

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('EMAIL_TAKEN');
  });

  it('logs in with correct credentials and rejects wrong ones', async () => {
    await request(app).post('/api/v1/auth/register').send(credentials);

    const goodLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: credentials.email, password: credentials.password });
    expect(goodLogin.status).toBe(200);
    expect(goodLogin.body.data.accessToken).toEqual(expect.any(String));

    const badLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: credentials.email, password: 'wrong-password' });
    expect(badLogin.status).toBe(401);
    expect(badLogin.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('returns the current user profile for a valid access token', async () => {
    const register = await request(app).post('/api/v1/auth/register').send(credentials);
    const accessToken = register.body.data.accessToken;

    const me = await request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${accessToken}`);
    expect(me.status).toBe(200);
    expect(me.body.data.email).toBe(credentials.email);
  });

  it('rejects protected routes without a token', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });
});
