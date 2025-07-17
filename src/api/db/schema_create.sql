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
