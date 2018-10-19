var express = require("express");
var app = express();

app.use(express.static("./"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.listen("3000");
console.log("This is server, server started and waitting for in port 3000...");

app.get("/", function (req, res) {
    res.render("main");
});

// var shortid = require('shortid');
