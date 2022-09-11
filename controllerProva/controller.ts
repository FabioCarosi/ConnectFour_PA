const { Connect4AI } = require("../node_modules/connect4-ai/index");
const { Connect4 } = require("../node_modules/connect4-ai/index");
const { seq } = require("sequelize");

import * as fs from "fs";
import * as GameClass from "../models/game";
import * as MoveClass from "../models/move";
import * as UserClass from "../models/user";

//rotta per creare una partita

export async function startGame(req: any, res: any): Promise<void> {
  console.log("Now");
  let newGame;
  req.body.playerOne = req.user.email;
  let lessCredit = 0.35;

  try {
    await GameClass.Game.create(req.body).then((game: any) => {
      console.log("Game has started");
      //aggiorna credito playerOne
      UserClass.updateCredit(req.user.email, lessCredit);

      if (game.playerTwo === "ai") {
        newGame = new Connect4AI();
      } else {
        newGame = new Connect4();
      }
      res.send(newGame.ascii());
    });
  } catch (err) {
    res.send("An error has occurred ...");
  }
}

export async function makeMove(req: any, res: any) {
  req.body.email = req.user.email;
  //create move on database
  try {
    const savedMoves = await MoveClass.findMovesbyGame(req.body.id_game); //find all the moves of the game
    if (savedMoves.length !== 0) {
      //if there are moves
      const bool = await MoveClass.checkLastHourMoves(req); //then check if there are moves in the last hour
      if (bool) {
        res.send("Game Over: You are out of time!");
        return;
      } //if there is not moves in the last hour the player is out of time
    }
    const userMove = await MoveClass.Move.create(req.body);
    const moveArr: number[] = [];

    //find all moves corrisponding to id_game of current game
    await MoveClass.findMovesbyGame(req.body.id_game).then(
      (movesByGame: any) => {
        movesByGame.forEach((el) => moveArr.push(el.column_move));
        console.log("Set of all moves: ", moveArr); //array of moves (columns) in the game

        //find playerTwo in the game to select IA or UserVSUser mode
        UserClass.findPlayerTwoByGame(req.body.id_game).then(
          (playerTwo: any) => {
            console.log("You are playing against: ", playerTwo); //email of the second user

            let newGame = new Connect4AI();

            moveArr.forEach((el) => {
              newGame.play(el);
            });

            console.log(newGame.ascii());
            console.log(newGame.gameStatus());

            //select UserVSUser or AI mode
            if (playerTwo === "ai") {
              console.log("parte l'if");
              //get difficulty inserted by user
              GameClass.getDifficulty(req.body.id_game).then((diff: any) => {
                console.log("Difficulty of game:", diff.difficulty);

                const play = newGame.playAI(diff.difficulty); //ai plays
                console.log("Ai has played column: ", play);
                console.log(newGame.ascii());
                console.log(newGame.gameStatus());

                //create AI move in db if game is not over
                if (!newGame.gameStatus().gameOver) {
                  MoveClass.Move.create({
                    id_game: req.body.id_game,
                    email: "ai",
                    column_move: play,
                  });
                }
              });
            }
            res.send(newGame.ascii());
            if (newGame.gameStatus().gameOver) {
              GameClass.updateGameOver(req.body.id_game, "GameOver");
              GameClass.updateWinnerByNumber(
                req.body.id_game,
                newGame.gameStatus().winner
              );
            }
          }
        );
      }
    );
  } catch (err) {
    res.send("An error has occurred...");
  }
  //mossa = n colonna
}

export async function viewGamesByUser(req: any, res: any) {
  const userReq = req.user.email;
  let totalGames: any = [];

  if (req.query.take === "between") {
    //localhost:8080/viewGamesByUser?take=between&dateOne=2020-09-08&dateTwo=2022-09-10
    totalGames = await GameClass.getGameByDateBetween(
      userReq,
      req.query.dateOne,
      req.query.dateTwo
    );
  } else if (req.query.take === "greaterThan") {
    //localhost:8080/viewGamesByUser?take=greaterThan&date=2020-09-08
    console.log(req.query.date);
    totalGames = await GameClass.getGameByDateGraterThan(
      userReq,
      req.query.date
    );
  } else if (req.query.take === "lessThan") {
    //localhost:8080/viewGamesByUser?take=lessThan&date=2020-09-08
    totalGames = await GameClass.getGameByDateLessThan(userReq, req.query.date);
  }
  //totalGames diventa il vettore di tutte le partite svolte dall'userReq
  let gamesFiltered: any = []; //vettore con le partite presentate con gli attributi che vogliamo visualizzare

  for (const el of totalGames) {
    //per ogni partita dell'utente, vedi il vincitore, la modalità, il numero di mosse e la data di avvio
    //vedi se l'utente ha vinto la partita
    let hasWon: string;
    if (el.winner === userReq) {
      hasWon = "Yes";
    } else {
      if (el.winner === "Draw") {
        hasWon = "Draw";
      } else {
        hasWon = "No";
      }
    }

    //vedi la modalità di gioco
    let gameModality: string;
    if (el.playerTwo === "ai") {
      gameModality = "Versus AI";
    } else {
      gameModality = "User VS User";
    }

    //conta il numero di mosse
    const numMoves = await MoveClass.findMovesbyGame(el.id_game).then(
      (allMoves: any) => {
        return allMoves.length;
      }
    );

    const body = {
      id_game: el.id_game,
      won: hasWon,
      modality: gameModality,
      numberOfMoves: numMoves,
      date: el.startTime,
    };
    gamesFiltered.push(body);
  }

  res.send(gamesFiltered);
}

export async function leaveGame(req: any, res: any) {
  GameClass.leaveMatch(req, res);
}

export async function stateGame(req: any, res: any) {
  let moveArr: number[] = [];
  console.log(req.body.id_game);
  console.log(typeof req.body.id_game);

  //find all moves corrisponding to id_game of current game
  const movesByGame: any = await MoveClass.findMovesbyGame(req.body.id_game);

  if (movesByGame.length !== 0) {
    //if there are moves
    const bool = await MoveClass.checkLastHourMoves(req); //then check if there are moves in the last hour
    if (bool) {
      res.send("Game Over: You are out of time!");
      return;
    } //if there is not moves in the last hour the player is out of time
  }

  movesByGame.forEach((el) => moveArr.push(el.column_move));
  console.log("Set of all moves: ", moveArr); //array of moves (columns) in the game

  let newGame = new Connect4AI();

  moveArr.forEach((el) => {
    newGame.play(el);
  });

  const table = newGame.ascii();

  GameClass.getGame(req.body.id_game).then((game: any) => {
    res.send(
      table +
        "\n\n Turn: " +
        game.turn +
        "\n Status: " +
        game.status +
        "\n Winner: " +
        game.winner +
        "\n Draw request: " +
        game.leaveState
    );
  });
}

export async function dateLastMove(req: any) {
  return MoveClass.checkLastHourMoves(req);
}

export async function chargeCredit(req: any, res: any) {
  const newCredit = req.body.newCredit;
  const emailUser = req.body.email;
  await UserClass.updateCredit(emailUser, -newCredit);
  res.send("Credit has been updated");
}
/*
export async function getMovesList(req: any, res: any) {
  let list: string = "All Moves of match: " + req.body.id_game;

  let fileString = "";
  let separator = ",";
  let fileType = "csv";
  let file = `moves.${fileType}`;

  MoveClass.findMovesbyGame(req.body.id_game).then((moves) => {
    moves.forEach((move: any) => {
      Object.keys(move[0]).forEach((value) => {
        fileString = fileString + `${value}${separator}`;
        console.log("Then: " + value);
        console.log(fileString);
      });
      fileString = fileString.slice(0, -1);
      fileString += "\n";

      move.forEach((transaction) => {
        console.log(transaction);
        Object.values(transaction).forEach((value) => {
          fileString += `${value}${separator}`;
          console.log("Transaction: " + value);
        });
        fileString = fileString.slice(0, -1);
        fileString += "\n";
      });
    });
    res.send(list);
  });

  fs.writeFileSync(file, fileString, "utf8");
}
*/
export async function getMovesList(req: any, res: any) {
  let stringMove;
  let cont = 0;
  let separator = ",";
  let list: string = "All Moves of match n. " + req.body.id_game;

  const moves = await MoveClass.findMovesbyGame(req.body.id_game);
  if (req.body.format === "csv") {
    const head = "Player" + separator + "Move" + separator + "Time \n";
    fs.writeFileSync("moves.csv", head);
  }
  moves.forEach((move: any) => {
    if (req.body.format === "json") {
      stringMove = JSON.stringify(move) + ", \n";
      fs.appendFileSync("moves.json", stringMove);
    } else if (req.body.format === "csv") {
      stringMove =
        move.email +
        separator +
        move.column_move +
        separator +
        move.timestamp_move +
        "\n";
      fs.appendFileSync("moves.csv", stringMove);
    }

    fs.appendFileSync("moves.txt", stringMove);
    cont = cont + 1;
    let out =
      "\n" +
      cont +
      ")" +
      move.email +
      separator +
      move.column_move +
      separator +
      move.timestamp_move;
    list = list + out;
  });
  res.send(list);
}
