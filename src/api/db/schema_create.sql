CREATE TABLE usuario (
    id bigint GENERATED ALWAYS AS IDENTITY,
    login text NOT NULL,
    email text NOT NULL
);

INSERT INTO usuario (login, email) VALUES
('hermenegildo', 'hermenegildo@email.com'),
('zoroastra', 'zoroastra@email.com');


CREATE IF NOT EXISTS TABLE usuarios (
  id bigint GENERATED ALWAYS AS IDENTITY,
  nome_completo TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  telefone VARCHAR(15) NOT NULL,
  data_nascimento DATE NOT NULL,
  tipo_usuario TEXT NOT NULL DEFAULT 'cliente'
);
