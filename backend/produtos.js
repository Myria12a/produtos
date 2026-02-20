const express = require('express');
const router = express.Router();
const db = require('./db');

// Listar produtos
router.get('/', (req, res) => {
    db.query('SELECT * FROM produtos', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Cadastrar produto
router.post('/cadastrar', (req, res) => {
    const { nome, preco } = req.body;

    db.query(
        'INSERT INTO produtos (nome, preco) VALUES (?, ?)',
        [nome, preco],
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Produto cadastrado com sucesso!' });
        }
    );
});

module.exports = router;