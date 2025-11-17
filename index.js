const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3000;

// Conecta ao SQLite
const db = new Database(path.join(__dirname, 'produtos.db'));

// Cria tabela produtos se não existir
db.prepare(`
  CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    descricao TEXT,
    categoria TEXT,
    preco REAL,
    estoque INTEGER,
    unidade TEXT,
    img TEXT DEFAULT 'placeholder.jpg'
  )
`).run();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Arquivos públicos (CSS/JS/img)

// Função auxiliar para padronizar produto enviado ao frontend
function formatProduct(p) {
  return {
    id: p.id,
    name: p.nome || 'Produto Sem Nome',
    description: p.descricao || '',
    category: p.categoria || 'Geral',
    price: Number(p.preco) || 0,
    stock: p.estoque || 0,
    unit: p.unidade || '',
    image: p.img || 'placeholder-oferta.jpg'
  };
}

/* =============================
        ROTAS REST
============================= */

// GET /produtos/:id
app.get('/produtos/:id', (req, res) => {
  try {
    const produto = db.prepare('SELECT * FROM produtos WHERE id = ?').get(req.params.id);
    if (!produto) return res.status(404).json({ mensagem: 'Produto não encontrado' });

    res.json(formatProduct(produto));
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar produto' });
  }
});

// GET /produtos (com busca)
app.get('/produtos', (req, res) => {
  try {
    let produtos = db.prepare('SELECT * FROM produtos').all();
    const busca = req.query.busca?.toLowerCase();

    if (busca)
      produtos = produtos.filter(p => p.nome.toLowerCase().includes(busca));

    res.json(produtos.map(formatProduct));
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar produtos' });
  }
});

// POST /produtos (CRIAR)
app.post('/produtos', (req, res) => {
  try {
    const { nome, descricao, categoria, preco, estoque, unidade, img } = req.body;

    const info = db.prepare(`
      INSERT INTO produtos (nome, descricao, categoria, preco, estoque, unidade, img)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      nome || "",
      descricao || "",
      categoria || "",
      preco || 0,
      estoque || 0,
      unidade || "",
      img || "placeholder-oferta.jpg"
    );

    const novo = db.prepare('SELECT * FROM produtos WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(formatProduct(novo));

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao adicionar produto' });
  }
});

// PUT /produtos/:id (ATUALIZAR)
app.put('/produtos/:id', (req, res) => {
  try {
    const { nome, descricao, categoria, preco, estoque, unidade, img } = req.body;

    const info = db.prepare(`
      UPDATE produtos 
      SET nome = ?, descricao = ?, categoria = ?, preco = ?, estoque = ?, unidade = ?, img = ?
      WHERE id = ?
    `).run(
      nome || "",
      descricao || "",
      categoria || "",
      preco || 0,
      estoque || 0,
      unidade || "",
      img || "placeholder-oferta.jpg",
      req.params.id
    );

    if (info.changes === 0)
      return res.status(404).json({ mensagem: 'Produto não encontrado' });

    const atualizado = db.prepare('SELECT * FROM produtos WHERE id = ?').get(req.params.id);
    res.json(formatProduct(atualizado));

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao atualizar produto' });
  }
});

// DELETE /produtos/:id
app.delete('/produtos/:id', (req, res) => {
  try {
    const info = db.prepare('DELETE FROM produtos WHERE id = ?').run(req.params.id);

    if (info.changes === 0)
      return res.status(404).json({ mensagem: 'Produto não encontrado' });

    res.json({ mensagem: 'Produto excluído com sucesso' });

  } catch (error) {
    res.status(500).json({ erro: 'Erro ao excluir produto' });
  }
});

// Inicializa servidor
console.log("Usando banco em:", path.join(__dirname, "produtos.db"));

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
