const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const produtosRouter = require('./produtos');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/produtos', produtosRouter);

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});