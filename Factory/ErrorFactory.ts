import { Message } from "./MessageInterface";
const { StatusCode } = require("status-code-enum");

class GenericError implements Message {
  getMsg(): { msgString: string; msgStatus: number } {
    return {
      msgStatus: StatusCode.ClientErrorBadRequest, //400
      msgString: "An error has occurred ...",
    };
  }
}
class NoAuthHeader implements Message {
  getMsg(): { msgString: string; msgStatus: number } {
    return {
      msgStatus: StatusCode.ClientErrorBadRequest, //400
      //If there's no auth header, the client error is due to an invalid request
      msgString: "There's no auth header",
    };
  }
}

class ErrToken implements Message {
  getMsg(): { msgString: string; msgStatus: number } {
    return {
      msgStatus: StatusCode.ClientErrorForbidden, //403
      msgString: "JWT token is invalid",
    };
  }
}

class ErrKeyToken implements Message {
  getMsg(): { msgString: string; msgStatus: number } {
    return {
      msgStatus: StatusCode.ClientErrorForbidden, //403
      msgString: "Key is invalid",
    };
  }
}

class BadFormatPayload implements Message {
  getMsg(): { msgString: string; msgStatus: number } {
    return {
      msgStatus: StatusCode.ClientErrorBadRequest, //400
      //If the payload has bad format, the request is incorrect and server can't understand it
      msgString: "Payload has bad format",
    };
  }
}

//for authAdmin, checkAuthMove
class NoAuth implements Message {
  getMsg(): { msgString: string; msgStatus: number } {
    return {
      msgStatus: StatusCode.ClientErrorUnauthorized, //401
      //The user request is valid and correct, but credentials don't allow the user to access at a content
      msgString: "You are not authorized to access at this content",
    };
  }
}

class ErrExistingGame implements Message {
  getMsg(): { msgString: string; msgStatus: number } {
    return {
      msgStatus: StatusCode.ClientErrorConflict, //409
      //The request is valid and correct, but there are conflicts with application logic
      msgString: "One of the players is already in a game",
    };
  }
}

class ErrUserExistence implements Message {
  getMsg(): { msgString: string; msgStatus: number } {
    return {
      msgStatus: StatusCode.ClientErrorUnprocessableEntity, //422
      //Server understands the request and that request is valid but server can't process it because the item doesn't exist
      msgString: "User specified doesn't exist",
    };
  }
}

class ErrUserTwo implements Message {
  getMsg(): { msgString: string; msgStatus: number } {
    return {
      msgStatus: StatusCode.ClientErrorConflict, //409
      //The request is valid and correct, but there are conflicts with application logic
      msgString: "You can't play with yourself",
    };
  }
}

class ErrCredit implements Message {
  getMsg(): { msgString: string; msgStatus: number } {
    return {
      msgStatus: StatusCode.ClientErrorUnauthorized, //401
      //The user request is valid and correct, but credentials don't allow the user to access at a content
      msgString: "Your credit is less than 0.35",
    };
  }
}

class ErrTurn implements Message {
  getMsg(): { msgString: string; msgStatus: number } {
    return {
      msgStatus: StatusCode.ClientErrorConflict, //409
      //The request is valid and correct, but there are conflicts with application logic
      msgString: "It's not your turn",
    };
  }
}

class ErrGameExistence implements Message {
  getMsg(): { msgString: string; msgStatus: number } {
    return {
      msgStatus: StatusCode.ClientErrorUnprocessableEntity, //422
      //Server understands the request and that request is valid but server can't process it because the item doesn't exist
      msgString: "Id game specified doesn't corrispond to an existing game",
    };
  }
}

class ErrGameOver implements Message {
  getMsg(): { msgString: string; msgStatus: number } {
    return {
      msgStatus: StatusCode.ClientErrorConflict, //409
      //The request is valid and correct, but there are conflicts with application logic
      msgString: "Id game specified corrisponds to a game that is over",
    };
  }
}

class ErrBodyFormat implements Message {
  getMsg(): { msgString: string; msgStatus: number } {
    return {
      msgStatus: StatusCode.ClientErrorBadRequest, //400
      //If the body has a bad format, the request is incorrect and server can't understand it
      msgString: "Body's request has an invalid format",
    };
  }
}

class ErrGetFormat implements Message {
  getMsg(): { msgString: string; msgStatus: number } {
    return {
      msgStatus: StatusCode.ClientErrorBadRequest, //400
      //If the get url has a bad format, the request is incorrect and server can't understand it
      msgString: "Get's request has an invalid format",
    };
  }
}

class ErrInvalidMove implements Message {
  getMsg(): { msgString: string; msgStatus: number } {
    return {
      msgStatus: StatusCode.ClientErrorConflict, //409
      //The request is valid and correct, but there are conflicts with application logic
      msgString: "The move you want to make is not valid",
    };
  }
}

export enum ErrEnum {
  GenericError,
  NoAuthHeader,
  ErrToken,
  ErrKeyToken,
  BadFormatPayload,
  NoAuth,
  ErrExistingGame,
  ErrUserExistence,
  ErrUserTwo,
  ErrCredit,
  ErrTurn,
  ErrGameExistence,
  ErrGameOver,
  ErrBodyFormat,
  ErrGetFormat,
  ErrInvalidMove
}

export class ErrorFactory {
  constructor() {}
  getError(type: ErrEnum): Message {
    let msgError: Message;
    switch (type) {
      case ErrEnum.GenericError:
        msgError = new GenericError();
        break;
      case ErrEnum.NoAuthHeader:
        msgError = new NoAuthHeader();
        break;
      case ErrEnum.ErrToken:
        msgError = new ErrToken();
        break;
      case ErrEnum.ErrKeyToken:
        msgError = new ErrKeyToken();
        break;
      case ErrEnum.BadFormatPayload:
        msgError = new BadFormatPayload();
        break;
      case ErrEnum.NoAuth:
        msgError = new NoAuth();
        break;
      case ErrEnum.ErrExistingGame:
        msgError = new ErrExistingGame();
        break;
      case ErrEnum.ErrUserExistence:
        msgError = new ErrUserExistence();
        break;
      case ErrEnum.ErrUserTwo:
        msgError = new ErrUserTwo();
        break;
      case ErrEnum.ErrCredit:
        msgError = new ErrCredit();
        break;
      case ErrEnum.ErrTurn:
        msgError = new ErrTurn();
        break;
      case ErrEnum.ErrGameExistence:
        msgError = new ErrGameExistence();
        break;
      case ErrEnum.ErrGameOver:
        msgError = new ErrGameOver();
        break;
      case ErrEnum.ErrBodyFormat:
        msgError = new ErrBodyFormat();
        break;
      case ErrEnum.ErrGetFormat:
        msgError = new ErrGetFormat();
        break;
      case ErrEnum.ErrInvalidMove:
        msgError = new ErrInvalidMove();
        break;
      default:
        msgError = new GenericError();
    }
    return msgError;
  }
}
