const express = require('express');
const router = express.Router();
const db = require('./db');

// === CRIA UM PRODUTO INICIAL (CASO NÃO EXISTA) ===
db.query(
    "SELECT * FROM produtos_myria WHERE nome = ? LIMIT 1",
    ["Produto Inicial"],
    (err, result) => {
        if (err) return console.error("Erro ao checar produto inicial:", err.message);
        if (result.length === 0) {
            db.query(
                "INSERT INTO produtos_myria (nome, preco, categoria, descricao) VALUES (?, ?, ?, ?)",
                ["Produto Inicial", 10.00, "Teste", "Produto criado automaticamente para teste"],
                (err) => {
                    if (err) console.error("Erro ao criar produto inicial:", err.message);
                    else console.log("Produto inicial criado com sucesso!");
                }
            );
        } else {
            console.log("Produto inicial já existe.");
        }
    }
);

// LISTAR TODOS OS PRODUTOS
router.get('/', (req, res) => {
    db.query("SELECT * FROM produtos_myria", (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// CADASTRAR PRODUTO
router.post('/cadastrar', (req, res) => {
    const { nome, preco, categoria, descricao } = req.body;
    db.query(
        "INSERT INTO produtos_myria (nome, preco, categoria, descricao) VALUES (?, ?, ?, ?)",
        [nome, parseFloat(preco), categoria, descricao],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: "Produto cadastrado com sucesso!" });
        }
    );
});

// EDITAR PRODUTO
router.put('/editar/:id', (req, res) => {
    const { id } = req.params;
    const { nome, preco, categoria, descricao } = req.body;
    db.query(
        "UPDATE produtos_myria SET nome = ?, preco = ?, categoria = ?, descricao = ? WHERE id = ?",
        [nome, parseFloat(preco), categoria, descricao, id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Produto atualizado com sucesso!" });
        }
    );
});

// DELETAR PRODUTO
router.delete('/deletar/:id', (req, res) => {
    const { id } = req.params;
    db.query(
        "DELETE FROM produtos_myria WHERE id = ?",
        [id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Produto deletado com sucesso!" });
        }
    );
});

module.exports = router;