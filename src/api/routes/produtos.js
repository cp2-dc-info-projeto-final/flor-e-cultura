var express = require('express');
var router = express.Router();
const pool = require('../db/config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verifyToken, isAdmin } = require('../middlewares/auth');

/* GET - Buscar todos os produtos */
router.get('/', verifyToken, isAdmin, async function(req, res, next) {
  try {
    console.log('funcionou moisesssssssssssss');
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

/* GET parametrizado - Buscar usuário autenticado */
/*router.get('/me', verifyToken, async function(req, res) {
  try {
    // parâmetro obtido do token pelo middleware
    const id = req.user.id;
    const result = await pool.query('SELECT id, email, tipo_usuario FROM usuarios WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      // http status 404 - Not Found
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    // http status 500 - Internal Server Error
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}); */

/* GET parametrizado - Buscar produtos por ID */
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

/* GET parametrizado - Buscar produto por nome */
router.get('/nome_produto/:nome_produto', async function(req, res, next) {
  try {
    const { nome_produto } = req.params;
    const result = await pool.query('SELECT * FROM produtos WHERE nome_produto LIKE $1', ['%'+nome_produto+'%']);
    
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

/* POST - Criar novo produto */
router.post('/', async function(req, res) {
  try {
    console.log("entrou");
    const { nome_produto, descricao ,preco, quantidade, criado_em, atualizado_em} = req.body;
    
    // Validação básica
    if (!nome_produto || !descricao || !preco || !quantidade ||  !criado_em || !atualizado_em) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos do produto são obrigatórios.'
      });
    }

    // Verificar se o email já existe
    /*const emailExistente = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (emailExistente.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email já cadastrado.'
      });
    }*/

     // Hash da senha
     //const hashedPassword = await bcrypt.hash(senha, 12);

     
    // Verificar se o CPF já existe
   /* const cpfExistente = await pool.query('SELECT id FROM usuarios WHERE cpf = $1', [cpf]);
    if (cpfExistente.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'CPF já cadastrado.'
      });
    }*/

    // Inserir novo produto
    const result = await pool.query(
      'INSERT INTO produtos (nome_produto, descricao ,preco, quantidade, criado_em, atualizado_em) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nome_produto, descricao ,preco, quantidade, criado_em, atualizado_em]
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

/* POST - Autenticar usuário */
/*router.post('/login', async function(req, res) {
  try {
    const { email, senha } = req.body;
    // obtém o usuário do banco de dados
    const result = await pool.query(`SELECT 
      id, email, senha as passwordHash, tipo_usuario
      FROM usuarios 
      WHERE email = $1`, [email]);

    /*
     tratar login inválido igual senha incorreta
     confere maior segurança por não expor indiretamente
     se existe uma conta com aquele login 
    

    if (result.rows.length === 0) {
      // https status 401 - unauthorized
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Objeto de usuário
    const user = result.rows[0];

    /*
     verifica a senha passando senha do forntend e hash armazenada
     a partir da hash não se pode descobrir a senha
     mas fornecendo a senha dá para aplicar a hash e ver coincidem
    
    
    bcrypt.compare(senha, user.passwordhash, (err, isMatch) => {
      if (err) {
        console.error('Erro no bcrypt:', err);
        // https status 500 - internal server error
        return res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
      
      if (!isMatch) {
        // https status 401 - unauthorized
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      // Cria o token com as informações do usuário logado e sua chave pública
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          // tipo do usuário, que vem do banco
          tipo_usuario: user.tipo_usuario 
          // a senha não entra no token para não ser exposta
        }, 
        process.env.JWT_SECRET, //chave secreta, nunca exponha!! >>> PERIGO <<<
        { expiresIn: '1h' } 
      );


      // O token contém as informções do usuário com a chave para posterior validação
      return res.status(200).json({
        success: true,
        token: token,
        message: 'Autenticado com sucesso!'
      });
    });

  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    // http status 500 - Internal Server Error
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
  
});


/* PUT - Atualizar produtos */
router.put('/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    const {
      nome_produto,
      descricao,
      preco, 
      quantidade, 
      criado_em,  
      atualizado_em 
    } = req.body;

    // Validação básica
    if (!nome_produto || !descricao || !preco || !quantidade || !criado_em || !atualizado_em) {
      return res.status(400).json({
        success: false,
        message: 'Os dados são obrigatórios'
      });
    }

    // Verificar se o produto existe
    const userExists = await pool.query('SELECT id FROM produtos WHERE id = $1', [id]);
    if (userExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    /* Verificar se o login já está em uso por outro usuário
    const existingUser = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1 AND id != $2',
      [email, id]
    );
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Login já está em uso por outro usuário'
      });
    }
*/
    // Atualizar o produto
    const result = await pool.query(
      'UPDATE produtos SET nome_produto = $1, descricao = $2, preco = $3, quantidade = $4, criado_em = $5, atualizado_em  = $6 WHERE id = $7 RETURNING *',
      [nome_produto, descricao ,preco, quantidade, criado_em, atualizado_em, id]
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


/* DELETE - Remover produto */
router.delete('/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    
    // Verificar se o usuário existe
    const userExists = await pool.query('SELECT id FROM produtos WHERE id = $1', [id]);
    if (userExists.rows.length === 0) {
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
