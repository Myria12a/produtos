const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // seu usuário do MySQL
    password: '', // sua senha
    database: 'web_03ta'
});

connection.connect((err) => {
    if (err) {
        console.log('Erro ao conectar ao banco:', err);
    } else {
        console.log('Banco conectado com sucesso!');
    }
});

module.exports = connection;