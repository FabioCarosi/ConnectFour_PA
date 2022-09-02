import * as express from "express";


const PORT = 8080;
const HOST = 0.0.0.0;

const app = express();

//It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json());

app.use