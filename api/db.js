const mysql = require('mysql2');

const connection = mysql.createPool({
    host: "benserverplex.ddns.net",
    user: "alunos",
    password: "senhaAlunos",
    database: "web_03ta",
    connectionLimit: 10
});

console.log("Conectando ao banco remoto...");

module.exports = connection;