# Maison — Backend API

Node.js + Express + PostgreSQL backend for the Maison e-commerce store.

## Tech Stack
- **Express** — REST API framework
- **Prisma** — ORM for PostgreSQL
- **bcryptjs** — password hashing
- **jsonwebtoken** — JWT authentication
- **Stripe** — payment processing

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | ❌ | Create account |
| POST | /api/auth/login | ❌ | Sign in |
| GET | /api/auth/me | ✅ | Get current user |
| GET | /api/products | ❌ | All products |
| GET | /api/products/:id | ❌ | Single product |
| POST | /api/products | 👑 Admin | Create product |
| PUT | /api/products/:id | 👑 Admin | Update product |
| DELETE | /api/products/:id | 👑 Admin | Delete product |
| POST | /api/orders | ✅ | Place order |
| GET | /api/orders | ✅ | My orders |
| GET | /api/orders/:id | ✅ | Single order |
| GET | /api/admin/orders | 👑 Admin | All orders |
| POST | /api/payments/create-intent | ✅ | Stripe payment intent |
| POST | /api/payments/webhook | ❌ | Stripe webhook |

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
# Then fill in your values
```

### 3. Set up PostgreSQL on Railway
1. Go to railway.app and create a free account
2. New Project → Add PostgreSQL
3. Click the PostgreSQL service → Variables tab
4. Copy the DATABASE_URL and paste it in your .env

### 4. Push database schema
```bash
npx prisma generate
npx prisma db push
```

### 5. Seed the database with products
```bash
node prisma/seed.js
```

### 6. Start development server
```bash
npm run dev
# API runs at http://localhost:4000
```

## Folder Structure
```
src/
├── controllers/
│   ├── auth.controller.js      # register, login, getMe
│   ├── products.controller.js  # CRUD for products
│   ├── orders.controller.js    # create/get orders
│   └── payments.controller.js  # Stripe integration
├── middleware/
│   └── auth.js                 # JWT protect + adminOnly
├── routes/
│   └── index.js                # All routes combined
├── lib/
│   └── prisma.js               # Prisma client singleton
└── index.js                    # Express app entry point
prisma/
├── schema.prisma               # Database models
└── seed.js                     # Initial data
```

## Default Admin Account (after seeding)
- Email: admin@maison.com
- Password: admin123

## Deployment (Railway)
1. Push your code to GitHub
2. Railway → New Project → Deploy from GitHub
3. Add environment variables in Railway dashboard
4. Railway auto-deploys on every git push
