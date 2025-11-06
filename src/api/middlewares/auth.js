const jwt = require('jsonwebtoken');

// Middleware para verificar se o usuário está autenticado
const verifyToken = (req, res, next) => {
  /* 
    Header do tipo
    Authorization: Bearer <token>
    Split ' ' separa o 'Bearer' do token
  */
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    // http status 401 = Unauthorized
    console.log("Foi acionado no verifyToken");
    return res.status(401).json({ message: 'Token não fornecido' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    /*
    em um middleware, o next é análogo ao return
    porém ao invés de concluir a requisição
    ele passa para o próximo middleware
    */
    next();
  } catch (error) {
    // http status 401 = Unauthorized
    return res.status(401).json({ message: 'Token inválido' });
  }
};

// Middleware para verificar se o usuário é admin
const isAdmin = (req, res, next) => {
  console.log(req.user);
  if (req.user && req.user.tipo_usuario === 'admin') {
    next();
  } else {
    // http status 403 - Forbidden
    console.log("Foi acionado no isAdmin");
    return res.status(403).json({ message: 'Acesso negado: requer privilégios de administrador' });
  }
};

module.exports = { verifyToken, isAdmin};