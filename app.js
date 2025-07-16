import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middlewares/Error.js";

config({
  path: "./config/config.env",
});

const app = express();

//using middleware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

app.use(
  cors({
    origin: ["*", "http://localhost:3000", "http://localhost:5173"," https://invoice-generator-mitra.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"],
  })
);

import user from "./routes/userRoutes.js";
import invoice from "./routes/invoiceRoute.js";

app.use("/api/v1", user);
app.use("/api/v1", invoice);


export default app;

app.get("/", (req, res) => res.send(`<h1>This Is OUR Billing software</h1>`));

app.use(ErrorMiddleware);
