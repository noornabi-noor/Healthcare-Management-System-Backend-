import express, { Application, Request, Response } from "express";
import { indexRoutes } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import cookieParser from "cookie-parser";

const app : Application = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", indexRoutes);

app.get("", (req : Request, res: Response)=>{
    res.send("Hello world!");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;