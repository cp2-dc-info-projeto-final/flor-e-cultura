// routes/checkout.js
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { verifyToken } = require('../middlewares/auth');

// Configuração da conexão com PostgreSQL
const pool = new Pool({
  user: 'floriculturatcc2025',
  host: 'localhost',
  database: 'flor_e_cultura',
  password: 'tcc2025flower',
  port: 5432,
});

// POST /api/checkout
router.post('/', verifyToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const { itens } = req.body;
    const usuarioId = parseInt(req.user.id);

    if (!itens || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ error: 'Carrinho vazio.' });
    }

    // Verificar se usuário existe
    const usuarioResult = await client.query(
      'SELECT * FROM usuarios WHERE id = $1',
      [usuarioId]
    );
    if (usuarioResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    let total = 0;
    const itensComDetalhes = [];

    for (const item of itens) {
      if (!item.produtoId || !item.quantidade || item.quantidade <= 0) {
        return res.status(400).json({ error: 'Dados inválidos nos itens.' });
      }

      const produtoResult = await client.query(
        'SELECT * FROM produtos WHERE id = $1',
        [item.produtoId]
      );
      const produto = produtoResult.rows[0];

      if (!produto) {
        return res.status(404).json({ error: `Produto ${item.produtoId} não encontrado.` });
      }

      if (produto.quantidade < item.quantidade) {
        return res.status(400).json({
          error: `Estoque insuficiente para ${produto.nome_produto}. Disponível: ${produto.quantidade}`
        });
      }

      const subtotal = Number(produto.preco) * item.quantidade;
      total += subtotal;

      itensComDetalhes.push({
        produtoId: produto.id,
        nome: produto.nome_produto,
        preco: Number(produto.preco),
        quantidade: item.quantidade,
        subtotal
      });
    }

    // Transação
    await client.query('BEGIN');

    // Criar pedido
    const pedidoResult = await client.query(
      'INSERT INTO pedidos (usuario_id, total, status) VALUES ($1, $2, $3) RETURNING *',
      [usuarioId, total, 'CONFIRMADO']
    );
    const pedido = pedidoResult.rows[0];

    // Criar itens do pedido
    for (const item of itensComDetalhes) {
      await client.query(
        'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario, subtotal) VALUES ($1, $2, $3, $4, $5)',
        [pedido.id, item.produtoId, item.quantidade, item.preco, item.subtotal]
      );

      // Atualizar estoque
      await client.query(
        'UPDATE produtos SET quantidade = quantidade - $1, atualizado_em = NOW() WHERE id = $2',
        [item.quantidade, item.produtoId]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Compra realizada com sucesso!',
      pedido: {
        id: pedido.id,
        total: Number(pedido.total),
        status: pedido.status,
        data_pedido: pedido.data_pedido,
        itens: itensComDetalhes
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro no checkout:', error);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  } finally {
    client.release();
  }
});

// GET /api/checkout/pedidos
router.get('/pedidos', verifyToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const usuarioId = parseInt(req.user.id);

    const pedidosResult = await client.query(
      `SELECT p.*, i.id as item_id, i.quantidade, i.preco_unitario, i.subtotal,
              pr.nome_produto, pr.descricao, pr.imagem
       FROM pedidos p
       LEFT JOIN itens_pedido i ON p.id = i.pedido_id
       LEFT JOIN produtos pr ON i.produto_id = pr.id
       WHERE p.usuario_id = $1
       ORDER BY p.data_pedido DESC`,
      [usuarioId]
    );

    // Agrupar pedidos
    const pedidosMap = {};
    pedidosResult.rows.forEach(row => {
      if (!pedidosMap[row.id]) {
        pedidosMap[row.id] = {
          id: row.id,
          total: Number(row.total),
          status: row.status,
          data_pedido: row.data_pedido,
          itens: []
        };
      }
      if (row.item_id) {
        pedidosMap[row.id].itens.push({
          id: row.item_id,
          quantidade: row.quantidade,
          preco_unitario: Number(row.preco_unitario),
          subtotal: Number(row.subtotal),
          produto: {
            nome_produto: row.nome_produto,
            descricao: row.descricao,
            imagem: row.imagem
          }
        });
      }
    });

    res.json(Object.values(pedidosMap));
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ error: 'Erro ao buscar pedidos.' });
  } finally {
    client.release();
  }
});

module.exports = router;
