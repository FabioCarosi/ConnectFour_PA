
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
  leaveState varchar(50) DEFAULT 'In progress',
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


