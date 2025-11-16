-- ============================================
-- Pizzéria teljes adatbázis séma
-- ============================================

-- Táblák törlése (ha léteznek) - fordított sorrendben a foreign key miatt
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `pizzas`;
DROP TABLE IF EXISTS `users`;

-- ============================================
-- Users tábla: Felhasználók
-- ============================================
CREATE TABLE `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `address` VARCHAR(255) DEFAULT NULL,
  `role` VARCHAR(20) NOT NULL DEFAULT 'user',
  `reg` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `last` TIMESTAMP NULL DEFAULT NULL,
  `status` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Pizzas tábla: Pizzák
-- ============================================
CREATE TABLE `pizzas` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT DEFAULT NULL,
  `calory` INT(11) NOT NULL DEFAULT 0,
  `image` VARCHAR(255) DEFAULT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Orders tábla: Rendelések
-- ============================================
CREATE TABLE `orders` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `total` DECIMAL(10,2) DEFAULT 0.00,
  `status` VARCHAR(50) DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Order Items tábla: Rendelés tételek
-- ============================================
CREATE TABLE `order_items` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `order_id` INT(11) NOT NULL,
  `pizza_id` INT(11) NOT NULL,
  `quantity` INT(11) NOT NULL DEFAULT 1,
  `price` DECIMAL(10,2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_pizza_id` (`pizza_id`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_order_items_pizza` FOREIGN KEY (`pizza_id`) REFERENCES `pizzas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Teszt adatok beszúrása
-- ============================================

-- Felhasználók
-- Admin felhasználó: email: admin, jelszó: admin
-- SHA1 hash: 21232f297a57a5a743894a0e4a801fc3
INSERT INTO `users` (`name`, `email`, `password`, `role`, `status`) VALUES
('Admin', 'admin', '21232f297a57a5a743894a0e4a801fc3', 'admin', 1);

-- Teszt felhasználó: email: teszt, jelszó: teszt
-- SHA1 hash: 8c6976e5b5410415bde908bd4dee15dfb167a9c8
INSERT INTO `users` (`name`, `email`, `password`, `role`, `phone`, `address`, `status`) VALUES
('Teszt Felhasználó', 'teszt', '8c6976e5b5410415bde908bd4dee15dfb167a9c8', 'user', '0612345678', 'Teszt utca 123, Budapest', 1);

-- Pizzák példa adatok
INSERT INTO `pizzas` (`name`, `description`, `calory`, `price`, `image`) VALUES
('Margherita', 'Klasszikus olasz pizza friss bazsalikommal és mozzarellával', 850, 1990, ''),
('Pepperoni', 'Ízletes pepperoni kolbásszal és extra sajttal', 1200, 2490, ''),
('Hawaii', 'Sonkával és ananásszal, a kedvenc választás', 1100, 2290, ''),
('Négy sajtos', 'Gorgonzola, mozzarella, parmezán és trappista sajttal', 1350, 2790, ''),
('Bolognese', 'Húsos bolognese szósszal és mozzarellával', 1450, 2990, '');

-- Példa rendelések (a teszt felhasználóhoz)
-- Először meg kell találni a teszt felhasználó ID-ját
SET @teszt_user_id = (SELECT `id` FROM `users` WHERE `email` = 'teszt' LIMIT 1);

-- Rendelés 1
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES
(@teszt_user_id, 4480, 'completed');

SET @order1_id = LAST_INSERT_ID();

-- Rendelés 1 tételek
SET @margherita_id = (SELECT `id` FROM `pizzas` WHERE `name` = 'Margherita' LIMIT 1);
SET @pepperoni_id = (SELECT `id` FROM `pizzas` WHERE `name` = 'Pepperoni' LIMIT 1);

INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order1_id, @margherita_id, 1, 1990),
(@order1_id, @pepperoni_id, 1, 2490);

-- Rendelés 2
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES
(@teszt_user_id, 2290, 'pending');

SET @order2_id = LAST_INSERT_ID();

-- Rendelés 2 tételek
SET @hawaii_id = (SELECT `id` FROM `pizzas` WHERE `name` = 'Hawaii' LIMIT 1);

INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order2_id, @hawaii_id, 1, 2290);

-- ============================================
-- Véglegesítés
-- ============================================
-- Változók törlése
SET @teszt_user_id = NULL;
SET @order1_id = NULL;
SET @order2_id = NULL;
SET @margherita_id = NULL;
SET @pepperoni_id = NULL;
SET @hawaii_id = NULL;

