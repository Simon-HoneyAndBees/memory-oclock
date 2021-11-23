# Memory oclock

## 1. Création de la base de données

1. CREATE DATABASE `memory` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */;
2. CREATE TABLE `score` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` text,
  `seconds` int unsigned DEFAULT '0',
  `click` int unsigned DEFAULT '0',
  `dategame` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

## 2. Changement de la connexion

Dans le fichier /api/routes.php, changez les valeurs de la ligne : $c = new ConnectMemory("server", "user", "password", "memory");

1. "server" est votre serveur base de données
2. "user" est votre utilisateur
3. "password" est votre mot de passe