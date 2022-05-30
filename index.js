require("dotenv").config();
const express = require("express");
const cors = require("cors");
const indexRouter = require("./routes/api/index");

const port = process.env.PORT || 4000;

const app = express();

const corsOptions = {
  // TODO: change to domain website
  origin: "*",
  methods: "POST, GET",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", indexRouter);

app.listen(port, () => console.log(`The server is running on port ${port}`));

module.exports = express;
