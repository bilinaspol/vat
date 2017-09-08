var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
 
var db = new sqlite3.Database("./upload/persons.db");  
var all = fs.readFileSync("./upload/persons.csv").toString().split('\n');
all.pop();


db.serialize(function() {
    db.run("DROP TABLE IF EXISTS user");
    db.run("CREATE TABLE user (id integer PRIMARY KEY, fname text NOT NULL, lname text NOT NULL, email text NOT NULL)");

   var stmt = db.prepare("INSERT INTO user VALUES (?,?,?,?)");

   all.forEach((r,i) => {
        console.log(r,i);
    let arr=r.split(',');   
    stmt.run(i,arr[0],arr[1],arr[2])
   })
  stmt.finalize();
  var list='';
    db.each("SELECT id,fname,lname,email FROM user", function(err, row) {       
                console.log(row.id,row.fname, row.lname,row.email);
                list=list +`<li>${row.id} ${row.fname} ${row.name} ${row.email}</li>`
        },function(){
           let [a,b]=template.slit('<!--place-->');
           res.send(a+'<ul>'+list+'</ul>'+b)
        }); 
    
})
db.close();  