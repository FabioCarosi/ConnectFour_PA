
CREATE DATABASE IF NOT EXISTS connectfour;

USE connectfour;

DROP TABLE IF EXISTS user;
CREATE TABLE user (
  email varchar(50) NOT NULL,
  credit decimal(5,2) NOT NULL,
  role varchar(50) NOT NULL,
  PRIMARY KEY (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS game;
CREATE TABLE game (
  id_game bigint unsigned NOT NULL AUTO_INCREMENT,
  playerOne varchar(50) NOT NULL,
  playerTwo varchar(50) NOT NULL,
  status varchar(50) NOT NULL DEFAULT 'Created',
  startTime timestamp NOT NULL DEFAULT current_timestamp(),
  winner varchar(50) DEFAULT 'No Winner',
  turn varchar(50) NOT NULL DEFAULT 'Current Player',
  difficulty varchar(10) DEFAULT 'medium',
  leaveState varchar(50) DEFAULT 'In Progress',
  PRIMARY KEY (id_game)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS move;
CREATE TABLE move (
  id_move bigint NOT NULL AUTO_INCREMENT,
  id_game bigint NOT NULL,
  email varchar(50) NOT NULL,
  column_move tinyint(1) NOT NULL,
  timestamp_move timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id_move)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO user (email, credit, role) VALUES
('admin@email.com',	100,	'admin'),
('ai',	100,	'ai'),
('player1@email.com',	100, 'player'),
('player2@email.com',	100, 'player'),
('player3@email.com', 100, 'player'),
('player4@email.com', 100, 'player'),
('fabio@email.com', 100, 'admin'),
('cristina@email.com', 100, 'admin'),
('adriano@email.com',100, 'admin'),
('luca@email.com', 100, 'admin'),
('playerNoCredit@email.com', 0.25 , 'player');


INSERT INTO game (id_game, playerOne, playerTwo, status, startTime, winner, turn, difficulty, leaveState) VALUES
(1,	'player1@email.com',	'player2@email.com',	'In Progress',	'2022-09-04 09:14:08',	'No Winner',	'player1@email.com',	'medium',	'In Progress'),
(2,	'player3@email.com',	'ai',	'In Progress',	'2022-09-04 09:15:45',	'No Winner',	'player3@email.com',	'medium',	'In Progress'),
(3,	'adriano@email.com',	'luca@email.com',	'In Progress',	'2022-09-04 09:16:31',	'No Winner',	'adriano@email.com',	'medium',	'In Progress'),
(4,	'fabio@email.com',	'cristina@email.com',	'Game Abandoned',	'2022-09-04 09:18:27',	'Draw',	'fabio@email.com',	'medium',	'Game Abandoned');
