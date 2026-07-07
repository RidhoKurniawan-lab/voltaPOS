# voltaPOS

Aplikasi Point of Sale berbasis Laravel, Inertia, dan React untuk mengelola produk, kategori, supplier, pembelian, dan transaksi kasir.

## Stack

- PHP 8.3
- Laravel 13
- Inertia.js
- React 19
- Vite 8
- Tailwind CSS 4
- PHPUnit 12

## Fitur utama

- Autentikasi login, register, logout
- Dashboard aplikasi
- Manajemen kategori
- Manajemen supplier
- Manajemen produk dan stok
- Pencatatan pembelian untuk menambah stok
- Transaksi penjualan kasir untuk mengurangi stok
- Riwayat transaksi pembelian dan penjualan

## Struktur penting

- `app/Http/Controllers` — controller HTTP
- `app/Http/Requests` — validasi request terpisah
- `app/Services` — logika bisnis transaksi stok
- `app/Models` — model Eloquent
- `database/migrations` — skema database
- `resources/js/Pages` — halaman Inertia React
- `tests/Feature` — test fitur utama

## Setup lokal

1. Install dependency backend

```bash
composer install
```

2. Install dependency frontend

```bash
npm install
```

3. Siapkan environment

```bash
cp .env.example .env
php artisan key:generate
```

4. Siapkan database lalu jalankan migrasi

```bash
php artisan migrate
```

5. Jalankan aplikasi development

```bash
composer run dev
```

Atau jalankan terpisah:

```bash
php artisan serve
php artisan queue:listen --tries=1 --timeout=0
npm run dev
```

## Menjalankan test

```bash
php artisan test
```

## Catatan domain

### Penjualan

- Membuat header transaksi pada tabel `sales`
- Menyimpan item ke `sale_details`
- Mengurangi stok produk secara atomik lewat `SaleService`
- Mengembalikan stok saat penjualan dihapus

### Pembelian

- Membuat header transaksi pada tabel `purchases`
- Menyimpan item ke `purchase_details`
- Menambah stok produk lewat `PurchaseService`
- Menyesuaikan stok kembali saat pembelian diubah atau dihapus

## Konvensi yang dipakai

- Validasi input dipisahkan ke Form Request bila memungkinkan
- Logika transaksi stok ditempatkan di service layer
- Constraint unik penting juga dijaga di level database, bukan hanya validasi aplikasi

## Prioritas lanjutan yang disarankan

- Tambah authorization berbasis role untuk admin dan kasir
- Tambah test feature untuk CRUD utama dan validasi edge case
- Tambah seeder untuk data demo
- Tambah laporan penjualan dan pembelian
