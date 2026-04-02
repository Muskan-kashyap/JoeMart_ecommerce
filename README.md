# JoeMart - Django REST + React E-Commerce

JoeMart is a full-stack e-commerce app using Django REST Framework (API backend) and React + Tailwind (frontend). It includes JWT authentication, product catalog, cart, checkout flow, order tracking, admin product management, and address management.

---

## Table of Contents

1. Requirements
2. Project Structure
3. First-Time Setup
4. Database Setup (PostgreSQL)
5. Environment Variables
6. Run Backend
7. Run Frontend
8. Create Admin + Seed Demo Data
9. Register as Admin vs Normal User
10. Core User Flows (Register/Login/Checkout)
11. Admin Management
12. Stripe Webhook (Optional)
13. Common Issues + Fixes
14. Customization Guide

---

## 1. Requirements

- Windows 10/11
- Python 3.12+
- Node.js 18+
- PostgreSQL 14+

---

## 2. Project Structure

```
Django-React-jwt-authentication-main
├─ backend
│  ├─ .venv
│  ├─ requirements.txt
│  └─ src
│     ├─ config
│     ├─ accounts
│     ├─ catalog
│     ├─ cart
│     ├─ orders
│     ├─ payments
│     └─ manage.py
├─ frontend
│  ├─ package.json
│  └─ src
│     ├─ pages
│     ├─ components
│     ├─ context
│     ├─ utils
│     └─ index.js
└─ README.md
```

---

## 3. First-Time Setup (Detailed)

### Step A: Install Python dependencies (backend)

1. Open PowerShell in the project root.
2. Create a virtual environment if it does not exist:

```
cd backend
python -m venv .venv
```

3. Activate the virtual environment:

```
.\.venv\Scripts\activate
```

4. Install backend dependencies:

```
pip install -r requirements.txt
```

5. Verify install:

```
python -c "import django; print(django.get_version())"
```

### Step B: Install Node dependencies (frontend)

1. Go to frontend folder:

```
cd ..\frontend
```

2. Install packages:

```
npm install
```

3. Verify install:

```
npm list react
```

---

## 4. Database Setup (PostgreSQL)

You already use local PostgreSQL. Update your database details here:

- File to edit: `backend/src/.env`
- Change the values for `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST`, `DB_PORT`, and `DATABASE_URL`.

Example connection:

```
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=demoDB
DB_HOST=localhost
DB_PORT=5432
DATABASE_URL=postgresql://postgres:password@localhost:5432/demoDB
```

Make sure the database exists:

```
psql -U postgres
CREATE DATABASE demoDB;
```

---

## 5. Environment Variables

Copy and update environment settings:

```
backend\src\.env
```

Example:

```
DEBUG=True
SECRET_KEY=django-insecure-change-this-in-production
ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://localhost:3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/demoDB
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

---

## 6. Run Backend

From backend/src:

```
..\.venv\Scripts\python manage.py migrate
..\.venv\Scripts\python manage.py runserver 8000
```

API endpoints are now live at:

```
http://127.0.0.1:8000/api/
```

---

## 7. Run Frontend

From frontend:

```
npm start
```

Frontend is live at:

```
http://127.0.0.1:3000
```

---

## 8. Create Admin + Seed Demo Data

This creates demo categories, products, images, and an admin user for quick testing.

Before running the seed command:

1. Ensure PostgreSQL is running.
2. Ensure your .env is correct (database credentials, etc.).
3. Apply migrations so tables exist.

Step-by-step:

1. Open PowerShell in the project root.
2. Move into the backend source folder:

```
cd backend\src
```

3. Activate the virtual environment (if not already):

```
..\.venv\Scripts\activate
```

4. Run migrations (safe to run again):

```
python manage.py migrate
```

5. Run the seed command:

```
cd backend\src
..\.venv\Scripts\python manage.py seed_demo_data --with-admin --reset
```

What the flags do:

- --with-admin: creates a superuser called admin
- --reset: deletes old demo data and recreates it

Admin credentials:

```
username: admin
password: Admin@12345
```

Login locations:

- App login: http://127.0.0.1:3000/login
- Django admin: http://127.0.0.1:8000/admin/

If you need a different admin account, run:

```
..\.venv\Scripts\python manage.py createsuperuser
```

## 9. Register as Admin vs Normal User

### Admin registration
Option A (recommended for demo): use the seed command above to create the admin user.

Option B: create your own admin user with Django:

```
cd backend\src
..\.venv\Scripts\python manage.py createsuperuser
```

After creating the superuser, log in at:

- http://127.0.0.1:3000/login

### Normal user registration
Use the app UI:

- Go to http://127.0.0.1:3000/register
- Fill in the form and submit
- Log in at http://127.0.0.1:3000/login

---

## 10. Core User Flows (Register/Login/Checkout)

### Register
- Go to /register
- Create account
- Login using those details

### Add Address
- Go to /account
- Add Shipping and Billing addresses

### Checkout
- Add products to cart
- Go to /checkout
- Select Shipping + Billing
- Complete checkout

---

## 11. Admin Management

Login as admin and use:

- /admin/products
  - Create product
  - Edit product
  - Add/remove images
- /admin/orders
  - Update status
  - Add tracking

---

## 12. Stripe Webhook (Optional)

Webhook is added but safe in dev mode.
If you want real verification, add:

```
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_SECRET_KEY=sk_test_xxx
```

Endpoint:

```
POST http://127.0.0.1:8000/api/payments/webhook/
```

---

## 13. Common Issues + Fixes

### Addresses not showing
The frontend now supports paginated responses. Refresh /account and /checkout.

### Blank frontend
Stop all node processes and restart:

```
Taskkill /IM node.exe /F
npm start
```

### Port conflicts
Use different ports or stop the old process.

---

## 14. Customization Guide

### Branding
Change name in:

- frontend/src/components/Header.js
- frontend/public/index.html
- frontend/public/manifest.json
- frontend/src/pages/HomePage.js

### Theme Colors
Edit:

- frontend/src/index.css

You can add more themes by defining:

```
[data-theme='new-theme'] { ... }
```

### Product Images
Seed data uses real URLs. You can add image URLs from Unsplash or your own CDN.

---

## Copy to another PC

Follow these exact steps to move the project and run it on a new machine.

### A) Copy the project folder
1. On the current PC, close any running servers (backend/frontend).
2. Copy the entire project folder:

```
Django-React-jwt-authentication-main
```

3. Transfer it to the new PC (USB, external drive, or cloud).
4. Place it in a simple path with no spaces, for example:

```
C:\Projects\Django-React-jwt-authentication-main
```

### B) Install required software on the new PC
1. Install Python 3.12+ and ensure it is added to PATH.
2. Install Node.js 18+ and verify with:

```
node -v
npm -v
```

3. Install PostgreSQL 14+ and note the username/password you set.
4. (Optional) Install Git if you want to pull/push later.

### C) Create the database on the new PC
1. Open PowerShell.
2. Create a database (example name demoDB):

```
psql -U postgres
CREATE DATABASE demoDB;
```

### D) Configure environment variables
1. Open the .env file:

```
backend\src\.env
```

2. Update database settings to match your new PC:

```
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=demoDB
DB_HOST=localhost
DB_PORT=5432
DATABASE_URL=postgresql://postgres:password@localhost:5432/demoDB
```

### E) Set up backend (Python)
1. Open PowerShell in the project root.
2. Create the virtual environment if it does not exist:

```
cd backend
python -m venv .venv
```

3. Activate the virtual environment:

```
..\.venv\Scripts\activate
```

4. Install backend dependencies:

```
pip install -r requirements.txt
```

5. Run migrations:

```
cd src
python manage.py migrate
```

6. Seed demo data (optional but recommended):

```
python manage.py seed_demo_data --with-admin --reset
```

### F) Set up frontend (Node)
1. Open another PowerShell window.
2. Go to the frontend folder:

```
cd frontend
```

3. Install frontend dependencies:

```
npm install
```

### G) Run the app on the new PC
1. Start backend (from backend/src):

```
python manage.py runserver 8000
```

2. Start frontend (from frontend):

```
npm start
```

3. Open the app:

- http://127.0.0.1:3000

If anything fails, re-check:

- Python/Node versions
- PostgreSQL service is running
- .env values

---

If you need PDF export or deployment instructions (Render/Vercel/AWS), ask and I will add those too.
