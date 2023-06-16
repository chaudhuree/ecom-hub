const express = require("express");
const { readdirSync } = require("fs");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotanv = require("dotenv");
const helmet = require("helmet");
const { bgCyan } = require("colors");
require("colors");
const connectDb = require("./config/config");
//dotenv config
dotanv.config();
//db config
connectDb();
//rest object
const app = express();

//middlwares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet({crossOriginResourcePolicy: false}))
app.use(morgan("dev"));

//routes
// app.use("/api/items", require("./routes/itemRoutes"));
// app.use("/api/users", require("./routes/userRoutes"));
// app.use("/api/bills", require("./routes/billsRoute"));
// app.use("/api/category", require("./routes/categoryRoute"));

// routes middleware
readdirSync("./routes").map(r => app.use("/api/v1", require(`./routes/${r}`))) 
app.get('/',(req,res)=>{
    res.send("server is running")
})
//port
const PORT = process.env.PORT || 5000;

//listen
app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`.bgGreen.white);
});
