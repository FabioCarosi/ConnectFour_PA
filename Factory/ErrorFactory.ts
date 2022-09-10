import {Message} from './MessageInterface';
const {StatusCode} = require('status-code-enum');

class NoAuthHeader implements Message {
    getMsg():{msgString: string, msgStatus: number}{
        return{
        msgStatus : StatusCode.ClientErrorBadRequest, //400
        msgString: "There's no auth header"
        }
    }
}

class ErrToken implements Message {
    getMsg(): { msgString: string, msgStatus: number } {
        return{
            msgStatus: StatusCode.ClientErrorForbidden, //403
            msgString: "JWT token is invalid"
        }
    }
}

class ErrKeyToken implements Message {
    getMsg(): { msgString: string, msgStatus: number } {
        return{
            msgStatus: StatusCode.ClientErrorForbidden, //403
            msgString: "Key is invalid"
        }
    }
}

class badFormatPayload implements Message{
    getMsg(): { msgString: string, msgStatus: number } {
        return {
            msgStatus: StatusCode.ClientErrorBadRequest, //400
            msgString: "Payload has bad format"
        }
    }
}

//for authAdmin
class noAuth implements Message {
    getMsg(): { msgString: string, msgStatus: number } {
        return {
            msgStatus: StatusCode.ClientErrorForbidden, //403
            msgString: "You are not authorized to access at this content"
        }
    }
}

class errExistingGame implements Message {
    getMsg(): { msgString: string, msgStatus: number } {
        return {
            msgStatus: StatusCode.ClientErrorForbidden, //403
            msgString: "One of the players is already in a game"
        }
    }
}

class errUserExistence implements Message {
    getMsg(): { msgString: string, msgStatus: number } {
        return {
            msgStatus: StatusCode.ClientErrorBadRequest, //400
            msgString: "User specified doesn't exist"
        }
    }
}

class errUserTwo implements Message {
    getMsg(): { msgString: string, msgStatus: number } {
        return {
            msgStatus: StatusCode.ClientErrorBadRequest, //400
            msgString: "You can't play with yourself"
        }
    }
}

class errCredit implements Message {
    getMsg(): { msgString: string, msgStatus: number } {
        return {
            msgStatus: StatusCode.ClientErrorUnauthorized, //401
            msgString: "Your credit is less than 0.35"
        }
    }
}

class errTurn implements Message {
    getMsg(): { msgString: string, msgStatus: number } {
        return {
            msgStatus: StatusCode.ClientErrorForbidden, //403
            msgString: "It's not your turn"
        }
    }
}

class errGameExistence implements Message{
    getMsg(): { msgString: string, msgStatus: number } {
        return {
            msgStatus: StatusCode.ClientErrorBadRequest, //400
            msgString: "Id game specified doesn't corrispond to an existing game"
        }
    }
}

class errGameOver implements Message {
    getMsg(): { msgString: string, msgStatus: number } {
        return {
            msgStatus: StatusCode.ClientErrorForbidden, //403
            msgString: "Id game specified corrisponds to a game that is over"
        }
    }
}