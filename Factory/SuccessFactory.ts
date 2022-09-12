import {Message} from './MessageInterface';
const {StatusCode} = require('status-code-enum');

class SuccessGeneric implements Message {
    getMsg():{msgString: string, msgStatus: number}{
        return{
        msgStatus : StatusCode.SuccessOK, //200
        msgString: "Successful HTTP request"
        }
    }
}
class SuccessNewGame implements Message {
    getMsg():{msgString: string, msgStatus: number}{
        return{
        msgStatus : StatusCode.SuccessCreated, //201
        msgString: "A new game has started"
        }
    }
}

class SuccessCreditUpdated implements Message {
    getMsg():{msgString: string, msgStatus: number}{
        return{
        msgStatus : StatusCode.SuccessOK, //200
        msgString: "Credit has been updated"
        }
    }
}

class SuccessNewMove implements Message {
    getMsg():{msgString: string, msgStatus: number}{
        return{
        msgStatus : StatusCode.SuccessCreated, //201
        msgString: "A move has been made"
        }
    }
}

class SuccessViewGamesByUser implements Message {
    getMsg():{msgString: string, msgStatus: number}{
        return{
        msgStatus : StatusCode.SuccessOK, //200
        msgString: "Your request to view all games of the user was successful"
        }
    }
}

class SuccessDrawRequest implements Message {
    getMsg():{msgString: string, msgStatus: number}{
        return{
        msgStatus : StatusCode.SuccessOK, //200
        msgString: "Your request to draw the games has been successfully sent"
        }
    }
}

class SuccessDraw implements Message {
    getMsg():{msgString: string, msgStatus: number}{
        return{
        msgStatus : StatusCode.SuccessOK, //200
        msgString: "Game Over - Draw"
        }
    }
}

class SuccessDownload implements Message{
    getMsg():{msgString: string, msgStatus: number}{
        return{
        msgStatus : StatusCode.SuccessOK, //200
        msgString: "File downloaded successfully"
        }
    }
}

export enum SuccEnum {
    SuccessGeneric,
    SuccessNewGame,
    SuccessCreditUpdated,
    SuccessNewMove,
    SuccessViewGamesByUser,
    SuccessDrawRequest,
    SuccessDraw
}

export class SuccessFactory {
    constructor(){}
    getSuccess (type:SuccEnum): Message{
        let msgSuccess:Message;
        switch (type){
            case SuccEnum.SuccessGeneric:
                msgSuccess = new SuccessGeneric();
                break;
            case SuccEnum.SuccessNewGame:
                msgSuccess = new SuccessNewGame();
                break;
            case SuccEnum.SuccessCreditUpdated:
                msgSuccess = new SuccessCreditUpdated();
                break;
            case SuccEnum.SuccessNewMove:
                msgSuccess = new SuccessNewMove();
                break;
            case SuccEnum.SuccessViewGamesByUser:
                msgSuccess = new SuccessViewGamesByUser();
                break;    
            case SuccEnum.SuccessDrawRequest:
                msgSuccess = new SuccessDrawRequest();
                break;
            case SuccEnum.SuccessDraw:
                msgSuccess = new SuccessDraw();
                break;
            default:
                msgSuccess = new SuccessGeneric();
                break;
        }
            return msgSuccess;
            
        }
    }