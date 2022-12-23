var cors = require("cors");
const express = require("express");
require("dotenv").config();
require("./db");


const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());


app.use("/api/auth", require("./routes/auth"));
app.use("/api/note", require("./routes/notes"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
