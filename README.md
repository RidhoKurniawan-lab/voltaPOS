# voltaPOS

voltaPOS is a web-based Point of Sale application built with Laravel, Inertia.js, React, and Tailwind CSS. The system is designed to manage product data, inventory movement, purchase transactions, sales transactions, role-based access control, reporting, and operational dashboards for store administration and cashier workflows.

## Features

- Session-based authentication
- Role-based access control for `admin` and `petugas`
- Product management
- Category management
- Supplier management
- Purchase transaction management
- Sales transaction and cashier workflow
- Dashboard with role-specific views
- Financial and inventory reporting
- Receipt preview and browser-based printing
- Stock adjustment through sales and purchases

## Tech Stack

### Backend
- PHP 8.3+
- Laravel 13
- Inertia Laravel
- Ziggy

### Frontend
- React 19
- Inertia React
- Vite 8
- Tailwind CSS 4
- SweetAlert2

### Testing
- PHPUnit 12

## Application Modules

### Authentication
- Login
- Logout
- Admin-only user registration

### Master Data
- Products
- Categories
- Suppliers

### Transactions
- Sales
- Purchases

### Dashboard
- Admin dashboard with operational and financial summary
- Staff dashboard with personal transaction summary and cashier shortcuts

### Reports
- Revenue summary
- Purchase summary
- Net profit summary
- Sales trend
- Top selling products
- Low stock alerts

## Access Control

The application defines two user roles:

### Admin
Admin users have full access to the system, including:
- dashboard
- reports
- products
- categories
- suppliers
- purchases
- sales
- user registration

### Petugas
Petugas users are limited to operational cashier access, including:
- dashboard (staff view)
- sales transaction page
- sales history belonging to the logged-in user
- receipt reprint
- logout

Petugas users are restricted from accessing:
- reports
- product management
- category management
- supplier management
- purchase management
- transaction deletion

## Project Structure

```text
app/
├── Http/
│   ├── Controllers/
│   ├── Middleware/
│   └── Requests/
├── Models/
├── Repositories/
└── Services/

database/
├── factories/
├── migrations/
└── seeders/

resources/
├── css/
└── js/
    ├── Components/
    ├── Hook/
    ├── Layout/
    ├── Pages/
    └── Utils/

routes/
└── web.php

tests/
├── Feature/
└── Unit/
```

## Backend Architecture

The application primarily follows a controller-service architecture, with repository usage for modules that require dedicated data aggregation logic.

### Main Layers
- **Controllers** handle requests and return Inertia responses.
- **Services** contain business logic such as stock updates, dashboard aggregation, and reporting.
- **Repositories** are used where data aggregation is more complex, such as reporting.
- **Form Requests** handle request validation.
- **Models** define database interaction and relationships.

## Core Business Logic

### Sales Flow
- Sales are stored in the `sales` table.
- Items are stored in the `sale_details` table.
- Product stock is reduced when a sale is stored.
- Product stock is restored when a sale is deleted.
- The transaction user is recorded using `auth()->id()`.

### Purchase Flow
- Purchases are stored in the `purchases` table.
- Items are stored in the `purchase_details` table.
- Product stock is increased when a purchase is stored.
- Product stock is recalculated when a purchase is updated.
- Product stock is reduced again when a purchase is deleted.
- The transaction user is recorded using `auth()->id()`.

## Database Overview

Main database entities:
- `users`
- `categories`
- `suppliers`
- `products`
- `sales`
- `sale_details`
- `purchases`
- `purchase_details`

Important constraints include unique values for:
- `products.sku`
- `sales.invoice_number`
- `purchases.invoice_number`
- `categories.name`
- `categories.slug`
- `suppliers.name`

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd voltaPOS
```

### 2. Install backend dependencies

```bash
composer install
```

### 3. Install frontend dependencies

```bash
npm install
```

### 4. Create environment file

```bash
cp .env.example .env
```

### 5. Generate application key

```bash
php artisan key:generate
```

### 6. Configure database connection

Update the database configuration in `.env` according to your local environment.

### 7. Run database migrations

```bash
php artisan migrate
```

### 8. Start the development environment

```bash
composer run dev
```

This command starts:
- Laravel development server
- queue listener
- log viewer
- Vite development server

## Available Scripts

### Composer Scripts

```bash
composer run dev
composer run test
composer run setup
```

### NPM Scripts

```bash
npm run dev
npm run build
```

## Running Tests

```bash
php artisan test
```

Or using Composer:

```bash
composer run test
```

## Frontend Behavior

- The frontend uses Inertia.js page rendering.
- Authenticated user data is shared through Inertia props.
- Sidebar navigation is rendered conditionally based on user role.
- Confirmation dialogs use SweetAlert2.
- Receipt printing uses browser-native print functionality.

## Dashboard Behavior

### Admin Dashboard
Displays:
- total products
- total suppliers
- today sales revenue
- today purchase expense
- 7-day sales vs purchase trend
- low stock products
- recent sales and purchases

### Petugas Dashboard
Displays:
- personal transaction count for today
- personal sales total for today
- cashier shortcut
- personal recent sales for today
- receipt reprint action

## Reporting Behavior

The reporting module provides:
- filtered date range reporting
- revenue summary
- expense summary
- net profit summary
- daily sales trend
- top selling products
- low stock alerts
- browser print / PDF export support

## Route Overview

### Guest Routes
- `GET /` → login page
- `POST /login` → login action

### Authenticated Routes
- `POST /logout`
- `GET /dashboard`

### Admin Routes
- `GET /register`
- `POST /register`
- `GET /reports`
- resource routes for:
  - `products`
  - `categories`
  - `suppliers`
  - `purchases`

### Admin and Petugas Routes
- resource routes for `sales` except `show`, `edit`, and `update`

## License

This project is provided for application development and internal system usage. License terms should be adjusted according to the project owner or deployment context.