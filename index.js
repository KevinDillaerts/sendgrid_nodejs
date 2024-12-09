const express = require("express");
const cors = require("cors");
const apiRouter = require("./routes/api/index"); // Import your routes

const app = express();

// CORS Configuration
const corsOptions = {
  origin: "https://sigridvolders.be", // Allow only your frontend domain
  methods: "GET,POST,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Attach routes to the app
app.use("/api", apiRouter);

const port = process.env.PORT || 4000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
