DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome_completo TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  telefone VARCHAR(15) NOT NULL,
  data_nascimento DATE NOT NULL,
  tipo_usuario TEXT NOT NULL DEFAULT 'cliente'
);

CREATE TABLE produtos (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome_produto TEXT NOT NULL,
  descricao TEXT NOT NULL,
  preco DECIMAL(10, 2) NOT NULL, 
  quantidade INT NOT NULL DEFAULT 0,   -- Estoque disponível
  criado_em TIMESTAMP DEFAULT NOW(),  -- Data de criação
  atualizado_em TIMESTAMP DEFAULT NOW(), -- Data da última atualização
  imagem TEXT;
   categoria TEXT
);

CREATE TABLE carrinho (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  produto_id bigint NOT NULL,
  quantidade INT NOT NULL DEFAULT 1,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_produto
    FOREIGN KEY(produto_id) REFERENCES produtos(id)
    ON DELETE CASCADE
);

-- Tabela de pedidos
CREATE TABLE pedidos (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  usuario_id BIGINT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDENTE',
  data_pedido TIMESTAMP DEFAULT NOW(),
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW(),
  
  -- Chave estrangeira para usuários
  CONSTRAINT fk_pedido_usuario
    FOREIGN KEY (usuario_id) 
    REFERENCES usuarios(id)
    ON DELETE CASCADE
);

-- Tabela de itens do pedido
CREATE TABLE itens_pedido (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  pedido_id BIGINT NOT NULL,
  produto_id BIGINT NOT NULL,
  quantidade INT NOT NULL,
  preco_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  criado_em TIMESTAMP DEFAULT NOW(),
  
  -- Chaves estrangeiras
  CONSTRAINT fk_item_pedido
    FOREIGN KEY (pedido_id) 
    REFERENCES pedidos(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_item_produto
    FOREIGN KEY (produto_id) 
    REFERENCES produtos(id)
    ON DELETE CASCADE
);


INSERT INTO usuarios (nome_completo, email, senha, cpf, telefone, data_nascimento, tipo_usuario) VALUES
-- senha efelantinho
('hermenegildo', 'hermenegildo@email.com', '$2a$12$f2c.uHGHS4drfaz6HR870OLamkarD57kI.gkr4//Vbbp0vN9IrFfG','000', '213', '2002-02-03', 'admin'),
('zoroastra', 'zoroastra@email.com', '$2a$12$f2c.uHGHS4drfaz6HR870OLamkarD57kI.gkr4//Vbbp0vN9IrFfG', '909', '888', '2011-04-09', 'cliente');