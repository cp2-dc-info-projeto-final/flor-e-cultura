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

INSERT INTO usuarios (nome_completo, email, senha, cpf, telefone, data_nascimento, tipo_usuario) VALUES
-- senha efelantinho
('hermenegildo', 'hermenegildo@email.com', '$2a$12$f2c.uHGHS4drfaz6HR870OLamkarD57kI.gkr4//Vbbp0vN9IrFfG','000', '213', '2002-02-03', 'admin'),
('zoroastra', 'zoroastra@email.com', '$2a$12$f2c.uHGHS4drfaz6HR870OLamkarD57kI.gkr4//Vbbp0vN9IrFfG', '909', '888', '2011-04-09', 'user');