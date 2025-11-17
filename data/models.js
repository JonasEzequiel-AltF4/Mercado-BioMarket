const db = require("./database");
const fs = require("fs");
const path = require("path");


// ===================== FUNÇÕES CRUD =====================
function listarProdutos(busca) {
  let query = "SELECT * FROM produtos";
  if (busca) query += " WHERE LOWER(nome) LIKE ?";
  return busca ? db.prepare(query).all(`%${busca.toLowerCase()}%`) : db.prepare(query).all();
}

function buscarProdutoPorId(id) {
  return db.prepare("SELECT * FROM produtos WHERE id = ?").get(id);
}

function criarProduto(produto) {
  const stmt = db.prepare(`
    INSERT INTO produtos
    (nome, description, category, price, stock, unit_measure, sku, image, is_featured, is_offer)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    produto.nome,
    produto.description || "",
    produto.category || "",
    produto.price || 0,
    produto.stock || 0,
    produto.unit_measure || "",
    produto.sku || "",
    produto.image || "",
    produto.is_featured ? 1 : 0,
    produto.is_offer ? 1 : 0
  );
  return buscarProdutoPorId(info.lastInsertRowid);
}

function atualizarProduto(id, produto) {
  db.prepare(`
    UPDATE produtos SET
      nome = ?, description = ?, category = ?, price = ?, stock = ?,
      unit_measure = ?, sku = ?, image = ?, is_featured = ?, is_offer = ?
    WHERE id = ?
  `).run(
    produto.nome,
    produto.description || "",
    produto.category || "",
    produto.price || 0,
    produto.stock || 0,
    produto.unit_measure || "",
    produto.sku || "",
    produto.image || "",
    produto.is_featured ? 1 : 0,
    produto.is_offer ? 1 : 0,
    id
  );
  return buscarProdutoPorId(id);
}

function deletarProduto(id) {
  return db.prepare("DELETE FROM produtos WHERE id = ?").run(id).changes;
}

module.exports = {
  listarProdutos,
  buscarProdutoPorId,
  criarProduto,
  atualizarProduto,
  deletarProduto
};
