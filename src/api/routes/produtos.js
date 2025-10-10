
var express = require('express');
var router = express.Router();
const pool = require('../db/config');
const { verifyToken, isAdmin } = require('../middlewares/auth');

/* GET - Buscar todos os produtos (qualquer usuário autenticado) */
router.get('/', verifyToken, async function(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM produtos ORDER BY id');
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/* GET parametrizado - Buscar produto por nome (qualquer usuário autenticado) */
router.get('/nome_produto/:nome_produto', verifyToken, async function(req, res, next) {
  try {
    const { nome_produto } = req.params;
    const result = await pool.query('SELECT * FROM produtos WHERE nome_produto LIKE $1', ['%' + nome_produto + '%']);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/* GET parametrizado - Buscar produto por ID (qualquer usuário autenticado) */
router.get('/:id', verifyToken, async function(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM produtos WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/* POST - Criar novo produto (só admin) */
router.post('/', verifyToken, isAdmin, async function(req, res) {
  try {
    const { nome_produto, descricao, preco, quantidade, criado_em, atualizado_em } = req.body;
    
    if (!nome_produto || !descricao || !preco || !quantidade || !criado_em || !atualizado_em) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos do produto são obrigatórios.'
      });
    }
    
    const result = await pool.query(
      'INSERT INTO produtos (nome_produto, descricao, preco, quantidade, criado_em, atualizado_em) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nome_produto, descricao, preco, quantidade, criado_em, atualizado_em]
    );
    
    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno no servidor.'
    });
  }
});

/* PUT - Atualizar produto (só admin) */
router.put('/:id', verifyToken, isAdmin, async function(req, res, next) {
  try {
    const { id } = req.params;
    const { nome_produto, descricao, preco, quantidade, criado_em, atualizado_em } = req.body;

    if (!nome_produto || !descricao || !preco || !quantidade || !criado_em || !atualizado_em) {
      return res.status(400).json({
        success: false,
        message: 'Todos os dados são obrigatórios.'
      });
    }

    const produtoExistente = await pool.query('SELECT id FROM produtos WHERE id = $1', [id]);
    if (produtoExistente.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    const result = await pool.query(
      'UPDATE produtos SET nome_produto = $1, descricao = $2, preco = $3, quantidade = $4, criado_em = $5, atualizado_em = $6 WHERE id = $7 RETURNING *',
      [nome_produto, descricao, preco, quantidade, criado_em, atualizado_em, id]
    );

    res.json({
      success: true,
      message: 'Produto atualizado com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/* DELETE - Remover produto (só admin) */
router.delete('/:id', verifyToken, isAdmin, async function(req, res, next) {
  try {
    const { id } = req.params;

    const produtoExistente = await pool.query('SELECT id FROM produtos WHERE id = $1', [id]);
    if (produtoExistente.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    await pool.query('DELETE FROM produtos WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Produto deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
