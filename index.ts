import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";

const PORT = process.env.PORT || 8000;
const DB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1/catchup";

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

app.get("/", (req, res) => res.send("Express and TypeScript server"));
app.listen(PORT, () => {
  console.log(`⚡️ Server is running at https://localhost:${PORT}`);
});
