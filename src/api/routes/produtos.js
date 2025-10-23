
var express = require('express');
var router = express.Router();
const pool = require('../db/config');
const { verifyToken, isAdmin } = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuração do Multer para upload de imagens
const uploadsDir = path.join(__dirname, '../uploads');

// Garante que a pasta uploads existe
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'produto-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas (JPEG, PNG, GIF, WebP)'));
    }
  }
});

// Middleware para servir arquivos estáticos (adicionar no app principal também)
// app.use('/uploads', express.static('uploads'));

/* GET - Buscar todos os produtos (qualquer usuário autenticado) */
router.get('/', async function(req, res, next) {
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
router.get('/nome_produto/:nome_produto', async function(req, res, next) {
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
router.get('/:id', async function(req, res, next) {
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

/* POST - Criar novo produto (só admin) COM IMAGEM */
router.post('/', verifyToken, isAdmin, upload.single('imagem'), async function(req, res) {
  try {
    const { nome_produto, descricao, preco, quantidade, criado_em, atualizado_em } = req.body;
    
    // Verifica campos obrigatórios
    if (!nome_produto || !descricao || !preco || !quantidade) {
      // Se tem arquivo mas deu erro, remove
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Nome, descrição, preço e quantidade são obrigatórios.'
      });
    }

    // Gera URL da imagem se foi enviada
    let imagem = null;
    if (req.file) {
      imagem = `/uploads/${req.file.filename}`;
    }

    const result = await pool.query(
      'INSERT INTO produtos (nome_produto, descricao, preco, quantidade, criado_em, atualizado_em, imagem) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [nome_produto, descricao, preco, quantidade, criado_em || new Date(), atualizado_em || new Date(), imagem]
    );

    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    // Remove arquivo se houve erro
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Erro ao criar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno no servidor.'
    });
  }
});

/* PUT - Atualizar produto (só admin) COM IMAGEM */
router.put('/:id', verifyToken, isAdmin, upload.single('imagem'), async function(req, res, next) {
  try {
    const { id } = req.params;
    const { nome_produto, descricao, preco, quantidade, atualizado_em } = req.body;

    if (!nome_produto || !descricao || !preco || !quantidade) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Todos os dados são obrigatórios.'
      });
    }

    const produtoExistente = await pool.query('SELECT id, imagem FROM produtos WHERE id = $1', [id]);
    if (produtoExistente.rows.length === 0) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    let imagem = produtoExistente.rows[0].imagem;
    
    // Se nova imagem foi enviada
    if (req.file) {
      // Remove imagem antiga se existir
      if (imagem) {
        const oldImagePath = path.join(uploadsDir, path.basename(imagem));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imagem = `/uploads/${req.file.filename}`;
    }

    const result = await pool.query(
      'UPDATE produtos SET nome_produto = $1, descricao = $2, preco = $3, quantidade = $4, atualizado_em = $5, imagem = $6 WHERE id = $7 RETURNING *',
      [nome_produto, descricao, preco, quantidade, atualizado_em || new Date(), imagem, id]
    );

    res.json({
      success: true,
      message: 'Produto atualizado com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/* DELETE - Remover produto (só admin) COM REMOÇÃO DE IMAGEM */
router.delete('/:id', verifyToken, isAdmin, async function(req, res, next) {
  try {
    const { id } = req.params;

    const produtoExistente = await pool.query('SELECT id, imagem FROM produtos WHERE id = $1', [id]);
    if (produtoExistente.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    // Remove imagem se existir
    const imagem = produtoExistente.rows[0].imagem;
    if (imagem) {
      const imagePath = path.join(uploadsDir, path.basename(imagem));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
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