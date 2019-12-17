const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
require("./pwless/pwl-routes")(app);

app.listen(3456,()=>console.log("port 3456"));