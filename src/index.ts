import * as FilterChange from './FilterChange';
import express, { Request, Response } from 'express';
const app = express();
require('dotenv').config();

app.post("/filterpriority", (request: Request, response: Response): void => {
    response.send("Filter change process started");
    FilterChange.InitiateFilterChange();
})

app.listen(process.env.PORT, (): void => { console.log(`Listening op port ${process.env.PORT}`) });