# Dokumen Analisis voltaPOS

## 1. Analisis Sistem

### 1.1 Gambaran Umum
`voltaPOS` adalah aplikasi Point of Sale berbasis web yang dibangun menggunakan Laravel 13, PHP 8.3, Inertia.js, React, Vite, dan Tailwind CSS. Sistem ini digunakan untuk mengelola proses operasional toko mulai dari autentikasi pengguna, pengelolaan master data, transaksi penjualan, transaksi pembelian, dashboard operasional, hingga laporan analitik.

### 1.2 Tujuan Sistem
Sistem dirancang untuk membantu operasional toko agar:
- transaksi penjualan dapat dicatat dengan cepat,
- stok barang selalu terbarui,
- pembelian barang masuk terdokumentasi,
- pemilik/admin dapat memantau performa bisnis,
- hak akses pengguna dibatasi sesuai peran.

### 1.3 Role Pengguna
Sistem memiliki dua role utama:

#### Admin
Admin memiliki akses penuh ke seluruh fitur sistem, meliputi:
- dashboard utama,
- laporan analytics,
- CRUD produk,
- CRUD kategori,
- CRUD supplier,
- transaksi pembelian,
- transaksi penjualan,
- pendaftaran user baru.

#### Petugas / Kasir
Petugas hanya memiliki akses terbatas pada area operasional kasir, yaitu:
- dashboard versi petugas,
- halaman kasir,
- penyimpanan transaksi penjualan,
- riwayat penjualan miliknya sendiri,
- cetak ulang struk,
- logout.

### 1.4 Arsitektur Sistem
Sistem menggunakan pola kerja utama:
- **Route** untuk mendefinisikan endpoint,
- **Controller** untuk menerima request dan mengarahkan alur,
- **Service** untuk logika bisnis,
- **Repository** pada modul tertentu seperti reporting,
- **Inertia + React** untuk tampilan antarmuka.

Arsitektur ini membuat logika bisnis penting seperti transaksi stok, dashboard, dan reporting tidak menumpuk di controller.

### 1.5 Keamanan dan Hak Akses
Keamanan aplikasi saat ini sudah mencakup:
- autentikasi berbasis session Laravel,
- middleware `auth`,
- middleware `role` untuk pembatasan akses route,
- payload dashboard dibedakan berdasarkan role,
- `user_id` transaksi diambil langsung dari backend menggunakan `auth()->id()`,
- non-admin tidak bisa menghapus transaksi.

### 1.6 Modul Utama
Modul yang tersedia dalam sistem:
- Autentikasi
- Dashboard
- Produk
- Kategori
- Supplier
- Pembelian
- Penjualan / Kasir
- Laporan

---

## 2. Struktur Database

### 2.1 Tabel Inti
Berikut struktur tabel utama yang digunakan sistem.

### `users`
Menyimpan data akun pengguna.

Field utama:
- `id`
- `name`
- `email`
- `password`
- `google_id`
- `role` (`admin`, `petugas`)
- `remember_token`
- `timestamps`

Fungsi:
- autentikasi,
- pembatasan role,
- pencatatan siapa yang membuat transaksi.

### `categories`
Menyimpan kategori produk.

Field utama:
- `id`
- `name`
- `slug`
- `timestamps`

Fungsi:
- klasifikasi produk.

### `suppliers`
Menyimpan data pemasok barang.

Field utama:
- `id`
- `name`
- `phone`
- `address`
- `timestamps`

Fungsi:
- sumber pembelian barang masuk.

### `products`
Menyimpan data produk.

Field utama:
- `id`
- `category_id`
- `name`
- `sku`
- `price_buy`
- `price_sell`
- `stock`
- `description`
- `timestamps`

Fungsi:
- data master barang,
- sumber stok dan harga transaksi.

### `sales`
Menyimpan header transaksi penjualan.

Field utama:
- `id`
- `user_id`
- `invoice_number`
- `total_price`
- `money_received`
- `money_change`
- `timestamps`

Fungsi:
- mencatat transaksi penjualan dan petugas yang melakukan transaksi.

### `sale_details`
Menyimpan detail item penjualan.

Field utama:
- `id`
- `sale_id`
- `product_id`
- `quantity`
- `price`
- `subtotal`
- `timestamps`

Fungsi:
- mencatat item-item yang terjual dalam satu transaksi.

### `purchases`
Menyimpan header transaksi pembelian.

Field utama:
- `id`
- `supplier_id`
- `user_id`
- `invoice_number`
- `total_price`
- `timestamps`

Fungsi:
- mencatat pembelian barang masuk.

### `purchase_details`
Menyimpan detail item pembelian.

Field utama:
- `id`
- `purchase_id`
- `product_id`
- `quantity`
- `price`
- `subtotal`
- `timestamps`

Fungsi:
- mencatat item yang dibeli dari supplier.

### 2.2 Relasi Antar Tabel
Relasi utama sistem:
- `categories` 1..* `products`
- `users` 1..* `sales`
- `users` 1..* `purchases`
- `suppliers` 1..* `purchases`
- `sales` 1..* `sale_details`
- `purchases` 1..* `purchase_details`
- `products` 1..* `sale_details`
- `products` 1..* `purchase_details`

### 2.3 Integritas Data
Sistem telah diperkuat dengan beberapa constraint penting:
- unique `products.sku`
- unique `sales.invoice_number`
- unique `purchases.invoice_number`
- unique `categories.name`
- unique `categories.slug`
- unique `suppliers.name`

Selain itu, beberapa proses stok dijalankan di dalam `DB::transaction()` untuk menjaga konsistensi data.

---

## 3. Implementasi

### 3.1 Autentikasi
Autentikasi menggunakan Laravel session-based authentication.

Fitur yang tersedia:
- login,
- logout,
- register user baru oleh admin.

Implementasi utama:
- `AuthController`
- `LoginRequest`
- `RegisterRequest`
- shared auth props via `HandleInertiaRequests`

### 3.2 Middleware Role
Custom middleware `RoleMiddleware` digunakan untuk memeriksa role pengguna.

Contoh penerapan:
- `role:admin` untuk route admin-only,
- `role:admin,petugas` untuk route yang boleh diakses dua role.

Hal ini memastikan proteksi tidak hanya di frontend, tetapi juga di backend.

### 3.3 Modul Produk, Kategori, dan Supplier
Modul master data dikelola dengan pola CRUD.

Implementasi mencakup:
- validasi input,
- pagination,
- filtering,
- konfirmasi hapus melalui SweetAlert,
- pembatasan akses khusus admin.

### 3.4 Modul Penjualan
Modul penjualan digunakan sebagai mesin kasir.

Fitur utama:
- pilih produk,
- hitung subtotal dan grand total,
- validasi jumlah item dan uang diterima,
- simpan transaksi,
- cetak receipt,
- riwayat penjualan,
- petugas hanya melihat penjualannya sendiri.

Logika bisnis utama berada di:
- `SaleService`

Proses yang dilakukan:
1. simpan header penjualan,
2. simpan detail item,
3. validasi stok,
4. kurangi stok produk,
5. cetak ulang struk bila dibutuhkan.

### 3.5 Modul Pembelian
Modul pembelian digunakan untuk barang masuk dari supplier.

Fitur utama:
- pilih supplier,
- tambah item produk,
- hitung total pembelian,
- simpan pembelian,
- edit pembelian,
- delete pembelian,
- penyesuaian stok otomatis.

Logika bisnis utama berada di:
- `PurchaseService`

Proses yang dilakukan:
1. simpan header pembelian,
2. simpan detail pembelian,
3. tambah stok produk,
4. saat update, stok lama dikembalikan lalu dihitung ulang,
5. saat delete, stok dikurangi kembali.

### 3.6 Dashboard
Dashboard dibedakan berdasarkan role.

#### Dashboard Admin
Menampilkan:
- total produk,
- total supplier,
- omzet hari ini,
- pengeluaran pembelian hari ini,
- tren penjualan vs pembelian 7 hari,
- stok menipis,
- aktivitas penjualan dan pembelian terbaru.

#### Dashboard Petugas
Menampilkan:
- total transaksi miliknya hari ini,
- omzet miliknya hari ini,
- shortcut ke kasir,
- riwayat 5 transaksi miliknya hari ini,
- cetak ulang struk transaksi.

Logika utama dashboard berada di:
- `DashboardService`

### 3.7 Modul Laporan
Modul laporan digunakan untuk analisis operasional dan keuangan.

Fitur utama:
- filter tanggal,
- total pendapatan,
- total pengeluaran,
- laba bersih,
- total transaksi penjualan,
- tren penjualan harian,
- top selling products,
- low stock alert,
- cetak / ekspor PDF via `window.print()`.

Logika utama berada di:
- `ReportService`
- `ReportRepository`

### 3.8 Implementasi Frontend
Frontend dibangun dengan React + Inertia.js.

Karakteristik implementasi:
- page-based structure,
- reusable components,
- flash messages,
- modal detail,
- konfirmasi swal,
- receipt preview,
- role-based sidebar.

Dark mode telah dihapus dari frontend agar UI lebih stabil dan konsisten.

### 3.9 Pengujian
Project sudah memiliki pengujian dasar pada area berikut:
- autentikasi,
- role access,
- inventory transaction,
- pembatasan akses modul,
- pembatasan delete transaksi untuk petugas.

Meskipun begitu, pengujian masih perlu ditambah untuk cakupan yang lebih kuat pada seluruh modul.

---

## 4. Kesimpulan

### 4.1 Kesimpulan Umum
`voltaPOS` saat ini sudah menjadi aplikasi POS yang cukup matang untuk kebutuhan operasional internal toko. Sistem tidak lagi sekadar CRUD dasar, melainkan sudah memiliki:
- autentikasi dan hak akses berbasis role,
- pengelolaan stok yang terintegrasi,
- transaksi penjualan dan pembelian,
- dashboard operasional,
- pelaporan dasar,
- pembatasan data sensitif berdasarkan role.

### 4.2 Kelebihan Sistem
Beberapa kelebihan utama:
- struktur backend sudah mulai rapi,
- logika bisnis penting ditempatkan di service,
- transaksi stok memakai database transaction,
- keamanan role sudah jauh lebih baik,
- data admin dan petugas dipisahkan dengan benar,
- UI cukup modern dan mudah digunakan.

### 4.3 Kekurangan / Catatan Pengembangan
Beberapa area yang masih dapat ditingkatkan:
- konsistensi arsitektur Controller-Service-Repository di semua modul,
- test coverage masih perlu ditambah,
- beberapa file frontend masih cukup besar,
- laporan masih bisa dikembangkan ke level business intelligence yang lebih lanjut,
- performa query dapat dioptimalkan lagi bila data transaksi makin besar.

### 4.4 Rekomendasi Lanjutan
Rekomendasi pengembangan berikutnya:
1. tambah test feature dan integration test lebih lengkap,
2. refactor page frontend yang terlalu besar menjadi sub-component,
3. tambah seed data dan admin default,
4. tambah laporan profit, margin, dan performa kasir,
5. optimasi indexing database untuk data transaksi skala besar.

---

Dokumen ini menggambarkan kondisi sistem `voltaPOS` berdasarkan implementasi project saat ini.