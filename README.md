# CafeShop POS - Point of Sale System

A Point of Sale (POS) system for cafes and restaurants. It includes menu management, inventory tracking, and order processing with cloud-based image storage.

## Features

- Menu Management: Create categories and items with image uploads
- Inventory Tracking: Monitor stock levels with low-stock alerts
- Order Processing: Handle order lifecycle from creation to completion
- User Authentication: Secure login with role-based access
- Cloud Deployment: Backend on Railway, Frontend on Vercel

## Tech Stack

Backend: Django 5.2.7 + Django REST Framework + PostgreSQL + Cloudinary
Frontend: React 19.1.1 + TypeScript + Vite + TanStack Router + Zustand
Deployment: Railway (Backend) + Vercel (Frontend)

### Prerequisites

- Python 3.12
- Node.js 18
- PostgreSQL database

### Backend Setup

```bash
git clone https://github.com/SOKHENG-Bot/CafeShopPOS.git
cd CafeShopPOS/BackendPOS
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup

```bash
cd ../FrontendPOS
npm install
npm run dev
```

## Project Structure

```
CafeShopPOS/
├── BackendPOS/         # Django Backend
│   ├── apps/           # Django Apps (auths, menu, inventory, order)
│   ├── config/         # Django Settings
│   └── requirements.txt
├── FrontendPOS/        # React Frontend
│   ├── src/
│   │   ├── features/   # Feature modules
│   │   ├── lib/        # API client and utilities
│   │   └── routes-tanstack/
│   └── package.json
└── README.md
```

## API Endpoints

- POST [Login endpoint](https://cafeshoppos-production.up.railway.app/auth/login/) - User login
- GET [Menu items](https://cafeshoppos-production.up.railway.app/menu/items/) - List menu items
- POST [Menu items](https://cafeshoppos-production.up.railway.app/menu/items/) - Create menu item
- GET [Inventory](https://cafeshoppos-production.up.railway.app/inventory/) - List inventory
- GET [Orders](https://cafeshoppos-production.up.railway.app/orders/) - List orders
- POST [Orders](https://cafeshoppos-production.up.railway.app/orders/) - Create order
- ...
