import express, { Application, Request, Response } from "express";
import { specialtyRoutes } from "./app/modules/specialty/specialty.routes";
import { indexRoutes } from "./app/routes";

const app : Application = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use("/api/v1", indexRoutes);

app.get("", (req : Request, res: Response)=>{
    res.send("Hello world!");
});

export default app;