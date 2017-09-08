var express    = require("express");
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'soccerstat',
  database : 'persons'
});
var app = express();

connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");    
} else {
    console.log("Error connecting database ... nn");    
}
});

app.get("/persons",function(req,res){
connection.query(`LOAD DATA LOCAL INFILE './upload/persons.csv'
INTO TABLE &lt;persons&gt;
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
(id, first_name,second_name,email);`, function(err, rows, fields) {
connection.end();
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.');
  });
});

app.listen(3000);