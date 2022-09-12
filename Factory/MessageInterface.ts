//interfaccia Message utilizzata per implementare il pattern Factory
//getMsg() verrà implementato a seconda del messaggio da mostrare all'utente
export interface Message {
    getMsg(): {msgString: string, msgStatus: number};
}