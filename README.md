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

## Quick Start

### Prerequisites
- Python 3.12
- Node.js 18
- PostgreSQL database

### Backend Setup
```bash
git clone https://github.com/SOKHENG-Bot/CafeShopPOS.git
cd CafeShopPOS/BackendPOS
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
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

- POST /api/auth/login/ - User login
- GET /api/menu/items/ - List menu items
- POST /api/menu/items/ - Create menu item
- GET /api/inventory/ - List inventory
- GET /api/orders/ - List orders
- POST /api/orders/ - Create order
- ...

API Docs: Visit /api/docs/ when running locally

## Deployment

### Backend (Railway)
1. Connect GitHub repository to Railway
2. Set environment variables: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, SECRET_KEY
3. Auto-deploys on git push

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set VITE_API_URL to Railway backend URL
3. Auto-deploys on git push
