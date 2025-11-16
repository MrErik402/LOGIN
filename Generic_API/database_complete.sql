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

-- További felhasználók (minden jelszó: teszt123 - SHA1: b444ac06613fc8d63795be9ad0beaf55011936ac)
INSERT INTO `users` (`name`, `email`, `password`, `role`, `phone`, `address`, `status`) VALUES
('Kovács János', 'kovacs.janos@email.com', 'b444ac06613fc8d63795be9ad0beaf55011936ac', 'user', '06301234567', 'Kossuth Lajos utca 45, Budapest', 1),
('Nagy Mária', 'nagy.maria@email.com', 'b444ac06613fc8d63795be9ad0beaf55011936ac', 'user', '06301234568', 'Rákóczi út 12, Debrecen', 1),
('Szabó Péter', 'szabo.peter@email.com', 'b444ac06613fc8d63795be9ad0beaf55011936ac', 'user', '06301234569', 'Petőfi Sándor utca 78, Szeged', 1),
('Horváth Anna', 'horvath.anna@email.com', 'b444ac06613fc8d63795be9ad0beaf55011936ac', 'user', '06301234570', 'Széchenyi tér 5, Pécs', 1),
('Tóth Gábor', 'toth.gabor@email.com', 'b444ac06613fc8d63795be9ad0beaf55011936ac', 'user', '06301234571', 'Bartók Béla út 23, Győr', 1),
('Varga Eszter', 'varga.eszter@email.com', 'b444ac06613fc8d63795be9ad0beaf55011936ac', 'user', '06301234572', 'Váci út 67, Budapest', 1),
('Molnár Dávid', 'molnar.david@email.com', 'b444ac06613fc8d63795be9ad0beaf55011936ac', 'user', '06301234573', 'Fő utca 34, Miskolc', 1),
('Farkas Zsuzsanna', 'farkas.zsuzsanna@email.com', 'b444ac06613fc8d63795be9ad0beaf55011936ac', 'user', '06301234574', 'Deák Ferenc utca 56, Székesfehérvár', 1),
('Balogh László', 'balogh.laszlo@email.com', 'b444ac06613fc8d63795be9ad0beaf55011936ac', 'user', '06301234575', 'Szent István körút 89, Szombathely', 1),
('Papp Judit', 'papp.judit@email.com', 'b444ac06613fc8d63795be9ad0beaf55011936ac', 'user', '06301234576', 'Dózsa György út 11, Nyíregyháza', 1),
('Lakatos Zoltán', 'lakatos.zoltan@email.com', 'b444ac06613fc8d63795be9ad0beaf55011936ac', 'user', '06301234577', 'Andrássy út 123, Budapest', 1),
('Mészáros Katalin', 'meszaros.katalin@email.com', 'b444ac06613fc8d63795be9ad0beaf55011936ac', 'user', '06301234578', 'Fő tér 7, Kecskemét', 1),
('Oláh András', 'olah.andras@email.com', 'b444ac06613fc8d63795be9ad0beaf55011936ac', 'user', '06301234579', 'Kálvin tér 15, Budapest', 1),
('Simon Éva', 'simon.eva@email.com', 'b444ac06613fc8d63795be9ad0beaf55011936ac', 'user', '06301234580', 'Széll Kálmán tér 22, Budapest', 1),
('Rácz Balázs', 'racz.balazs@email.com', 'b444ac06613fc8d63795be9ad0beaf55011936ac', 'user', '06301234581', 'Csengery út 44, Szeged', 1),
('Fekete Ildikó', 'fekete.ildiko@email.com', 'b444ac06613fc8d63795be9ad0beaf55011936ac', 'user', '06301234582', 'Kossuth tér 18, Debrecen', 1),
('Szűcs Tamás', 'szucs.tamas@email.com', 'b444ac06613fc8d63795be9ad0beaf55011936ac', 'user', '06301234583', 'Árpád út 99, Székesfehérvár', 1),
('Magyar Krisztina', 'magyar.krisztina@email.com', 'b444ac06613fc8d63795be9ad0beaf55011936ac', 'user', '06301234584', 'Vasvári Pál utca 33, Pécs', 1),
('Király Róbert', 'kiraly.robert@email.com', 'b444ac06613fc8d63795be9ad0beaf55011936ac', 'user', '06301234585', 'Szent István út 77, Győr', 1),
('Orsós Gabriella', 'orsos.gabriella@email.com', 'b444ac06613fc8d63795be9ad0beaf55011936ac', 'user', '06301234586', 'Hunyadi János út 88, Budapest', 1),
('Bodnár Márton', 'bodnar.marton@email.com', 'b444ac06613fc8d63795be9ad0beaf55011936ac', 'user', '06301234587', 'Batthyány út 66, Miskolc', 1),
('Kocsis Viktória', 'kocsis.viktoria@email.com', 'b444ac06613fc8d63795be9ad0beaf55011936ac', 'user', '06301234588', 'Erzsébet tér 4, Szombathely', 1),
('Pintér Attila', 'pinter.attila@email.com', 'b444ac06613fc8d63795be9ad0beaf55011936ac', 'user', '06301234589', 'Rákóczi Ferenc út 55, Nyíregyháza', 1),
('Németh Andrea', 'nemeth.andrea@email.com', 'b444ac06613fc8d63795be9ad0beaf55011936ac', 'user', '06301234590', 'Rózsa utca 21, Kecskemét', 1),
('Takács István', 'takacs.istvan@email.com', 'b444ac06613fc8d63795be9ad0beaf55011936ac', 'user', '06301234591', 'Mátyás király út 39, Budapest', 1),
('Bíró Renáta', 'biro.renata@email.com', 'b444ac06613fc8d63795be9ad0beaf55011936ac', 'user', '06301234592', 'József Attila utca 62, Szeged', 1),
('Fehér Csaba', 'feher.csaba@email.com', 'b444ac06613fc8d63795be9ad0beaf55011936ac', 'user', '06301234593', 'Béke út 14, Debrecen', 1);

-- Pizzák példa adatok
INSERT INTO `pizzas` (`name`, `description`, `calory`, `price`, `image`) VALUES
('Margherita', 'Klasszikus olasz pizza friss bazsalikommal és mozzarellával', 850, 1990, ''),
('Pepperoni', 'Ízletes pepperoni kolbásszal és extra sajttal', 1200, 2490, ''),
('Hawaii', 'Sonkával és ananásszal, a kedvenc választás', 1100, 2290, ''),
('Négy sajtos', 'Gorgonzola, mozzarella, parmezán és trappista sajttal', 1350, 2790, ''),
('Bolognese', 'Húsos bolognese szósszal és mozzarellával', 1450, 2990, ''),
('Prosciutto', 'Olasz sonkával, rukkola salátával és parmezánnal', 1150, 2690, ''),
('Quattro Stagioni', 'Négy évszak íze: sonka, gomba, olivabogyó, articsóka', 1300, 2890, ''),
('Diavola', 'Erős csiliszósszal, pepperonival és pikáns kolbásszal', 1400, 2590, ''),
('Capricciosa', 'Sonkával, gombával, olivabogyóval és articsókával', 1250, 2790, ''),
('Funghi', 'Gombás pizza friss gombával és mozzarellával', 1050, 2390, ''),
('Vegetariana', 'Friss zöldségekkel: paprika, gomba, olivabogyó, paradicsom', 950, 2190, ''),
('Tonno', 'Tonhalas pizza hagymával és kapribogyóval', 1100, 2490, ''),
('Calzone', 'Behajtott pizza sonkával, gombával és sajttal', 1550, 3190, ''),
('Pizza Rustica', 'Falusi stílusú pizza kolbásszal, hagymával és fokhagymával', 1600, 2790, ''),
('BBQ Csirke', 'Grillezett csirkemellel, BBQ szósszal és vöröshagymával', 1500, 2890, ''),
('Mexikói', 'Csípős jalapeño, csirkehús, bab és kukorica', 1450, 2690, ''),
('Gyros Pizza', 'Gyros hússal, hagymával és tejfölös mártással', 1650, 2990, ''),
('Tenger gyümölcsei', 'Tengeri gyümölcsökből készült ízletes keverék', 1350, 3190, ''),
('Gombás-tejfölös', 'Friss gombával és tejföllel készítve', 1200, 2490, ''),
('Chorizo', 'Spanyol chorizo kolbásszal és fűszeres szósszal', 1550, 2890, '');

-- Példa rendelések - sok teszt adat
-- Pizza ID-k lekérése változókba
SET @margherita_id = (SELECT `id` FROM `pizzas` WHERE `name` = 'Margherita' LIMIT 1);
SET @pepperoni_id = (SELECT `id` FROM `pizzas` WHERE `name` = 'Pepperoni' LIMIT 1);
SET @hawaii_id = (SELECT `id` FROM `pizzas` WHERE `name` = 'Hawaii' LIMIT 1);
SET @negy_sajtos_id = (SELECT `id` FROM `pizzas` WHERE `name` = 'Négy sajtos' LIMIT 1);
SET @bolognese_id = (SELECT `id` FROM `pizzas` WHERE `name` = 'Bolognese' LIMIT 1);
SET @prosciutto_id = (SELECT `id` FROM `pizzas` WHERE `name` = 'Prosciutto' LIMIT 1);
SET @quattro_stagioni_id = (SELECT `id` FROM `pizzas` WHERE `name` = 'Quattro Stagioni' LIMIT 1);
SET @diavola_id = (SELECT `id` FROM `pizzas` WHERE `name` = 'Diavola' LIMIT 1);
SET @capricciosa_id = (SELECT `id` FROM `pizzas` WHERE `name` = 'Capricciosa' LIMIT 1);
SET @funghi_id = (SELECT `id` FROM `pizzas` WHERE `name` = 'Funghi' LIMIT 1);
SET @vegetariana_id = (SELECT `id` FROM `pizzas` WHERE `name` = 'Vegetariana' LIMIT 1);
SET @tonno_id = (SELECT `id` FROM `pizzas` WHERE `name` = 'Tonno' LIMIT 1);
SET @calzone_id = (SELECT `id` FROM `pizzas` WHERE `name` = 'Calzone' LIMIT 1);
SET @bbq_csirke_id = (SELECT `id` FROM `pizzas` WHERE `name` = 'BBQ Csirke' LIMIT 1);
SET @mexikoi_id = (SELECT `id` FROM `pizzas` WHERE `name` = 'Mexikói' LIMIT 1);
SET @gyros_id = (SELECT `id` FROM `pizzas` WHERE `name` = 'Gyros Pizza' LIMIT 1);

-- User ID-k lekérése
SET @teszt_user_id = (SELECT `id` FROM `users` WHERE `email` = 'teszt' LIMIT 1);
SET @kovacs_janos_id = (SELECT `id` FROM `users` WHERE `email` = 'kovacs.janos@email.com' LIMIT 1);
SET @nagy_maria_id = (SELECT `id` FROM `users` WHERE `email` = 'nagy.maria@email.com' LIMIT 1);
SET @szabo_peter_id = (SELECT `id` FROM `users` WHERE `email` = 'szabo.peter@email.com' LIMIT 1);
SET @horvath_anna_id = (SELECT `id` FROM `users` WHERE `email` = 'horvath.anna@email.com' LIMIT 1);
SET @toth_gabor_id = (SELECT `id` FROM `users` WHERE `email` = 'toth.gabor@email.com' LIMIT 1);
SET @varga_eszter_id = (SELECT `id` FROM `users` WHERE `email` = 'varga.eszter@email.com' LIMIT 1);
SET @molnar_david_id = (SELECT `id` FROM `users` WHERE `email` = 'molnar.david@email.com' LIMIT 1);
SET @farkas_zsuzsanna_id = (SELECT `id` FROM `users` WHERE `email` = 'farkas.zsuzsanna@email.com' LIMIT 1);
SET @balogh_laszlo_id = (SELECT `id` FROM `users` WHERE `email` = 'balogh.laszlo@email.com' LIMIT 1);
SET @papp_judit_id = (SELECT `id` FROM `users` WHERE `email` = 'papp.judit@email.com' LIMIT 1);
SET @lakatos_zoltan_id = (SELECT `id` FROM `users` WHERE `email` = 'lakatos.zoltan@email.com' LIMIT 1);
SET @meszaros_katalin_id = (SELECT `id` FROM `users` WHERE `email` = 'meszaros.katalin@email.com' LIMIT 1);
SET @olah_andras_id = (SELECT `id` FROM `users` WHERE `email` = 'olah.andras@email.com' LIMIT 1);
SET @simon_eva_id = (SELECT `id` FROM `users` WHERE `email` = 'simon.eva@email.com' LIMIT 1);
SET @racz_balazs_id = (SELECT `id` FROM `users` WHERE `email` = 'racz.balazs@email.com' LIMIT 1);
SET @fekete_ildiko_id = (SELECT `id` FROM `users` WHERE `email` = 'fekete.ildiko@email.com' LIMIT 1);
SET @szucs_tamas_id = (SELECT `id` FROM `users` WHERE `email` = 'szucs.tamas@email.com' LIMIT 1);
SET @magyar_krisztina_id = (SELECT `id` FROM `users` WHERE `email` = 'magyar.krisztina@email.com' LIMIT 1);
SET @kiraly_robert_id = (SELECT `id` FROM `users` WHERE `email` = 'kiraly.robert@email.com' LIMIT 1);

-- Rendelés 1 - teszt user
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@teszt_user_id, 4480, 'completed');
SET @order1_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order1_id, @margherita_id, 1, 1990),
(@order1_id, @pepperoni_id, 1, 2490);

-- Rendelés 2 - teszt user
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@teszt_user_id, 2290, 'pending');
SET @order2_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order2_id, @hawaii_id, 1, 2290);

-- Rendelés 3 - Kovács János
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@kovacs_janos_id, 4780, 'completed');
SET @order3_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order3_id, @negy_sajtos_id, 1, 2790),
(@order3_id, @hawaii_id, 1, 2290);

-- Rendelés 4 - Nagy Mária
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@nagy_maria_id, 2990, 'completed');
SET @order4_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order4_id, @bolognese_id, 1, 2990);

-- Rendelés 5 - Szabó Péter
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@szabo_peter_id, 6970, 'preparing');
SET @order5_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order5_id, @pepperoni_id, 2, 2490),
(@order5_id, @prosciutto_id, 1, 2690);

-- Rendelés 6 - Horváth Anna
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@horvath_anna_id, 5580, 'completed');
SET @order6_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order6_id, @quattro_stagioni_id, 1, 2890),
(@order6_id, @funghi_id, 1, 2390);

-- Rendelés 7 - Tóth Gábor
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@toth_gabor_id, 2590, 'pending');
SET @order7_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order7_id, @diavola_id, 1, 2590);

-- Rendelés 8 - Varga Eszter
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@varga_eszter_id, 8380, 'completed');
SET @order8_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order8_id, @capricciosa_id, 1, 2790),
(@order8_id, @tonno_id, 1, 2490),
(@order8_id, @vegetariana_id, 1, 2190),
(@order8_id, @margherita_id, 1, 1990);

-- Rendelés 9 - Molnár Dávid
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@molnar_david_id, 3190, 'delivering');
SET @order9_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order9_id, @calzone_id, 1, 3190);

-- Rendelés 10 - Farkas Zsuzsanna
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@farkas_zsuzsanna_id, 2690, 'completed');
SET @order10_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order10_id, @mexikoi_id, 1, 2690);

-- Rendelés 11 - Balogh László
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@balogh_laszlo_id, 4480, 'pending');
SET @order11_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order11_id, @bbq_csirke_id, 1, 2890),
(@order11_id, @hawaii_id, 1, 2290);

-- Rendelés 12 - Papp Judit
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@papp_judit_id, 5980, 'preparing');
SET @order12_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order12_id, @gyros_id, 2, 2990);

-- Rendelés 13 - Lakatos Zoltán
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@lakatos_zoltan_id, 11970, 'completed');
SET @order13_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order13_id, @margherita_id, 2, 1990),
(@order13_id, @pepperoni_id, 1, 2490),
(@order13_id, @negy_sajtos_id, 1, 2790),
(@order13_id, @bolognese_id, 1, 2990),
(@order13_id, @hawaii_id, 1, 2290);

-- Rendelés 14 - Mészáros Katalin
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@meszaros_katalin_id, 2790, 'completed');
SET @order14_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order14_id, @capricciosa_id, 1, 2790);

-- Rendelés 15 - Oláh András
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@olah_andras_id, 4890, 'delivering');
SET @order15_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order15_id, @prosciutto_id, 1, 2690),
(@order15_id, @funghi_id, 1, 2390);

-- Rendelés 16 - Simon Éva
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@simon_eva_id, 2390, 'pending');
SET @order16_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order16_id, @vegetariana_id, 1, 2190),
(@order16_id, @margherita_id, 1, 1990);

-- Rendelés 17 - Rácz Balázs
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@racz_balazs_id, 9880, 'preparing');
SET @order17_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order17_id, @quattro_stagioni_id, 1, 2890),
(@order17_id, @diavola_id, 1, 2590),
(@order17_id, @tonno_id, 1, 2490),
(@order17_id, @pepperoni_id, 1, 2490);

-- Rendelés 18 - Fekete Ildikó
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@fekete_ildiko_id, 5280, 'completed');
SET @order18_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order18_id, @calzone_id, 1, 3190),
(@order18_id, @margherita_id, 1, 1990);

-- Rendelés 19 - Szűcs Tamás
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@szucs_tamas_id, 2690, 'completed');
SET @order19_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order19_id, @mexikoi_id, 1, 2690);

-- Rendelés 20 - Magyar Krisztina
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@magyar_krisztina_id, 14950, 'pending');
SET @order20_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order20_id, @gyros_id, 3, 2990),
(@order20_id, @bbq_csirke_id, 2, 2890),
(@order20_id, @hawaii_id, 1, 2290);

-- Rendelés 21 - Király Róbert
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@kiraly_robert_id, 2490, 'preparing');
SET @order21_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order21_id, @tonno_id, 1, 2490);

-- Rendelés 22 - teszt user újabb rendelés
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@teszt_user_id, 6970, 'delivering');
SET @order22_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order22_id, @bolognese_id, 1, 2990),
(@order22_id, @negy_sajtos_id, 1, 2790),
(@order22_id, @margherita_id, 1, 1990);

-- Rendelés 23 - Kovács János második rendelés
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@kovacs_janos_id, 2190, 'completed');
SET @order23_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order23_id, @vegetariana_id, 1, 2190);

-- Rendelés 24 - Nagy Mária második rendelés
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@nagy_maria_id, 5180, 'pending');
SET @order24_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order24_id, @prosciutto_id, 1, 2690),
(@order24_id, @funghi_id, 1, 2390);

-- Rendelés 25 - Szabó Péter második rendelés
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@szabo_peter_id, 4490, 'completed');
SET @order25_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order25_id, @capricciosa_id, 1, 2790),
(@order25_id, @hawaii_id, 1, 2290);

-- Rendelés 26 - Horváth Anna második rendelés
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@horvath_anna_id, 2590, 'preparing');
SET @order26_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order26_id, @diavola_id, 1, 2590);

-- Rendelés 27 - Tóth Gábor második rendelés
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@toth_gabor_id, 7780, 'delivering');
SET @order27_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order27_id, @calzone_id, 1, 3190),
(@order27_id, @quattro_stagioni_id, 1, 2890),
(@order27_id, @pepperoni_id, 1, 2490);

-- Rendelés 28 - Varga Eszter második rendelés
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@varga_eszter_id, 4980, 'completed');
SET @order28_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order28_id, @bbq_csirke_id, 1, 2890),
(@order28_id, @mexikoi_id, 1, 2690);

-- Rendelés 29 - Molnár Dávid második rendelés
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@molnar_david_id, 5980, 'pending');
SET @order29_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order29_id, @gyros_id, 2, 2990);

-- Rendelés 30 - Farkas Zsuzsanna második rendelés
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@farkas_zsuzsanna_id, 13970, 'completed');
SET @order30_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order30_id, @margherita_id, 3, 1990),
(@order30_id, @pepperoni_id, 2, 2490),
(@order30_id, @negy_sajtos_id, 1, 2790),
(@order30_id, @bolognese_id, 1, 2990);

-- Rendelés 31 - Balogh László második rendelés
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@balogh_laszlo_id, 2390, 'preparing');
SET @order31_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order31_id, @funghi_id, 1, 2390);

-- Rendelés 32 - Papp Judit második rendelés
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@papp_judit_id, 4690, 'delivering');
SET @order32_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order32_id, @prosciutto_id, 1, 2690),
(@order32_id, @margherita_id, 1, 1990);

-- Rendelés 33 - Lakatos Zoltán második rendelés
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@lakatos_zoltan_id, 2490, 'completed');
SET @order33_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order33_id, @tonno_id, 1, 2490);

-- Rendelés 34 - Mészáros Katalin második rendelés
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@meszaros_katalin_id, 10880, 'pending');
SET @order34_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order34_id, @vegetariana_id, 2, 2190),
(@order34_id, @capricciosa_id, 1, 2790),
(@order34_id, @quattro_stagioni_id, 1, 2890),
(@order34_id, @diavola_id, 1, 2590);

-- Rendelés 35 - Oláh András második rendelés
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@olah_andras_id, 3190, 'completed');
SET @order35_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order35_id, @calzone_id, 1, 3190);

-- Rendelés 36 - Simon Éva második rendelés
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@simon_eva_id, 7970, 'preparing');
SET @order36_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order36_id, @bbq_csirke_id, 1, 2890),
(@order36_id, @mexikoi_id, 1, 2690),
(@order36_id, @pepperoni_id, 1, 2490);

-- Rendelés 37 - Rácz Balázs második rendelés
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@racz_balazs_id, 2990, 'delivering');
SET @order37_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order37_id, @gyros_id, 1, 2990);

-- Rendelés 38 - Fekete Ildikó második rendelés
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@fekete_ildiko_id, 5580, 'completed');
SET @order38_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order38_id, @hawaii_id, 2, 2290),
(@order38_id, @margherita_id, 1, 1990);

-- Rendelés 39 - Szűcs Tamás második rendelés
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@szucs_tamas_id, 9880, 'pending');
SET @order39_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order39_id, @negy_sajtos_id, 1, 2790),
(@order39_id, @bolognese_id, 1, 2990),
(@order39_id, @funghi_id, 1, 2390),
(@order39_id, @prosciutto_id, 1, 2690);

-- Rendelés 40 - Magyar Krisztina második rendelés
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@magyar_krisztina_id, 2190, 'completed');
SET @order40_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order40_id, @vegetariana_id, 1, 2190);

-- Rendelés 41 - teszt user harmadik rendelés
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@teszt_user_id, 2690, 'preparing');
SET @order41_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order41_id, @mexikoi_id, 1, 2690);

-- Rendelés 42 - Kovács János harmadik rendelés
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@kovacs_janos_id, 8970, 'delivering');
SET @order42_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order42_id, @calzone_id, 1, 3190),
(@order42_id, @gyros_id, 1, 2990),
(@order42_id, @bbq_csirke_id, 1, 2890);

-- Rendelés 43 - Nagy Mária harmadik rendelés
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@nagy_maria_id, 2790, 'completed');
SET @order43_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order43_id, @capricciosa_id, 1, 2790);

-- Rendelés 44 - Szabó Péter harmadik rendelés
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@szabo_peter_id, 2590, 'pending');
SET @order44_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order44_id, @diavola_id, 1, 2590);

-- Rendelés 45 - Horváth Anna harmadik rendelés
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@horvath_anna_id, 11470, 'preparing');
SET @order45_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order45_id, @quattro_stagioni_id, 1, 2890),
(@order45_id, @tonno_id, 1, 2490),
(@order45_id, @pepperoni_id, 1, 2490),
(@order45_id, @funghi_id, 1, 2390),
(@order45_id, @vegetariana_id, 1, 2190);

-- Rendelés 46 - Tóth Gábor harmadik rendelés
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@toth_gabor_id, 2490, 'delivering');
SET @order46_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order46_id, @tonno_id, 1, 2490);

-- Rendelés 47 - Varga Eszter harmadik rendelés
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@varga_eszter_id, 4790, 'completed');
SET @order47_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order47_id, @prosciutto_id, 1, 2690),
(@order47_id, @hawaii_id, 1, 2290);

-- Rendelés 48 - Molnár Dávid harmadik rendelés
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@molnar_david_id, 5980, 'pending');
SET @order48_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order48_id, @gyros_id, 2, 2990);

-- Rendelés 49 - Farkas Zsuzsanna harmadik rendelés
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@farkas_zsuzsanna_id, 1990, 'completed');
SET @order49_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order49_id, @margherita_id, 1, 1990);

-- Rendelés 50 - Balogh László harmadik rendelés
INSERT INTO `orders` (`user_id`, `total`, `status`) VALUES (@balogh_laszlo_id, 7270, 'preparing');
SET @order50_id = LAST_INSERT_ID();
INSERT INTO `order_items` (`order_id`, `pizza_id`, `quantity`, `price`) VALUES
(@order50_id, @negy_sajtos_id, 1, 2790),
(@order50_id, @bolognese_id, 1, 2990),
(@order50_id, @margherita_id, 1, 1990);

-- ============================================
-- Véglegesítés
-- ============================================
-- Változók törlése
SET @teszt_user_id = NULL;
SET @kovacs_janos_id = NULL;
SET @nagy_maria_id = NULL;
SET @szabo_peter_id = NULL;
SET @horvath_anna_id = NULL;
SET @toth_gabor_id = NULL;
SET @varga_eszter_id = NULL;
SET @molnar_david_id = NULL;
SET @farkas_zsuzsanna_id = NULL;
SET @balogh_laszlo_id = NULL;
SET @papp_judit_id = NULL;
SET @lakatos_zoltan_id = NULL;
SET @meszaros_katalin_id = NULL;
SET @olah_andras_id = NULL;
SET @simon_eva_id = NULL;
SET @racz_balazs_id = NULL;
SET @fekete_ildiko_id = NULL;
SET @szucs_tamas_id = NULL;
SET @magyar_krisztina_id = NULL;
SET @kiraly_robert_id = NULL;
SET @margherita_id = NULL;
SET @pepperoni_id = NULL;
SET @hawaii_id = NULL;
SET @negy_sajtos_id = NULL;
SET @bolognese_id = NULL;
SET @prosciutto_id = NULL;
SET @quattro_stagioni_id = NULL;
SET @diavola_id = NULL;
SET @capricciosa_id = NULL;
SET @funghi_id = NULL;
SET @vegetariana_id = NULL;
SET @tonno_id = NULL;
SET @calzone_id = NULL;
SET @bbq_csirke_id = NULL;
SET @mexikoi_id = NULL;
SET @gyros_id = NULL;
SET @order1_id = NULL;
SET @order2_id = NULL;
SET @order3_id = NULL;
SET @order4_id = NULL;
SET @order5_id = NULL;
SET @order6_id = NULL;
SET @order7_id = NULL;
SET @order8_id = NULL;
SET @order9_id = NULL;
SET @order10_id = NULL;
SET @order11_id = NULL;
SET @order12_id = NULL;
SET @order13_id = NULL;
SET @order14_id = NULL;
SET @order15_id = NULL;
SET @order16_id = NULL;
SET @order17_id = NULL;
SET @order18_id = NULL;
SET @order19_id = NULL;
SET @order20_id = NULL;
SET @order21_id = NULL;
SET @order22_id = NULL;
SET @order23_id = NULL;
SET @order24_id = NULL;
SET @order25_id = NULL;
SET @order26_id = NULL;
SET @order27_id = NULL;
SET @order28_id = NULL;
SET @order29_id = NULL;
SET @order30_id = NULL;
SET @order31_id = NULL;
SET @order32_id = NULL;
SET @order33_id = NULL;
SET @order34_id = NULL;
SET @order35_id = NULL;
SET @order36_id = NULL;
SET @order37_id = NULL;
SET @order38_id = NULL;
SET @order39_id = NULL;
SET @order40_id = NULL;
SET @order41_id = NULL;
SET @order42_id = NULL;
SET @order43_id = NULL;
SET @order44_id = NULL;
SET @order45_id = NULL;
SET @order46_id = NULL;
SET @order47_id = NULL;
SET @order48_id = NULL;
SET @order49_id = NULL;
SET @order50_id = NULL;

