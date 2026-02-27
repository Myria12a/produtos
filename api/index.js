const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");

const app = express();
const PORT = 3000;

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "seu_banco",
};

let pool;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "web")));

function validarProduto({ name, price, category }, parcial = false) {
  const erros = [];

  if (!parcial || name !== undefined) {
    if (!name || String(name).trim() === "") erros.push("Nome é obrigatório.");
  }

  if (!parcial || category !== undefined) {
    if (!category || String(category).trim() === "") erros.push("Categoria é obrigatória.");
  }

  if (!parcial || price !== undefined) {
    const valor = Number(price);
    if (!Number.isFinite(valor)) erros.push("Preço inválido.");
    if (valor < 0 || valor > 999999.99) erros.push("Preço deve estar entre 0 e 999999.99.");
  }

  return erros;
}

async function criarTabela() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS produtos_myria (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      category VARCHAR(100) NOT NULL,
      description TEXT
    );
  `);
}

async function criarProdutoInicial() {
  const [rows] = await pool.query("SELECT COUNT(*) AS total FROM produtos_myria");
  if (rows[0].total === 0) {
    await pool.query(
      "INSERT INTO produtos_myria (name, price, category, description) VALUES (?, ?, ?, ?)",
      ["Produto Inicial Myria", 49.9, "Teste", "Produto criado automaticamente para testar o DELETE."]
    );
  }
}

app.get("/products", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM produtos_myria ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produtos." });
  }
});

app.post("/products", async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    const erros = validarProduto({ name, price, category });
    if (erros.length) return res.status(400).json({ error: erros.join(" ") });

    const [result] = await pool.query(
      "INSERT INTO produtos_myria (name, price, category, description) VALUES (?, ?, ?, ?)",
      [String(name).trim(), Number(price), String(category).trim(), description ? String(description).trim() : null]
    );

    res.status(201).json({
      message: "Produto cadastrado com sucesso.",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao cadastrar produto." });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "ID inválido." });
    }

    const { name, price, category, description } = req.body;
    const erros = validarProduto({ name, price, category });
    if (erros.length) return res.status(400).json({ error: erros.join(" ") });

    const [result] = await pool.query(
      "UPDATE produtos_myria SET name = ?, price = ?, category = ?, description = ? WHERE id = ?",
      [String(name).trim(), Number(price), String(category).trim(), description ? String(description).trim() : null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    res.json({ message: "Produto atualizado com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar produto." });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "ID inválido." });
    }

    const [result] = await pool.query("DELETE FROM produtos_myria WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    res.json({ message: "Produto excluído com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir produto." });
  }
});

async function iniciar() {
  try {
    pool = await mysql.createPool(dbConfig);
    await criarTabela();
    await criarProdutoInicial();

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Falha ao iniciar servidor:", error.message);
    process.exit(1);
  }
}

iniciar();
