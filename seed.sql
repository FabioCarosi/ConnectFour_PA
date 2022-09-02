
CREATE DATABASE IF NOT EXISTS connectfour;

USE connectfour;

DROP TABLE IF EXISTS game;
DROP TABLE IF EXISTS move;
DROP TABLE IF EXISTS user;

CREATE TABLE game (
  id_game bigint(20) UNSIGNED NOT NULL,
  playerOne varchar(50) NOT NULL,
  playerTwo varchar(50) NOT NULL,
  status varchar(10) NOT NULL,
  startTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  winner varchar(50) DEFAULT NULL,
  turn tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE move (
  id_move bigint(20) UNSIGNED NOT NULL,
  id_game int(11) NOT NULL,
  email_user varchar(50) NOT NULL,
  timestamp_move timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



CREATE TABLE user (
  email varchar(50) NOT NULL,
  credit int(11) NOT NULL,
  role varchar(50) NOT NULL,
  name varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



INSERT INTO user (email, credit, role, name) VALUES
('admin@email.com', 100, 'admin', 'Admin'),
('ai', 100, 'ai', 'AI'),
('player1@email.com', 100, 'player', 'Cristina'),
('player2@email.com', 100, 'player', 'Fabio');


--
ALTER TABLE game
  ADD PRIMARY KEY (id_game);


ALTER TABLE move
  ADD PRIMARY KEY (id_move);


ALTER TABLE user
  ADD PRIMARY KEY (email);




ALTER TABLE game
  MODIFY id_game bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;


ALTER TABLE move
  MODIFY id_move bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;