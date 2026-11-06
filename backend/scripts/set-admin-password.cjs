// Sets (or creates) the admin account's password directly in MongoDB. Run it yourself, locally:
//
//   PowerShell:  $env:ADMIN_NEW_PASSWORD = "your new password (12+ characters)"; node scripts/set-admin-password.cjs
//   bash:        ADMIN_NEW_PASSWORD='your new password' node scripts/set-admin-password.cjs
//
// Optional: ADMIN_EMAIL (default admin@vinittextiles.com). The database is taken from MONGO_URI, read from the
// environment, then backend/.env.render, then backend/.env. The password is never printed or stored in a file.
// Signs the admin out everywhere (refresh token is cleared); access tokens already issued last up to 15 minutes.
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env.render') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

const email = (process.env.ADMIN_EMAIL || 'admin@vinittextiles.com').trim().toLowerCase();
const password = process.env.ADMIN_NEW_PASSWORD || '';
const mongoUri = process.env.MONGO_URI;

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!mongoUri || mongoUri === 'in-memory') fail('MONGO_URI is not set (looked in the environment, .env.render and .env).');
if (password.length < 12) fail('Set ADMIN_NEW_PASSWORD to a password of at least 12 characters.');
if (/^(admin123|password|12345678)/i.test(password)) fail('That password is far too easy to guess. Pick another one.');

(async () => {
  const client = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 20000 });
  await client.connect();
  try {
    const users = client.db().collection('users');
    const hash = await bcrypt.hash(password, 10);
    const existing = await users.findOne({ email });

    if (existing && existing.role !== 'ADMIN') {
      fail(`${email} exists but is not an admin account. Use a different ADMIN_EMAIL.`);
    }
    if (existing) {
      await users.updateOne({ _id: existing._id }, { $set: { password: hash, isActive: true, updatedAt: new Date() }, $unset: { refreshTokenHash: '' } });
      console.log(`Password updated for ${email}. All of their sessions were signed out.`);
    } else {
      const now = new Date();
      await users.insertOne({ name: 'Vinit Pandey', email, password: hash, role: 'ADMIN', isActive: true, avatar: null, addresses: [], refreshTokenHash: null, createdAt: now, updatedAt: now, __v: 0 });
      console.log(`Admin account created for ${email}.`);
    }
  } finally {
    await client.close();
  }
})().catch((err) => fail(`Failed: ${err.message}`));
