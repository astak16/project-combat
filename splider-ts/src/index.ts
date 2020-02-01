import express, { Request, Response, NextFunction } from "express";
import router from "./router";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  cookieSession({
    name: "session",
    keys: ["dell teacher"],
    maxAge: 24 * 60 * 60 * 1000
  })
);

app.use(router);

app.listen(7002, () => {
  console.log("sever is running");
});
