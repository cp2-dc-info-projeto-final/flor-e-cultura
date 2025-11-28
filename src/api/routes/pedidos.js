// routes/admin/pedidos.js
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { verifyToken, isAdmin } = require('../middlewares/auth');

// Configuração da conexão com PostgreSQL
const pool = new Pool({
  user: 'floriculturatcc2025',
  host: 'localhost',
  database: 'flor_e_cultura',
  password: 'tcc2025flower',
  port: 5432,
});

// GET /api/pedidos - Listar todos os pedidos
router.get('/', verifyToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT p.id, p.usuario_id, p.total, p.status, p.data_pedido,
             u.nome_completo, u.email, u.telefone, u.cpf,
             i.id AS item_id, i.quantidade, i.preco_unitario, i.subtotal,
             pr.nome_produto, pr.descricao
      FROM pedidos p
      JOIN usuarios u ON p.usuario_id = u.id
      LEFT JOIN itens_pedido i ON p.id = i.pedido_id
      LEFT JOIN produtos pr ON i.produto_id = pr.id
      ORDER BY p.data_pedido DESC
    `);

    // Agrupar pedidos com seus itens
    const pedidosMap = {};
    result.rows.forEach(row => {
      if (!pedidosMap[row.id]) {
        pedidosMap[row.id] = {
          id: row.id,
          usuario: {
            nome_completo: row.nome_completo,
            email: row.email,
            telefone: row.telefone,
            cpf: row.cpf
          },
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
            descricao: row.descricao
          }
        });
      }
    });

    res.json(Object.values(pedidosMap));
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    client.release();
  }
});

// GET /api/pedidos/:id - Detalhes de um pedido específico
router.get('/:id', verifyToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    const result = await client.query(`
      SELECT p.id, p.usuario_id, p.total, p.status, p.data_pedido,
             u.nome_completo, u.email, u.telefone, u.cpf,
             i.id AS item_id, i.quantidade, i.preco_unitario, i.subtotal,
             pr.nome_produto, pr.descricao
      FROM pedidos p
      JOIN usuarios u ON p.usuario_id = u.id
      LEFT JOIN itens_pedido i ON p.id = i.pedido_id
      LEFT JOIN produtos pr ON i.produto_id = pr.id
      WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }

    // Montar objeto do pedido
    const pedido = {
      id: result.rows[0].id,
      usuario: {
        nome_completo: result.rows[0].nome_completo,
        email: result.rows[0].email,
        telefone: result.rows[0].telefone,
        cpf: result.rows[0].cpf
      },
      total: Number(result.rows[0].total),
      status: result.rows[0].status,
      data_pedido: result.rows[0].data_pedido,
      itens: []
    };

    result.rows.forEach(row => {
      if (row.item_id) {
        pedido.itens.push({
          id: row.item_id,
          quantidade: row.quantidade,
          preco_unitario: Number(row.preco_unitario),
          subtotal: Number(row.subtotal),
          produto: {
            nome_produto: row.nome_produto,
            descricao: row.descricao
          }
        });
      }
    });

    res.json(pedido);
  } catch (error) {
    console.error('Erro ao buscar detalhes do pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    client.release();
  }
});

// PATCH /api/admin/pedidos/:id - Atualizar status do pedido
router.patch('/:id', verifyToken, isAdmin, async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await client.query(
      `UPDATE pedidos 
       SET status = $1, atualizado_em = NOW() 
       WHERE id = $2 
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    client.release();
  }
});

module.exports = router;
