require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { attachUser, requireAuth } = require("./utils");
const register = require("./api/register");
const authenticate = require("./api/authenticate");
const todos = require("./api/todos");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api", register);
app.use("/api", authenticate);

app.use(attachUser);
app.use("/api", requireAuth, todos);

const PORT = 3001;

app.listen(PORT, async () => {
  console.log("⌛ Connecting to the database");

  await mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  console.log(`🚀 API is running at http://localhost:${PORT}`);
});
