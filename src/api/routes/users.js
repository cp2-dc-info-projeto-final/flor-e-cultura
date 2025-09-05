var express = require('express');
var router = express.Router();
const pool = require('../db/config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verifyToken, isAdmin } = require('../middlewares/auth');

/* GET - Buscar todos os usuários */
router.get('/', verifyToken, isAdmin, async function(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM usuarios ORDER BY id');
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/* GET parametrizado - Buscar usuário autenticado */
router.get('/me', verifyToken, async function(req, res) {
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
});

/* GET parametrizado - Buscar usuário por ID */
router.get('/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
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
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/* GET parametrizado - Buscar usuário por nome */
router.get('/nome/:nome', async function(req, res, next) {
  try {
    const { nome } = req.params;
    const result = await pool.query('SELECT * FROM usuarios WHERE nome_completo LIKE $1', ['%'+nome+'%']);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: result.rows
   });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/* POST - Criar novo usuário */
router.post('/', verifyToken, isAdmin, async function(req, res) {
  try {
    console.log("entrou");
    const { nome_completo, email, senha, cpf, telefone, data_nascimento, tipo_usuario } = req.body;
    
    // Validação básica
    if (!nome_completo || !email || !cpf) {
      return res.status(400).json({
        success: false,
        message: 'Nome, email e CPF são obrigatórios.'
      });
    }

    // Verificar se o email já existe
    const emailExistente = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (emailExistente.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email já cadastrado.'
      });
    }

     // Hash da senha
     const hashedPassword = await bcrypt.hash(senha, 12);

     
    // Verificar se o CPF já existe
    const cpfExistente = await pool.query('SELECT id FROM usuarios WHERE cpf = $1', [cpf]);
    if (cpfExistente.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'CPF já cadastrado.'
      });
    }

    // Inserir novo usuário
    const result = await pool.query(
      'INSERT INTO usuarios (nome_completo, email, senha, cpf, telefone, data_nascimento, tipo_usuario) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [nome_completo, email, hashedPassword, cpf, telefone, data_nascimento, tipo_usuario]
    );
    
    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno no servidor.'
    });
  }
});

/* POST - Autenticar usuário */
router.post('/login', async function(req, res) {
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
    */
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
    */
    
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

      //ADICIONADO POR JUDIS
      res.cookie('token', token, {
        httpOnly: true,
        secure: false, // true em produção com HTTPS
        sameSite: 'Lax', // ou 'None' se for necessário para domínios/portas cruzadas
        maxAge: 1000 * 60 * 60 // 1h
      });

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



/* PUT - Atualizar usuário */
router.put('/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    const {
      nome_completo,
      email,
      senha,
      cpf,
      telefone,
      data_nascimento,
      tipo_usuario
    } = req.body;

    // Validação básica
    if (!nome_completo || !email || !senha || !cpf || !telefone || !data_nascimento || !tipo_usuario) {
      return res.status(400).json({
        success: false,
        message: 'Os dados são obrigatórios'
      });
    }

    // Verificar se o usuário existe
    const userExists = await pool.query('SELECT id FROM usuarios WHERE id = $1', [id]);
    if (userExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verificar se o login já está em uso por outro usuário
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

    // Atualizar o usuário
    const result = await pool.query(
      'UPDATE usuarios SET nome_completo = $1, email = $2, senha = $3, cpf = $4, telefone = $5, data_nascimento = $6, tipo_usuario = $7 WHERE id = $8 RETURNING *',
      [nome_completo, email, senha, cpf, telefone, data_nascimento, tipo_usuario, id]
    );

    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});


/* DELETE - Remover usuário */
router.delete('/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    
    // Verificar se o usuário existe
    const userExists = await pool.query('SELECT id FROM usuarios WHERE id = $1', [id]);
    if (userExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    
    res.json({
      success: true,
      message: 'Usuário deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
