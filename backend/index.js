const express = require("express");
const cors = require("cors");
require("dotenv").config();
const userRouter = require("./routers/user-routers");
const app = express();
const {connection} =require('./connection/mongo-connection');

app.use(express.json());
app.use(cors({origin:"*"}));
connection()
app.use("/api/user", userRouter);

const port = process.env.PORT || 8070;
app.listen(port, () => console.log(`Listening on the port ${port}...`));