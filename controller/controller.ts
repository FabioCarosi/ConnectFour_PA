const { Connect4AI } = require("connect4-ai");

import * as fs from "fs";
import { ErrEnum } from "../Factory/ErrorFactory";
import { SuccEnum } from "../Factory/SuccessFactory";
import * as GameClass from "../models/game";
import * as MoveClass from "../models/move";
import * as UserClass from "../models/user";
import { controllerErrorHandler } from "./controllerErrorHandler";
import { controllerSuccessMsg } from "./controllerSuccessMessage";

/*Function startGame allows to create a new Game 
  In request's body the user sends the email of the opponent player
  If errors don't occurr, then an item Game is created in DB with all necessary informations
*/
export async function startGame(req: any, res: any): Promise<void> {
  try {
    req.body.playerOne = req.user.email; //playerOne in body's request is instantiated with the user's email in JWT payload
    let lessCredit = 0.35; //amount of credity that will be decreased to playerOne
    /*
    Here, a new Game istance is created in DB
    */
    await GameClass.Game.create(req.body).then((game: any) => {
      console.log("Game has started"); //successFactory
      //update PlayerOne's credit
      UserClass.updateCredit(req.user.email, lessCredit);
      //successFactory --> credit has been successfully updated

      const msg: string = controllerSuccessMsg(SuccEnum.SuccessNewGame, res);
      res.send(
        msg +
          "\n" +
          "Game ID: " +
          game.id_game +
          "\n" +
          "You are playing against " +
          game.playerTwo
      );
    });
  } catch (err) {
    controllerErrorHandler(ErrEnum.GenericError, res);
  }
}

/*
  Function makeMove allows the user to make a move
  In request's body the user sends the id of game in which he's currently playing
  If errors don't occurr, then an item Move is created in DB with all necessary informations
*/
export async function makeMove(req: any, res: any) {
  try {
    req.body.email = req.user.email; //email in body's request is instantiated with the user's email in JWT payload

    const moveArr: number[] = []; //array where moves found in DB will be pushed

    //Find all moves corrisponding to id_game of current game
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

    //Find playerTwo in the game to select IA or UserVSUser mode
    const playerTwo: string = await UserClass.findPlayerTwoByGame(
      req.body.id_game
    );

    let newGame = new Connect4AI();

    moveArr.forEach((el) => {
      newGame.play(el);
    });

    //check if move in column_move is valid or not before saving it in DB
    try {
      newGame.play(req.body.column_move);
      await MoveClass.Move.create(req.body); //create and save the move in DB
    } catch (error) {
      controllerErrorHandler(ErrEnum.ErrInvalidMove, res); //move is not valid
      return;
    }
    console.log(newGame.ascii());
    console.log(newGame.gameStatus());

    //select UserVSUser or AI mode
    if (playerTwo === "ai") {
      //get difficulty inserted by user
      const difficulty: string = await GameClass.getDifficulty(
        req.body.id_game
      );

      //create AI move in db if game is not over
      if (!newGame.gameStatus().gameOver) {
        const play: any = newGame.playAI(difficulty); //ai plays
        console.log("Ai has played column: ", play);
        console.log(newGame.ascii());
        console.log(newGame.gameStatus());
        await MoveClass.Move.create({
          id_game: req.body.id_game,
          email: "ai",
          column_move: play,
        });
      }
    }

    const msg: string = controllerSuccessMsg(SuccEnum.SuccessNewMove, res);

    if (newGame.gameStatus().gameOver) {
      await GameClass.updateGameOver(req.body.id_game, "GameOver");
      const winner: string = await GameClass.updateWinnerByNumber(
        req.body.id_game,
        newGame.gameStatus().winner
      );
      res.send(
        msg + "\n Game is over \n Winner is: " + winner + "\n" + newGame.ascii()
      );
      return;
    }

    res.send(msg + "\n" + newGame.ascii());
  } catch (err) {
    controllerErrorHandler(err, res);
  }
}

/*
  Function viewGamesByUser allows to see all games played by an user
  In the url, the user specifies whether he wants to view games 
  in a given range, or from a certain date on, or before a certain date.
  If errors don't occurr, then a JSON with all informations about games is shown in response's body
*/
export async function viewGamesByUser(req: any, res: any) {
  try {
    const userReq = req.user.email;
    let totalGames: any = []; //array where games found in DB will be pushed

    if (req.query.take === "between") {
      //user wants a range of dates
      //localhost:8080/viewGamesByUser?take=between&dateOne=2020-09-08&dateTwo=2022-09-10
      totalGames = await GameClass.getGameByDateBetween(
        userReq,
        req.query.dateOne,
        req.query.dateTwo
      );
    } else if (req.query.take === "greaterThan") {
      //user wants games from a certain date on
      //localhost:8080/viewGamesByUser?take=greaterThan&date=2020-09-08
      console.log(req.query.date);
      totalGames = await GameClass.getGameByDateGraterThan(
        userReq,
        req.query.date
      );
    } else if (req.query.take === "lessThan") {
      //user wants games before a certain date
      //localhost:8080/viewGamesByUser?take=lessThan&date=2020-09-08
      totalGames = await GameClass.getGameByDateLessThan(
        userReq,
        req.query.date
      );
    }
    //totalGames is now the array with all games played by the user
    let gamesFiltered: any = []; //array where all necessary informations will be pushed

    for (const el of totalGames) {
      //for every game of the user, take the winner, the modality, the number of moves e the start date
      let hasWon: string; //see if user has won the game
      if (el.winner === userReq) {
        hasWon = "Yes";
      } else {
        if (el.winner === "Draw") {
          hasWon = "Draw";
        } else {
          hasWon = "No";
        }
      }

      //see game's modality
      let gameModality: string;
      if (el.playerTwo === "ai") {
        gameModality = "Versus AI";
      } else {
        gameModality = "User VS User";
      }

      //count number of moves
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
    const msg: string = controllerSuccessMsg(
      SuccEnum.SuccessViewGamesByUser,
      res
    );
    console.log(gamesFiltered);
    res.send(gamesFiltered);
  } catch (err) {
    controllerErrorHandler(ErrEnum.GenericError, res);
  }
}
/*
Function to leave the game. 
Saves the first request to leave the game and when the other player sends the same request, the game stops.
*/
export async function leaveGame(req: any, res: any) {
  try {
    await GameClass.leaveMatch(req, res);
  } catch (err) {
    controllerErrorHandler(err, res);
  }
}

//Function to view the status of a game
export async function stateGame(req: any, res: any) {
  try {
    let moveArr: number[] = [];
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

    const table = newGame.ascii(); //table of game
    const msg: string = controllerSuccessMsg(
      SuccEnum.SuccessViewStateGame,
      res
    );
    await GameClass.getGame(req.body.id_game).then((game: any) => {
      //get the informations of game
      res.send(
        msg +
          "\n" +
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
  } catch (err) {
    controllerErrorHandler(err, res);
  }
}

//Charge the credit of selected player - only from admin
export async function chargeCredit(req: any, res: any) {
  try {
    const newCredit = req.body.newCredit;
    const emailUser = req.body.email;
    await UserClass.updateCredit(emailUser, -newCredit);
    const msg: string = controllerSuccessMsg(
      SuccEnum.SuccessCreditUpdated,
      res
    );
    res.send(msg);
  } catch (err) {
    controllerErrorHandler(err, res);
  }
}

//Function to view the list of moves and export them in CSV or JSON format.
export async function getMovesList(req: any, res: any) {
  try {
    let stringMove;
    let separator = ",";
    fs.writeFileSync("moves.json", "");
    const moves = await MoveClass.findMovesbyGame(req.body.id_game); //get all moves from DB
    if (req.body.format === "csv") {
      //if selected format is CSV prepare the header of file
      separator = req.body.separator;
      const sepHead = "sep = " + separator + "\n";
      const head = "Player" + separator + "Move" + separator + "Time \n";
      fs.writeFileSync("moves.csv", sepHead);
      fs.appendFileSync("moves.csv", head);
    }
    moves.forEach((move: any) => {
      if (req.body.format === "csv") {
        stringMove = //prepare the correct format to CSV
          move.email +
          separator +
          move.column_move +
          separator +
          move.timestamp_move +
          "\n";
        fs.appendFileSync("moves.csv", stringMove); //add a row for each iteration
      }
    });
    if (req.body.format === "json") {
      stringMove = JSON.stringify(moves); //stringify the JSON to write it in the file
      fs.appendFileSync("moves.json", stringMove); //add a move for each iteration
    }
  } catch (err) {
    controllerErrorHandler(err, res);
  }
}
