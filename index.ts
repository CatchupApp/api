require("dotenv").config();
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import morgan from "morgan";
import { ValidationError } from "express-validation";

import UserRoutes from "./routes/user";
import AuthRoutes from "./routes/auth";
import ClassRoutes from "./routes/class";
import { UserDocument } from "./models/user";

const PORT = process.env.PORT || 8000;
const DB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1/catchup";

// Add `user` field to Request to work with express-jwt
declare global {
  interface Token {
    iss: string;
    sub: string;
    aud: string | string[];
    iat: number;
    exp: number;
    azp: string;
    scope: string;
  }

  namespace Express {
    interface Request {
      token?: Token;
      user?: UserDocument;
    }
  }
}

const app = express();
mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log(`⚙️  Connected to database at ${DB_URI}`);
  })
  .catch((err) => {
    console.error(`⚙️  Failed to connect to database: ${err}`);
  });

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_BASE_URL); // Update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, X-CSRF-Token, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, DELETE, OPTIONS'"
  );
  next();
});

// Defautl root route
app.get("/", (_req, res) => res.send("Welcome to Catchup!"));
// Authentication
app.use("/auth", AuthRoutes);
// Standard routes
app.use("/user", UserRoutes);
app.use("/class", ClassRoutes);
// Error handler
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json(err);
    }

    return res.status(500).json(err);
  }
);

app.listen(PORT, () => {
  console.log(`⚡️ Server is running at https://localhost:${PORT}`);
});
