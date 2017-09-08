var express = require('express');
var formidable = require('formidable');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var app = express();
var temp = fs.readFileSync('./index.html').toString();
let [A,B]=temp.split('<!--place-->');
app.get('/', function (req, res){
    res.sendFile(__dirname + '/index.html');
});

app.post('/', function (req, res){
    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/upload/persons.csv';
    });

    form.on('file', function (name, file){
        console.log('Uploaded ' + file.name);
        saveToSql(res)
    });

   
});

function saveToSql(res) {
    var db = new sqlite3.Database("./upload/persons.db");  
    var all = fs.readFileSync("./upload/persons.csv").toString().split('\n');
    all.pop();
    
    
    db.serialize(function() {
        db.run("DROP TABLE IF EXISTS user");
        db.run("CREATE TABLE user (id integer PRIMARY KEY, fname text NOT NULL, lname text NOT NULL, email text NOT NULL)");
    
       var stmt = db.prepare("INSERT INTO user VALUES (?,?,?,?)");
    
       all.forEach((r,i) => {
            console.log(r,i);
        let arr=r.split(/\t|,/);   
        stmt.run(i,arr[0],arr[1],arr[2])
       })
      stmt.finalize();
      var list='';
        db.each("SELECT id,fname,lname,email FROM user", function(err, row) {       
                    console.log(row.id,row.fname, row.lname,row.email);
                    list=list +`<li> ${row.fname} ${row.lname} ${row.email}</li>`
            },function(){
              
               res.send(A+'<ul>'+list+'</ul>'+B)
            }); 
        
    })
    db.close();  
}

app.listen(3001);
