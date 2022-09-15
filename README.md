# Connect Four

## Progetto Programmazione Avanzata

### **Indice**

- [Autori](#autor)
- [Obiettivo del progetto](#obiettivo)
- [Diagrammi UML](#diagrammi)
- [Rotte](#rotte)
- [Pattern](#pattern)
- [Avvio dell'applicazione](#avvio)

---

<a name="autor"></a>

### Autori

- [Carosi Fabio](https://github.com/FabioCarosi)
- [Rossetti Cristina](https://github.com/CristinaRossetti)

---

<a name="obiettivo"></a>

# Obiettivo del progetto

L’obiettivo principale del progetto consiste nella realizzazione di un servizio back-end per la gestione del gioco del “_forza4_” (_connect four_).
L’applicazione prevede la possibilità di interagire con due tipologie di utenti:

- Player: utente che può partecipare ad una partita.
- Admin: utente che è autorizzato a ricaricare il credito dei diversi utenti.

Si possono avviare due diverse modalità di gioco:

- Utente VS Utente: è la modalità di gioco che permette a due utenti di interagire e giocare una partita l’uno contro l’altro.
- Utente VS IA: è la modalità di gioco che permette ad un utente di giocare contro l’intelligenza artificiale.

In particolare, sono richieste le seguenti specifiche per l’implementazione del servizio:

- **Creare una nuova partita** dando la possibilità di scegliere di giocarla contro un altro utente o contro l’intelligenza artificiale (in tal caso è necessario specificare il livello di difficoltà). Quando viene creata una partita, all’utente che crea una nuova partita deve essere scalato un numero di token pari a 0.35. Il modello può essere creato solo se c’è credito sufficiente ad esaudire la richiesta. Inoltre, un giocatore può allo stesso tempo partecipare ad **una e una sola partita**.

- **Inviare una mossa in una data partita** assicurandosi che l’utente invii la mossa alla partita corretta. Dopo l’invio della mossa, viene scalato al giocatore che ha “ospitato” l’altro nella partita, un numero di token pari a 0.05.
- **Visualizzare lo stato di una data partita**: nello specifico, visualizzare di chi è il turno, se la partita è terminata e in quale eventuale modo, ovvero terminata per vittoria, per abbandono comune o per abbandono di un giocatore.
- **Abbandonare una partita**: si deve dare al giocatore la possibilità di inviare una richiesta di abbandono della partita. Se entrambi gli utenti inviano richieste di abbandono distinte, allora si concorda sulla chiusura e si chiude forzatamente la partita.
- **Abbandono per scadenza**: se è trascorsa un’ora dall’ultima mossa, in questo caso la vittoria deve essere assegnata all’utente che ha fatto l’ultima mossa.
- **Visualizzare le partite svolte** riportando se sono state vinte o perse, la modalità di gioco, il numero di mosse totali. Le partite devono essere filtrate per la data di avvio della partita, dando la possibilità di scegliere un intervallo, oppure considerare le partite dopo una certa data o prima di una certa data.
- **Restituire lo storico delle mosse di una data partita** esportando un file JSON o un file in formato CSV. Si deve dare all’utente la possibilità di scegliere il separatore per il file CSV.
- **Ricarica del credito per un utente**: questa azione può essere compiuta solo dagli utenti con ruolo “Admin” e consente di ricaricare il credito di un utente.

---

### Strumenti

Sono stati utilizzati i seguenti strumenti per l’implementazione del servizio:

- Visual Studio Code
- Postman
- Docker

In Docker, è stato utilizzato un ulteriore strumento chiamato Adminer, che ha permesso una visualizzazione grafica migliore del DB.

---

### Linguaggi

- TypeScript
- SQL

---

### Librerie/Framework

- [NodeJS](https://nodejs.org/it/)
- [Connect4-AI](https://github.com/DaveTrost/connect4-ai)
- [Express](https://expressjs.com/it/starter/installing.html)
- [MySQL](https://www.mysql.com/it/)
- [Sequelize](https://sequelize.org/)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [Jsonwebtoken](https://www.npmjs.com/package/status-code-enum)
- [status-code-enum](https://www.npmjs.com/package/status-code-enum)

---

<a name="diagrammi"></a>

# Diagrammi

## Diagramma dei casi d’uso

![casiUso](utils/useCase.png)

## Diagrammi delle sequenze

### Creazione di una nuova partita

![createGame](utils/createGame.png)

### Invio di una mossa

![makeMove](utils/makeMove.png)

### Abbandono di una partita

![leaveGame](utils/leaveGame.png)

### Visualizzare lo stato di una data partita

![stateGame](utils/stateGame.png)

### Ricarica il credito di un utente

![chargeCredit](utils/chargeCredit.png)

### Restituire lo storico delle mosse

![allMoves](utils/allMoves.png)

### Visualizza le partite svolte da un utente

![viewGameByUser](utils/viewGameByUser.png)

## Modello ER

![ModelloER](utils/ModelloER.png)

---

## Struttura del DB

### Game

| Attributi  | Descrizione                                                               |
| ---------- | ------------------------------------------------------------------------- |
| id_game    | Primary Key                                                               |
| playerOne  | Giocatore 1                                                               |
| playerTwo  | Giocatore 2                                                               |
| status     | Stato della partita. Può essere “Game Over”, “In progress”, “Out of Time” |
| startTime  | Data di inizio della partita                                              |
| winner     | Vincitore della partita. All’inizio è settato come “none”.                |
| turn       | Turno attuale. Può essere playerOne o playerTwo.                          |
| difficulty | Difficoltà del gioco contro l’IA. Di default è impostata con “medium”.    |
| leaveState | Stato di un’eventuale richiesta di abbandono.                             |

### Move

| Attributi      | Descrizione                                                                        |
| -------------- | ---------------------------------------------------------------------------------- |
| id_move        | Primary Key                                                                        |
| id_game        | Identificatore della partita a cui la mossa appartiene.                            |
| email          | Email dell’utente che invia la mossa.                                              |
| column_move    | Numero che indica il numero della colonna in cui l’utente decide di fare la mossa. |
| timestamp_move | Timestamp in cui viene effettuata la mossa                                         |

### User

| Attributi | Descrizione         |
| --------- | ------------------- |
| email     | Primary Key         |
| credit    | Credito dell’utente |
| role      | Ruolo dell’utente   |

---

<a name="rotte"></a>

# Richieste

| Rotta            | Tipo | Autenticazione JWT |
| ---------------- | ---- | ------------------ |
| /startGame       | POST | SI                 |
| /makeMove        | POST | SI                 |
| /leaveGame       | POST | SI                 |
| /stateGame       | POST | SI                 |
| /chargeCredit    | POST | SI (ADMIN ONLY)    |
| /viewGamesByUser | GET  | SI                 |
| /allMoves        | POST | SI                 |

## Descrizione delle rotte

In questa sezione vengono descritte tutte le rotte utilizzate. Tutti i raw data inviati dall’utente vengono prima validati controllando la correttezza del token JWT, le autorizzazioni necessarie, il body della richiesta, l’esistenza o meno delle credenziali, e così via (verranno descritte più in dettaglio nei seguenti sottoparagrafi). Viene anche inserito un gestore di errori. Sia la validazione che la gestione degli errori sono organizzate mediante il pattern della Chain of Responsability.

Token JWT valido (email: “player1@email.com”, role:”Player”)

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBsYXllcjFAZW1haWwuY29tIiwicm9sZSI6IlBsYXllciJ9.4TSKRRuefHcsiBqIr2ISMyCdGsE8K96hO9BunIpnvkc
```

### **/startGame**

Questa rotta permette la creazione di una nuova partita. Dopo aver verificato la correttezza del body della richiesta, si controlla l’esistenza dell’utente che invia la richiesta e del player contro cui l’utente vuole giocare (se la modalità è User VS User), si controlla che l’utente non invii la richiesta a sé stesso, che l’utente non sia già attivo in una partita in corso e infine che l’utente abbia il credito sufficiente per creare una nuova partita.
Quando viene creata una nuova partita, il suo stato viene settato a “In progress” e il turno è del giocatore che ha inviato la richiesta.

Di seguito viene mostrato un esempio di payload valido nel body della richiesta in formato JSON:
Utente contro Utente

```json
{
  "playerTwo": "player2@email.com"
}
```

Utente contro IA:

```json
{
  "playerTwo": "ai",
  "difficulty": "easy"
}
```

**Response:**

```
A new game has started
Game ID: 1
You are playing against player2@email.com
```

### **/makeMove**

Questa rotta permette l’invio di una mossa verso il gioco corretto. Dopo aver verificato la correttezza del body della richiesta, si controlla l’esistenza dell’utente che invia la richiesta e del gioco specificato nel body della richiesta. Si verifica anche se l’utente ha l’autorizzazione per inviare la mossa, ovvero se la sua email corrisponde ad uno dei due player memorizzati nell’istanza Game del DB. Si verifica, inoltre, che l’id_game specificato corrisponda ad una partita “In progress”, cioè non terminata. Infine, viene verificato che l’utente sia coincidente con il turno corrente nell’istanza Game del DB.
Quando si sta giocando contro l’intelligenza artificiale, nel momento in cui l’utente invia la mossa, l’IA risponde automaticamente e viene memorizzata la sua mossa nel DB.
Quando viene inviata una nuova mossa, e quindi viene creata una nuova istanza di Move nel DB, viene cambiato il turno in Game al giocatore successivo e viene fatto partire un timer di 1h per far sì che, se dopo questo lasso di tempo non c’è nessuna mossa, viene abbandonata automaticamente la partita.

Di seguito viene mostrato un esempio di payload valido nel body della richiesta in formato JSON:

```json
{
  "id_game": 1,
  "column_move": 2
}
```

**Response:**

```
A move has been made
 Game ID: 1

 -  -  -  -  -  -  -
 -  -  -  -  -  -  -
 -  -  -  -  -  -  -
 -  -  -  -  -  -  -
 -  -  -  -  -  -  -
 -  -  1  -  -  -  -
---------------------
[0][1][2][3][4][5][6]
```

### **/leaveGame**

Questa rotta permette l’invio della richiesta di abbandono della partita. Dopo aver verificato la correttezza del body della richiesta, si controlla l’esistenza dell’utente che invia la richiesta e del gioco specificato nel body della richiesta. Si verifica che solo gli utenti che partecipano alla partita possono inviare la richiesta di abbandono. Inoltre, l’id_game specificato nel body della richiesta deve corrispondere ad una partita in corso, e non terminata.

Di seguito viene mostrato un esempio di payload valido nel body della richiesta in formato JSON:

```json
{
  "id_game": 1
}
```

**Response:**

```
Your request to draw the games has been successfully sent
```

```
Game Stopped - Draw
```

### **/stateGame**

Questa rotta permette di visualizzare lo stato di una data partita, ovvero di chi è il turno, se la partita è terminata e in quale eventuale modo. Dopo aver verificato la correttezza del body della richiesta, si controlla l’esistenza dell’utente che invia la richiesta e del gioco specificato nel body della richiesta.

Di seguito viene mostrato un esempio di payload valido nel body della richiesta in formato JSON:

```json
{
  "id_game": 1
}
```

**Response:**

```
Successful HTTP request

 -  -  -  -  -  -  -
 -  -  -  -  -  -  -
 -  -  -  -  -  -  -
 -  -  -  -  -  -  -
 -  -  -  -  -  -  -
 -  2  1  -  -  -  -
---------------------
[0][1][2][3][4][5][6]

 Turn: player1@email.com
 Status: In Progress
 Winner: No Winner
 Draw request: In Progress
```

### **/chargeCredit**

Questa rotta permette all’admin di ricaricare il credito di un utente. Dopo aver verificato la correttezza del body della richiesta, si controlla l’esistenza dell’utente che invia la richiesta e dell’utente a cui si vuole ricaricare il credito. Inoltre, si controlla se l’utente che invia la richiesta ha l’autorizzazione necessaria, ovvero è un admin.

Di seguito viene mostrato un esempio di payload valido nel body della richiesta in formato JSON:

```json
{
  "email": "player1@email.com",
  "newCredit": 50
}
```

**Response:**

```
Credit has been updated
```

### **/viewGamesByUser**

Questa rotta permette di ottenere la lista di tutte le partite svolte da un determinato utente. Si controlla l’esistenza dell’utente che invia la richiesta e si valida il formato dell’url della richiesta di tipo GET. L’URL ha il seguente formato:

- Partite comprese in un certo intervallo:

```
localhost:8080/viewGamesByUser?take=between&dateOne=2020-09-08&dateTwo=2022-09-15
```

- Partite oltre una certa data:

```
localhost:8080/viewGamesByUser?take=greaterThan&date=2022-09-14
```

- Partite prima di una certa data:

```
localhost:8080/viewGamesByUser?take=lessThan&date=2022-09-16
```

**Response:**

```
[
    {
        "id_game": 1,
        "won": "Yes",
        "modality": "User VS User",
        "numberOfMoves": 35,
        "date": "2022-09-04T09:14:08.000Z"
    },
    {
        "id_game": 6,
        "won": "No",
        "modality": "User VS User",
        "numberOfMoves": 2,
        "date": "2022-09-14T14:24:22.000Z"
    }
]
```

### **/allMoves**

Questa rotta permette di scaricare in formato JSON o CSV la lista di tutte le mosse di una certa partita. Dopo aver verificato la correttezza del body della richiesta, si controlla l’esistenza dell’utente che invia la richiesta e del gioco specificato nel body della richiesta.

Di seguito viene mostrato un esempio di payload valido nel body della richiesta in formato JSON:
Formato JSON

```json
{
  "id_game": 1,
  "format": "json"
}
```

Formato CSV

```json
{
  "id_game": 1,
  "format": "csv",
  "separator": ","
}
```

**Response:**

```
[
    {
        "id_move": 1,
        "id_game": 1,
        "email": "player1@email.com",
        "column_move": 2,
        "timestamp_move": "2022-09-14T12:51:53.000Z"
    },
   [...]
    {
        "id_move": 34,
        "id_game": 1,
        "email": "player2@email.com",
        "column_move": 5,
        "timestamp_move": "2022-09-14T12:58:21.000Z"
    },
    {
        "id_move": 35,
        "id_game": 1,
        "email": "player1@email.com",
        "column_move": 5,
        "timestamp_move": "2022-09-14T12:58:23.000Z"
    }
]
```

```
sep = ,
Player,Move,Time
player1@email.com,2,Wed Sep 14 2022 14:51:53 GMT+0200 (Central European Summer Time)
player2@email.com,3,Wed Sep 14 2022 14:52:09 GMT+0200 (Central European Summer Time)
player1@email.com,0,Wed Sep 14 2022 14:52:50 GMT+0200 (Central European Summer Time)
player2@email.com,2,Wed Sep 14 2022 14:53:07 GMT+0200 (Central European Summer Time)
player1@email.com,0,Wed Sep 14 2022 14:53:23 GMT+0200 (Central European Summer Time)
[...]
player2@email.com,5,Wed Sep 14 2022 14:58:21 GMT+0200 (Central European Summer Time)
player1@email.com,5,Wed Sep 14 2022 14:58:23 GMT+0200 (Central European Summer Time)
```

---

<a name="pattern"></a>

# Pattern Utilizzati

### Singleton

Il Singleton è un design pattern creazionale che assicura che una classe abbia una sola istanza, mantenendo un accesso globale a quella istanza. In questo progetto, il Singleton è utilizzato per assicurare che ci sia un’unica istanza di connessione al DB. Nel momento in cui, quindi, viene richiamata la connessione, questa, se non esiste, viene creata, altrimenti viene richiamata quella esistente.

### Chain of Responsability

La Chain of Responsability (CoR) è un design pattern comportamentale che permette di passare le richieste lungo una catena di handlers (gestori). In questo progetto, la CoR viene utilizzata per organizzare al meglio la gestione dei middleware di validazione e degli errori. Ad ogni rotta viene associata una catena di middleware, e ogni funzione elabora la richiesta e la passa al successivo handler nella catena. Nel caso di errore, questo viene passato all’handler che gestirà l’errore e interromperà l’esecuzione. Se non ci sono stati errori, la richiesta viene elaborata da tutti gli handler della catena, per poi essere processata dal controller.

A tal proposito, vengono utilizzati i **middleware**, funzioni adatte per la validazione delle richieste. Vengono utilizzati per controllare l’esistenza degli utenti e della partita, per verificare le autorizzazioni e la validità dei token JWT.

### Factory Method

Il Factory Method è un design pattern creazionale che fornisce un’interfaccia per la creazione di oggetti in una superclasse, e permette alle sottoclassi di alterare il tipo di oggetti che saranno creati.
In questo progetto, questo pattern viene utilizzato per la creazione dei diversi messaggi di errore e di successo che saranno ritornati al Client. Viene creata un’interfaccia comune Message e tutte le classi che implementano questa interfaccia dovranno dichiarare il metodo getMsg() per ottenere il messaggio di errore/successo con il relativo status code.

### Model - Controller

Model-View-Controller è un pattern architetturale. In questo progetto non è stata implementata la View, ma solamente la parte di back-end. Il Model ha permesso di gestire tutto il DB e le operazioni su di esso, mentre la componente di Controller ha consentito la gestione dell’interazione dell’utente con l’applicazione, ovvero tutte le funzioni che vengono chiamate una volta che viene richiamata una certa rotta.

---

<a name="avvio"></a>

# Avvio dell'applicazione

- Per avviare l’applicazione è necessario avere l’ambiente Docker installato sulla propria macchina
- Clonare la repository da terminale tramite il comando:

```
git clone https://github.com/FabioCarosi/ConnectFour_PA.git
```

- Spostarsi all’interno della cartella appena creata
- Creare un file `.env` con la seguente struttura:

```
SECRET_KEY = connectfourkey
MYSQL_USER=user
MYSQL_ROOT_PASSWORD=password
MYSQL_PASSWORD=password
MYSQL_DATABASE=connectfour
MYSQL_PORT=3306
MYSQL_HOST=db
MYSQL_ALLOW_EMPTY_PASSWORD=no
```

- Eseguire all’interno della cartella del progetto il seguente comando da terminale per installare tutti i pacchetti necessari:

```
npm i
```

- Eseguire all’interno della cartella del progetto il comando da terminale:

```
docker-compose up
```

- L’applicazione è accessibile all’indirizzo `localhost:8080`, mentre all’indirizzo `localhost:8082` è accessibile lo strumento Adminer per la visualizzazione del database.

## Test

Per il testing è possibile importare all’interno della piattaforma Postman il file `GameTest.json` in cui è stato inserito un insieme degli scenari possibili. Si consiglia di seguire l'ordine in cui sono presentate le rotte in modo da evitare possibili conflitti con i dati già presenti nel database.

---

### Ringraziamenti

W001260 - Prof. **Adriano Mancini** - Programmazione Avanzata
