const express = require('express')
const app = express()
const port = 3000
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
}

const mysql = require('mysql')
const connection = mysql.createConnection(config)

const insertSql = `INSERT INTO people(name) VALUES('Murilo')`
connection.query(insertSql);

var people = [];
var names = [];
(async () => {
  people = await getPeople();
  Object.keys(people).forEach(function(key) { names.push(people[key].name) });
  console.log(people);
  console.log(names);
  connection.end();
})();

function getPeople() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM people", (err, result) => {
        return err ? reject(err) : resolve(result);
      }
    );
  });
}

app.get('/', (req, res) => {
    res.send('<h1>Full Cycle Rocks!</h1>' + names)
})

app.listen(port, () => {
    console.log('Rodando na porta: ' + port)
})