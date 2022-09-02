
CREATE DATABASE IF NOT EXISTS connectfour;

USE connectfour;

DROP TABLE IF EXISTS `game`;
CREATE TABLE `game` (
  `id_game` bigint unsigned NOT NULL AUTO_INCREMENT,
  `playerOne` varchar(50) NOT NULL,
  `playerTwo` varchar(50) NOT NULL,
  `status` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `startTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `winner` varchar(50) DEFAULT NULL,
  `turn` tinyint(1) NOT NULL,
  PRIMARY KEY (`id_game`),
  KEY `playerOne` (`playerOne`),
  KEY `playerTwo` (`playerTwo`),
  CONSTRAINT `game_ibfk_1` FOREIGN KEY (`playerOne`) REFERENCES `user` (`email`),
  CONSTRAINT `game_ibfk_2` FOREIGN KEY (`playerTwo`) REFERENCES `user` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `move`;
CREATE TABLE `move` (
  `id_move` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_game` bigint unsigned NOT NULL,
  `email_user` varchar(50) NOT NULL,
  `timestamp_move` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_move`),
  KEY `id_game` (`id_game`),
  KEY `email_user` (`email_user`),
  CONSTRAINT `move_ibfk_1` FOREIGN KEY (`id_game`) REFERENCES `game` (`id_game`) ON DELETE CASCADE,
  CONSTRAINT `move_ibfk_2` FOREIGN KEY (`email_user`) REFERENCES `user` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `email` varchar(50) NOT NULL,
  `credit` int NOT NULL,
  `role` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `user` (`email`, `credit`, `role`, `name`) VALUES
('admin@email.com',	100,	'admin',	'Admin'),
('ai',	100,	'ai',	'AI'),
('player1@email.com',	100,	'player',	'Cristina'),
('player2@email.com',	100,	'player',	'Fabio');