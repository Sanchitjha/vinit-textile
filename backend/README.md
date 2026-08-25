# Saree Ecommerce Backend

A production-ready REST API backend for a Saree Ecommerce Platform. Built with Node.js, Express, TypeScript, and MongoDB, following a class-based modular architecture (Repository → Service → Controller) so it can power **any** frontend design (glassmorphism, minimal, neumorphism, pastel, organic — the frontend visual direction is not finalized yet, and this backend contains zero design-related logic).

```
                    SAME API
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
      Glass UI     Minimal UI    Pastel UI
          │            │            │
          └────────────┼────────────┘
                       ↓
                  Saree Backend
                       ↓
                    MongoDB
```

## Table of contents

- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Folder structure](#folder-structure)
- [Installation](#installation)
- [Environment variables](#environment-variables)
- [MongoDB setup](#mongodb-setup)
- [Running locally](#running-locally)
- [Development commands](#development-commands)
- [Authentication flow](#authentication-flow)
- [Database models](#database-models)
- [API documentation](#api-documentation)
- [Testing](#testing)

## Architecture

Every request flows through the same layered pipeline:

```
Route → Middleware (auth / authorize / validate / rate-limit) → Controller → Service → Repository → Mongoose Model → MongoDB
```

- **Controllers** are thin — they parse `req`, call one service method, and shape the response via `ApiResponse`.
- **Services** hold business rules (stock checks, price computation, coupon math, purchase verification, etc.) and are the only layer allowed to orchestrate multiple repositories.
- **Repositories** are the only layer that talks to Mongoose models — no service or controller queries a model directly.
- **DTOs** (Zod schemas) validate and coerce every request body/query/params before a controller ever sees it.
- **Errors** are centralized: services throw typed errors (`BadRequestError`, `NotFoundError`, etc.) and a single `errorHandler` middleware converts them into the standard response envelope.

Each domain lives in its own self-contained module under `src/modules/<name>/`, with its own routes, controller, service, repository, Mongoose model, DTOs, and types.

## Tech stack

Node.js · Express.js · TypeScript · MongoDB · Mongoose · JWT · bcrypt · Zod · Helmet · CORS · express-rate-limit · ESLint · Prettier · Jest · Supertest · mongodb-memory-server

## Folder structure

```
backend/
├── src/
│   ├── config/            env.ts (Zod-validated config), database.ts (Mongoose connection)
│   ├── modules/
│   │   ├── auth/           register, login, refresh, logout, JWT issuing
│   │   ├── user/           profile + addresses
│   │   ├── category/       dynamic, DB-managed categories (2-level tree)
│   │   ├── saree/          the core product catalog
│   │   ├── cart/           server-priced cart
│   │   ├── wishlist/
│   │   ├── order/          transactional checkout + atomic stock deduction
│   │   ├── payment/        provider-agnostic payment abstraction (Razorpay / stub)
│   │   ├── coupon/         discount codes
│   │   ├── admin/          dashboard stats, customer management
│   │   └── review/         ratings & reviews with purchase verification
│   ├── middleware/         auth, authorize, validate, rateLimiter, errorHandler, notFound, requestLogger
│   ├── shared/
│   │   ├── errors/         AppError + BadRequest/Unauthorized/Forbidden/NotFound/Conflict
│   │   ├── responses/      ApiResponse, pagination helpers
│   │   ├── constants/      roles, order/payment status enums, HTTP status codes
│   │   └── utils/          asyncHandler, slugify, jwt, pagination, logger
│   ├── routes/index.ts     mounts every module router under /api/v1
│   ├── app.ts               Express app wiring (helmet, cors, rate limiting, error handling)
│   └── server.ts            DB connect, HTTP listen, graceful shutdown
├── tests/
│   ├── unit/                service-level tests with mocked repositories
│   ├── integration/         supertest + in-memory MongoDB replica set
│   └── testDb.ts             shared MongoMemoryReplSet helper
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

```bash
cd backend
npm install
cp .env.example .env   # then fill in the values below
```

## Environment variables

See [`.env.example`](./.env.example) for the full list with defaults. Key variables:

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string. **Must be a replica set** (see below). |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Separate signing secrets for access and refresh tokens. |
| `JWT_ACCESS_EXPIRY` / `JWT_REFRESH_EXPIRY` | Defaults: `15m` / `7d`. |
| `CORS_ORIGIN` | Comma-separated list of allowed frontend origins. |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` / `RAZORPAY_WEBHOOK_SECRET` | Leave blank in development — the payment module automatically falls back to a stub provider so the order → payment flow still works end-to-end without real credentials. |
| `LOW_STOCK_THRESHOLD` | Used by the admin low-stock dashboard. |
| `FREE_SHIPPING_THRESHOLD` / `STANDARD_SHIPPING_FEE` | Shipping fee calculation during checkout. |

Never commit a real `.env` file — it's already in `.gitignore`.

## MongoDB setup

Order creation uses a MongoDB **multi-document transaction** to atomically deduct stock, apply coupon usage, insert the order, and clear the cart — all or nothing. This requires MongoDB to run as a **replica set**; a standalone `mongod` does not support transactions.

**Option A — MongoDB Atlas (recommended):** the free tier (M0) is already a replica set. Just use the connection string it gives you as `MONGO_URI`.

**Option B — local replica set:**

```bash
mongod --replSet rs0 --dbpath /path/to/data --port 27017
# in another terminal, initialize it once:
mongosh --eval "rs.initiate()"
```

Then set `MONGO_URI=mongodb://127.0.0.1:27017/saree_ecommerce?replicaSet=rs0`.

## Running locally

```bash
npm run dev     # ts-node-dev, auto-restarts on changes
```

The API is served under `/api/v1`, e.g. `http://localhost:5000/api/v1/sarees`. A health check is available at `GET /health`.

**Interactive API docs:** every endpoint is documented with OpenAPI 3.0 (via JSDoc comments colocated in each `*.routes.ts` file) and served live:

- Swagger UI: `http://localhost:5000/api-docs`
- Raw OpenAPI JSON (importable into Postman/Insomnia): `http://localhost:5000/api-docs.json`

Click "Authorize" in Swagger UI and paste an access token (from `/auth/login` or `/auth/register`) to call protected/admin routes directly from the docs.

## Development commands

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server with hot-reload |
| `npm run build` | Type-check and compile to `dist/` |
| `npm start` | Run the compiled server (`dist/server.js`) |
| `npm run lint` / `npm run lint:fix` | ESLint |
| `npm run format` | Prettier |
| `npm test` | Run the Jest suite (spins up an in-memory MongoDB replica set) |

## Authentication flow

1. `POST /api/v1/auth/register` or `POST /api/v1/auth/login` — returns `{ user, accessToken }` in the JSON body and sets a `refreshToken` httpOnly cookie (7 days, rotated on refresh).
2. Send the access token on subsequent requests: `Authorization: Bearer <accessToken>` (expires in 15 minutes).
3. `POST /api/v1/auth/refresh` — reads the refresh cookie, verifies it against a bcrypt hash stored on the user, and issues a new token pair (rotation; token reuse after rotation revokes the session).
4. `POST /api/v1/auth/logout` — clears the cookie and the stored refresh-token hash.
5. Role-based authorization: routes under `/admin/*` (plus admin-only writes on `/sarees`, `/categories`, `/coupons`) require `role: ADMIN`, enforced by the `authorize(Role.ADMIN)` middleware.

Passwords are hashed with bcrypt and the User model never serializes `password` or `refreshTokenHash` — the schema's `toJSON` transform strips them defensively even if a query accidentally re-selects them.

## Database models

| Model | Key fields | Notable indexes |
|---|---|---|
| **User** | name, email, phone, password (hashed), role, addresses[], isActive | `email` (unique) |
| **Category** | name, slug, parentCategory (self-ref, 2 levels) | `slug` (unique), `parentCategory` |
| **Saree** | name, slug, category/subCategory (refs), images[], price, stock, fabric, sareeType, color, occasion[], ratings, reviewCount | `slug`, `sku` (unique each), `category`, `fabric`, `sareeType`, `color`, `price`, `isFeatured`, text index on name/description/tags |
| **Cart** | user (unique), items[{saree, quantity}] — no stored price | `user` (unique) |
| **Wishlist** | user (unique), sarees[] | `user` (unique) |
| **Order** | orderNumber, user, items[] (price/name snapshotted at purchase time), shippingAddress (snapshot), subtotal/discount/shippingFee/total, paymentStatus, orderStatus | `user`, `orderNumber` (unique), `orderStatus`, `createdAt` |
| **Coupon** | code, discountType, discountValue, usageLimit/usedCount, expiresAt | `code` (unique) |
| **Payment** | order, provider, providerOrderId/providerPaymentId, status | `order`, `providerOrderId` |
| **Review** | user, saree, order (proof of purchase), rating, isApproved | `saree`, unique compound `{user, saree}` |

## API documentation

Base URL: `/api/v1`. All responses use the standard envelope:

```json
{ "success": true, "message": "Saree fetched successfully", "data": { } }
{ "success": false, "message": "Saree not found", "error": { "code": "SAREE_NOT_FOUND" } }
```

### Auth (`/auth`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Create a customer account |
| POST | `/auth/login` | — | Login, returns tokens |
| GET | `/auth/me` | Bearer | Current user profile |
| POST | `/auth/refresh` | refresh cookie | Rotate tokens |
| POST | `/auth/logout` | Bearer | Revoke refresh token |

**Example — register:**

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","phone":"9876543210","password":"password123"}'
```

```json
{
  "success": true,
  "message": "Registered successfully",
  "data": {
    "user": { "_id": "...", "name": "Jane Doe", "email": "jane@example.com", "role": "CUSTOMER" },
    "accessToken": "eyJhbGciOi..."
  }
}
```

### Users (`/users`) — Bearer required

| Method | Path | Description |
|---|---|---|
| PATCH | `/users/me` | Update name/phone/avatar |
| GET | `/users/addresses` | List saved addresses |
| POST | `/users/addresses` | Add an address |
| PATCH | `/users/addresses/:id` | Update an address |
| DELETE | `/users/addresses/:id` | Remove an address |

### Categories (`/categories`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/categories` | — | List categories (filter by `parentCategory`, `isActive`) |
| GET | `/categories/:id` | — | Get one category |
| POST | `/categories` | Admin | Create |
| PATCH | `/categories/:id` | Admin | Update |
| DELETE | `/categories/:id` | Admin | Delete (blocked if it has subcategories or sarees) |

### Sarees (`/sarees`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/sarees` | — | Search/filter/sort/paginate |
| GET | `/sarees/:id` | — | Get by id |
| GET | `/sarees/slug/:slug` | — | Get by slug |
| GET | `/sarees/:sareeId/reviews` | — | Approved reviews for a saree |
| POST | `/sarees/:sareeId/reviews` | Bearer | Submit a review (must have a delivered order containing this saree) |
| POST | `/sarees` | Admin | Create |
| PATCH | `/sarees/:id` | Admin | Update |
| DELETE | `/sarees/:id` | Admin | Delete |
| PATCH | `/sarees/:id/stock` | Admin | Adjust stock by a signed `quantity` delta |

**Example — filtered list:**

```bash
curl "http://localhost:5000/api/v1/sarees?category=<categoryId>&fabric=silk&color=red&occasion=wedding&minPrice=1000&maxPrice=5000&sort=price_asc&page=1&limit=20"
```

```json
{
  "success": true,
  "message": "Sarees fetched successfully",
  "data": {
    "items": [ { "name": "Banarasi Silk Saree", "price": 3999, "stock": 12, "...": "..." } ],
    "meta": { "page": 1, "limit": 20, "total": 42, "totalPages": 3 }
  }
}
```

### Cart (`/cart`) — Bearer required

| Method | Path | Description |
|---|---|---|
| GET | `/cart` | Current cart, enriched with live saree price/stock |
| POST | `/cart/items` | Add `{ sareeId, quantity }` |
| PATCH | `/cart/items/:sareeId` | Set quantity |
| DELETE | `/cart/items/:sareeId` | Remove item |
| DELETE | `/cart` | Clear cart |

Prices are **always** re-read from the Saree collection — the cart never stores or trusts a client-sent price.

### Wishlist (`/wishlist`) — Bearer required

`GET /wishlist`, `POST /wishlist/:sareeId`, `DELETE /wishlist/:sareeId`.

### Orders (`/orders`) — Bearer required

| Method | Path | Description |
|---|---|---|
| POST | `/orders` | Create an order (see flow below) |
| GET | `/orders` | List my orders (paginated) |
| GET | `/orders/:id` | Get one of my orders |
| POST | `/orders/:id/cancel` | Cancel (only while PENDING/CONFIRMED/PROCESSING) — restores stock and coupon usage |

**Order creation flow** (`OrderService.createOrder`, wrapped in a MongoDB transaction):

1. Validate the shipping address belongs to the user.
2. For each item, atomically deduct stock via `findOneAndUpdate({ stock: { $gte: qty } }, { $inc: { stock: -qty } })` — insufficient stock aborts the whole transaction.
3. Compute subtotal from **live** saree prices (the request body only carries `sareeId` + `quantity`, never a price).
4. If a coupon code is supplied, validate it and atomically increment its usage count (guarded by `usageLimit`).
5. Compute shipping fee (free above `FREE_SHIPPING_THRESHOLD`, else `STANDARD_SHIPPING_FEE`) and the final total.
6. Insert the order and clear the cart, all inside the same transaction.
7. If `paymentMethod` is `RAZORPAY`, best-effort auto-initiate a payment (client can retry via the payments endpoint if this step fails — the order itself is already committed).

**Example:**

```bash
curl -X POST http://localhost:5000/api/v1/orders \
  -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{
    "items": [{ "sareeId": "<sareeId>", "quantity": 2 }],
    "addressId": "<addressId>",
    "couponCode": "SAVE20",
    "paymentMethod": "COD"
  }'
```

### Admin orders (`/admin/orders`) — Admin required

`GET /admin/orders` (filter by `orderStatus`, paginated), `PATCH /admin/orders/:id/status`.

### Payments (`/payments`) — Bearer required

| Method | Path | Description |
|---|---|---|
| POST | `/payments/:orderId/initiate` | Create a provider order (Razorpay or stub) |
| POST | `/payments/verify` | Verify `{ providerOrderId, providerPaymentId, signature }`, marks order PAID |
| POST | `/payments/:orderId/refund` | Admin only |
| POST | `/payments/webhook` | Provider webhook (raw-body signature verification, no auth) |

The Order/Payment modules depend only on the `IPaymentService` interface (`createPayment`, `verifyPayment`, `handleWebhook`, `refundPayment`) — never on the Razorpay SDK directly. If `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET` are unset, a `StubPaymentService` is used automatically so the full flow is testable without real credentials.

### Coupons (`/coupons`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/coupons/validate` | Bearer | Check a code against `{ code, orderValue }`, returns the computed discount |
| GET | `/coupons` | Admin | List |
| POST | `/coupons` | Admin | Create |
| PATCH | `/coupons/:id` | Admin | Update |
| DELETE | `/coupons/:id` | Admin | Delete |

### Admin (`/admin`) — Admin required

| Method | Path | Description |
|---|---|---|
| GET | `/admin/dashboard` | Total orders, total revenue, low-stock count |
| GET | `/admin/dashboard/low-stock` | List of low-stock sarees |
| GET | `/admin/users` | Paginated customer list |
| PATCH | `/admin/users/:id/status` | Activate/deactivate a customer |
| GET | `/admin/reviews` | List reviews (filter by `isApproved`) |
| PATCH | `/admin/reviews/:id/approve` | Approve a review (recomputes the saree's rating average) |

## Testing

```bash
npm test
```

Tests spin up an in-memory single-node **replica set** (`mongodb-memory-server`) so the same transactional code path used in production (atomic stock deduction, coupon usage) runs in tests too. Coverage includes:

- Auth: register/login/me, duplicate-email rejection, invalid-credential rejection, password never leaks in responses.
- Order creation: correct server-computed totals, insufficient-stock rejection, and a **concurrency test** — two simultaneous orders against a saree with `stock: 1` — asserting exactly one succeeds and stock never goes negative.
- Coupon discount computation: percentage/flat discounts, `maximumDiscount` cap, minimum order value, expiry, usage limit.
- Review purchase verification: rejects reviews without a matching order, rejects non-delivered orders, allows one review per user per saree.
