-- MySQL dump 10.13  Distrib 8.4.10, for Linux (x86_64)
--
-- Host: localhost    Database: voltapos
-- ------------------------------------------------------
-- Server version	8.4.10

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_name_unique` (`name`),
  UNIQUE KEY `categories_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Kopi','kopi','2026-07-02 06:29:14','2026-07-02 06:29:14'),(2,'Merchandise','merchandise','2026-07-02 06:29:14','2026-07-02 06:29:14'),(3,'Biji Kopi (Beans)','biji-kopi-beans','2026-07-02 06:29:14','2026-07-02 06:29:14'),(4,'Non-Coffee','non-coffee','2026-07-02 06:29:14','2026-07-02 06:29:14'),(5,'Makanan Ringan','makanan-ringan','2026-07-02 06:29:14','2026-07-02 06:29:14');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` smallint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_06_18_114054_create_categories_table',1),(5,'2026_06_18_114227_create_suppliers_table',1),(6,'2026_06_18_114428_create_products_table',1),(7,'2026_06_18_115339_create_purchases_table',1),(8,'2026_06_18_115708_create_purchase_details_table',1),(9,'2026_06_18_120202_create_sales_table',1),(10,'2026_06_18_120457_create_sale_details_table',1),(11,'2026_07_02_000001_add_unique_constraints_to_pos_tables',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price_buy` decimal(15,2) NOT NULL,
  `price_sell` decimal(15,2) NOT NULL,
  `stock` decimal(8,2) NOT NULL DEFAULT '0.00',
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_sku_unique` (`sku`),
  KEY `products_category_id_foreign` (`category_id`),
  CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,'ut tenetur','PRD-NNVG4M6M',44000.00,56000.00,32.00,NULL,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(2,1,'qui consequatur','PRD-M5VCEYQ2',26000.00,41000.00,99.00,NULL,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(3,1,'tenetur eos','PRD-AQE5M47P',24000.00,35000.00,75.00,NULL,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(4,1,'earum delectus','PRD-1F92YZHK',50000.00,62000.00,26.00,NULL,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(5,2,'nemo animi','PRD-2Q6JNC7K',42000.00,52000.00,61.00,NULL,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(6,2,'culpa fuga','PRD-7W1T9QRQ',18000.00,33000.00,76.00,NULL,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(7,2,'nam eveniet','PRD-S4C18SDS',10000.00,16000.00,73.00,NULL,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(8,2,'provident saepe','PRD-DZ40Z4NQ',39000.00,48000.00,33.00,NULL,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(9,3,'eaque dolorum','PRD-0MVMGYH9',41000.00,53000.00,36.00,NULL,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(10,3,'vel ratione','PRD-TRSX2FZ6',12000.00,25000.00,30.00,NULL,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(11,3,'officia sed','PRD-KHCT7E1F',40000.00,54000.00,24.00,NULL,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(12,3,'repudiandae sint','PRD-R0BEG5E9',13000.00,20000.00,63.00,NULL,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(13,4,'voluptatum et','PRD-PVPPNEZ6',47000.00,52000.00,31.00,NULL,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(14,4,'animi odio','PRD-J69PY4DQ',19000.00,24000.00,48.00,NULL,'2026-07-02 06:29:14','2026-07-02 07:03:17'),(15,4,'ut reprehenderit','PRD-F63NGJV5',25000.00,30000.00,96.00,NULL,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(16,4,'eum numquam','PRD-KQ9BXMZZ',28000.00,42000.00,76.00,NULL,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(17,5,'aut sit','PRD-BN3G9D3H',27000.00,35000.00,89.00,NULL,'2026-07-02 06:29:14','2026-07-02 14:26:19'),(18,5,'recusandae suscipit','PRD-S606J445',45000.00,53000.00,85.00,NULL,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(19,5,'ipsam incidunt','PRD-1KJRFJ8R',16000.00,23000.00,23.00,NULL,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(20,5,'sit in','PRD-KHZX91WN',31000.00,41000.00,56.00,NULL,'2026-07-02 06:29:14','2026-07-02 06:29:14');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_details`
--

DROP TABLE IF EXISTS `purchase_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `purchase_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `quantity` decimal(15,2) NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `subtotal` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `purchase_details_purchase_id_foreign` (`purchase_id`),
  KEY `purchase_details_product_id_foreign` (`product_id`),
  CONSTRAINT `purchase_details_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `purchase_details_purchase_id_foreign` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_details`
--

LOCK TABLES `purchase_details` WRITE;
/*!40000 ALTER TABLE `purchase_details` DISABLE KEYS */;
INSERT INTO `purchase_details` VALUES (1,1,10,13.00,12000.00,156000.00,NULL,NULL),(2,1,18,10.00,45000.00,450000.00,NULL,NULL),(3,1,20,15.00,31000.00,465000.00,NULL,NULL),(4,2,15,10.00,25000.00,250000.00,NULL,NULL),(5,2,17,11.00,27000.00,297000.00,NULL,NULL),(6,2,18,6.00,45000.00,270000.00,NULL,NULL),(7,3,5,8.00,42000.00,336000.00,NULL,NULL),(8,3,10,13.00,12000.00,156000.00,NULL,NULL),(9,4,19,7.00,16000.00,112000.00,NULL,NULL),(10,5,1,12.00,44000.00,528000.00,NULL,NULL);
/*!40000 ALTER TABLE `purchase_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchases`
--

DROP TABLE IF EXISTS `purchases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchases` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `supplier_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `invoice_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_price` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `purchases_invoice_number_unique` (`invoice_number`),
  KEY `purchases_supplier_id_foreign` (`supplier_id`),
  KEY `purchases_user_id_foreign` (`user_id`),
  CONSTRAINT `purchases_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `purchases_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchases`
--

LOCK TABLES `purchases` WRITE;
/*!40000 ALTER TABLE `purchases` DISABLE KEYS */;
INSERT INTO `purchases` VALUES (1,3,1,'INV-IN-20260702001',1071000.00,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(2,3,1,'INV-IN-20260702002',817000.00,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(3,3,1,'INV-IN-20260702003',492000.00,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(4,1,1,'INV-IN-20260702004',112000.00,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(5,1,1,'INV-IN-20260702005',528000.00,'2026-07-02 06:29:14','2026-07-02 06:29:14');
/*!40000 ALTER TABLE `purchases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sale_details`
--

DROP TABLE IF EXISTS `sale_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sale_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sale_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `quantity` decimal(15,2) NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `subtotal` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sale_details_sale_id_foreign` (`sale_id`),
  KEY `sale_details_product_id_foreign` (`product_id`),
  CONSTRAINT `sale_details_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sale_details_sale_id_foreign` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sale_details`
--

LOCK TABLES `sale_details` WRITE;
/*!40000 ALTER TABLE `sale_details` DISABLE KEYS */;
INSERT INTO `sale_details` VALUES (1,1,7,2.00,16000.00,32000.00,NULL,NULL),(2,1,12,1.00,20000.00,20000.00,NULL,NULL),(3,1,14,3.00,24000.00,72000.00,NULL,NULL),(4,1,19,2.00,23000.00,46000.00,NULL,NULL),(5,2,7,2.00,16000.00,32000.00,NULL,NULL),(6,3,16,3.00,42000.00,126000.00,NULL,NULL),(7,3,17,2.00,35000.00,70000.00,NULL,NULL),(8,3,20,2.00,41000.00,82000.00,NULL,NULL),(9,4,5,2.00,52000.00,104000.00,NULL,NULL),(10,4,8,1.00,48000.00,48000.00,NULL,NULL),(11,4,15,3.00,30000.00,90000.00,NULL,NULL),(12,5,4,2.00,62000.00,124000.00,NULL,NULL),(13,5,11,2.00,54000.00,108000.00,NULL,NULL),(14,5,16,3.00,42000.00,126000.00,NULL,NULL),(15,6,8,3.00,48000.00,144000.00,NULL,NULL),(16,6,9,3.00,53000.00,159000.00,NULL,NULL),(17,6,16,1.00,42000.00,42000.00,NULL,NULL),(18,7,2,1.00,41000.00,41000.00,NULL,NULL),(19,7,11,3.00,54000.00,162000.00,NULL,NULL),(20,7,15,1.00,30000.00,30000.00,NULL,NULL),(21,7,19,2.00,23000.00,46000.00,NULL,NULL),(22,8,4,2.00,62000.00,124000.00,NULL,NULL),(23,9,4,1.00,62000.00,62000.00,NULL,NULL),(24,9,10,1.00,25000.00,25000.00,NULL,NULL),(25,10,8,3.00,48000.00,144000.00,NULL,NULL),(26,10,16,2.00,42000.00,84000.00,NULL,NULL),(27,11,14,1.00,24000.00,24000.00,NULL,NULL),(28,12,3,3.00,35000.00,105000.00,NULL,NULL),(29,12,6,2.00,33000.00,66000.00,NULL,NULL),(30,12,13,2.00,52000.00,104000.00,NULL,NULL),(31,13,7,2.00,16000.00,32000.00,NULL,NULL),(32,13,14,1.00,24000.00,24000.00,NULL,NULL),(33,13,17,3.00,35000.00,105000.00,NULL,NULL),(34,14,20,1.00,41000.00,41000.00,NULL,NULL),(35,15,6,3.00,33000.00,99000.00,NULL,NULL),(36,15,14,3.00,24000.00,72000.00,NULL,NULL),(37,16,14,1.00,24000.00,24000.00,'2026-07-02 07:01:56','2026-07-02 07:01:56'),(38,17,14,20.00,24000.00,480000.00,'2026-07-02 07:03:17','2026-07-02 07:03:17'),(39,18,17,6.00,35000.00,210000.00,'2026-07-02 14:26:19','2026-07-02 14:26:19');
/*!40000 ALTER TABLE `sale_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales`
--

DROP TABLE IF EXISTS `sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `invoice_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_price` decimal(15,2) NOT NULL,
  `money_received` decimal(15,2) NOT NULL,
  `money_change` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sales_invoice_number_unique` (`invoice_number`),
  KEY `sales_user_id_foreign` (`user_id`),
  CONSTRAINT `sales_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
INSERT INTO `sales` VALUES (1,1,'INV-OUT-20260702001',170000.00,200000.00,30000.00,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(2,1,'INV-OUT-20260702002',32000.00,50000.00,18000.00,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(3,2,'INV-OUT-20260702003',278000.00,300000.00,22000.00,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(4,2,'INV-OUT-20260702004',242000.00,250000.00,8000.00,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(5,2,'INV-OUT-20260702005',358000.00,400000.00,42000.00,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(6,1,'INV-OUT-20260702006',345000.00,350000.00,5000.00,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(7,2,'INV-OUT-20260702007',279000.00,300000.00,21000.00,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(8,2,'INV-OUT-20260702008',124000.00,150000.00,26000.00,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(9,2,'INV-OUT-20260702009',87000.00,100000.00,13000.00,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(10,2,'INV-OUT-20260702010',228000.00,250000.00,22000.00,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(11,2,'INV-OUT-20260702011',24000.00,50000.00,26000.00,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(12,2,'INV-OUT-20260702012',275000.00,300000.00,25000.00,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(13,1,'INV-OUT-20260702013',161000.00,200000.00,39000.00,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(14,1,'INV-OUT-20260702014',41000.00,50000.00,9000.00,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(15,1,'INV-OUT-20260702015',171000.00,200000.00,29000.00,'2026-07-02 06:29:14','2026-07-02 06:29:14'),(16,2,'INV-20260702-0001',24000.00,50000.00,26000.00,'2026-07-02 07:01:56','2026-07-02 07:01:56'),(17,1,'INV-20260702-0002',480000.00,500000.00,20000.00,'2026-07-02 07:03:17','2026-07-02 07:03:17'),(18,1,'INV-20260702-0003',210000.00,300000.00,90000.00,'2026-07-02 14:26:19','2026-07-02 14:26:19');
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('80UWp90QHxKPgkLJcLTy17TtlOgXtb6Pi0QLZewi',NULL,'172.23.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJGcEduMDRWNXpPNWV4bVVqT29heFpFczVPOHdvRTlqMkRhdVZLZlNJIiwiX2ZsYXNoIjp7Im5ldyI6W10sIm9sZCI6W119LCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cDpcL1wvdm9sdGFwb3MudGVzdCIsInJvdXRlIjoibG9naW4ifX0=',1783010396),('BmNV5farjj9wJ0TReNkoONw208nmjRD9Iemfy68U',NULL,'172.23.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJqZGl3cVA0dEx4ZGdmVEZXc3ZjNGRvaERISFp0d3RvQ2w3UklsQTkwIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL3ZvbHRhcG9zLnRlc3QiLCJyb3V0ZSI6ImxvZ2luIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=',1783010396),('t4LTB8StQfqoqVzQ3Jad7mATqWQxald2MVPKAgRO',1,'172.18.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJuVjUxaU9aUDdlU3ZlNWtqZGFQanlOZWZDT21uRFo0cWJnbllTVzRIIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL3ZvbHRhcG9zLnRlc3QiLCJyb3V0ZSI6ImxvZ2luIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfSwibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiOjF9',1783438947);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `suppliers_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (1,'Wolff-Kiehn Supplier','+1.256.968.2695','5615 Rogers Meadow\nVeronicaside, MS 42196-0026','2026-07-02 06:29:14','2026-07-02 06:29:14'),(2,'Kautzer Inc Supplier','+1-774-830-3328','2988 Cartwright Road\nLake Kailyn, MD 10313','2026-07-02 06:29:14','2026-07-02 06:29:14'),(3,'Volkman and Sons Supplier','585.547.6748','115 Dorothy Street\nMargemouth, NE 14859-3341','2026-07-02 06:29:14','2026-07-02 06:29:14');
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `google_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','petugas') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'petugas',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin Ridho','admin@mail.com',NULL,NULL,'$2y$12$8Xu8IWCRUNW87o/ov7X0KO1KEblLpP8ujyPBw1wB75Qy53T6KNVIW','admin',NULL,'2026-07-02 06:29:13','2026-07-02 06:29:13'),(2,'Kasir Volta','petugas@mail.com',NULL,NULL,'$2y$12$Dwgp9I1t9DN2iIeYsfGJWOi70oVkI3586RnLpaKqRHSZnav3DfY4S','petugas',NULL,'2026-07-02 06:29:13','2026-07-02 06:29:13');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-07 16:08:50
