const mysql = require("mysql");
var db = mysql.createConnection({
    host: "47.100.13.189",
    user: "root",
    password: "1qaz2wsxE",
    database: "onlinefs"
})
db.connect();
db.query("select * from onlinefs_users", function(err, results) {
    console.log(results);
});
db.end();