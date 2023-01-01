const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");
const connection = require("./database/db");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//!this is the route for the user login and user
app.use("/api/v1/user", require("./routes/userRouter"));

//!this is the route for the todoapp storage
app.use("/api/v1/todo", require("./routes/todoRouter"));

connection();

//* Listening to the server
app.listen(PORT, () => {
  console.log(`server connected successfully at the ${PORT}`);
});
