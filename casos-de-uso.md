## Casos de Uso:

### Caso de uso 1: Cadastro de usuário.

#### Atores:

- Usuário.
  
#### Fluxo principal:

- O usuário seleciona a opção “Criar conta”.
  
- O sistema leva o usuário até a tela de registro contendo um formulário.
  
- O usuário preenche os campos do formulário (informando e-mail e criando uma senha).
  
- O sistema consulta o banco de dados para verificar a disponibilidade das informações fornecidas.
  
- O banco de dados retorna uma confirmação positiva.
  
- O sistema realiza o cadastro, salvando os dados do novo usuário.
  
- O sistema encaminha o usuário para a página principal do site.

#### Fluxo Alternativo A: O email já está cadastrado

- O sistema apresenta formulário de cadastro.
 
- O usuário preenche os campos.

- O sistema consulta o banco de dados.

- O banco de dados retorna que o email informado já está em uso.

- O sistema exibe uma mensagem de erro informando que o email digitado já está em uso.

- O usuário digita um novo email no formulário e tenta novamente.

- O sistema registra as informações no banco de dados e informa usuário.

#### Fluxo Alternativo B: Campo vazio

- O sistema apresenta formulário de cadastro.

- O usuário não preenche um dos campos e clica no botão de "Criar Conta"

- O sistema analisa os campos de cadastro e pede que o usuário preencha todos os campos.

- O usuário preenche todos os campos  e clica no botão de "Criar Conta".

- O sistema registra as informações no banco de dados e informa usuário.


#### Fluxo Alternativo C: Senha diferente dos padrões exigidos

- O sistema apresenta formulário de cadastro.

- O usuário insere uma senha.

- O sistema analisa se a senha está dentro dos padrões exigidos  (mínimo 8 caracteres e 1 símbolo)

- O sistema exibe uma mensagem de erro e informa ao usuário que a senha está fora dos padrões.

- O sistema exibe uma mensagem sugerindo que o usuário coloque a senha correta.
  
- O sistema registra as informações no banco de dados e informa usuário.

### Caso de Uso 2: Login.

#### Atores: 

- Usuário

#### Fluxo principal:

- O usuário seleciona a opção "Login".

- O sistema leva o usuário até a tela de preenchimento de senha e email.

- Usuário preenche os campos da tela.

- O sistema consulta o banco de dados para a confirmação dos dados inseridos.

- O banco de dados retorna uma confirmação positiva.

- O sistema encaminha o usuário para a página principal do site.

#### Fluxo Alternativo A: Email inválido

- O sistema apresenta a página de formulário de Login.

- O usuário insere um email.

- O sistema consulta o banco de dados.

- O banco de dados retorna que o email informado já está em uso.

- O sistema exibe uma mensagem dizendo que o email está inválido e sugere que o usuário digite outro email.

#### Fluxo Alternativo B: Senha inválida

- O sistema apresenta a página de formulário de Login.

- O usuário insere uma senha.

- O sistema consulta o banco de dados.

- O banco de dados retorna que a senha informada está inválida.

- O sistema exibe uma mensagem dizendo que a senha está invalida e sugere que o usuário insira uma senha correta.

#### Fluxo Alternativo C: Campo vazio

- O sistema apresenta a página de formulário de Login.

- O usuário não preenche um dos campos e clica no botão de "Login".

- O sistema analisa os campos de cadastro e pede que o usuário preencha todos os campos.

- O usuário preenche todos os campos (insere email e senha)  e clica no botão de "Login".

- O sistema verifica no banco de dados se as informações estão corretas.

- O banco de dados retorna verdadeiro.

- O sistema redireciona o usuário para a página inicial do site.

### Caso de Uso 3: Excluir usuário.

#### Atores: 

- Usuário

#### Fluxo principal: 

- O usuário acessa o menu do seu perfil com as configurações da sua conta.

- O usuário aperta o botão excluir conta.

- O sistema solicita a senha do usuário para proseguir com a exclusão.
  
- O usário digita a senha.
  
- O sistema analisa a veracidade da senha no banco de dados.
  
- O banco de dados retorna uma confirmação positiva.
  
- O sistema pergunta se quer confirmar a exclusão.
  
- O usuário aperta o botão confirmar.
  
- O sistema apaga os dados do usuário no banco de dados.
  
- O sistema apresenta mensagem de sucesso.
  
- O sistema realoca o usuário para a página de login e cadastro.

#### Fluxo Alternativo A: Senha incorreta.

- O usuário acessa o menu do seu perfil com as configurações da sua conta e aperta no botão "Excluir conta".

- O sistema pede que o usuário insira senha para continuar.

- O usuário insere a senha.

- O sistema verifica no banco de dados se a senha está correta.

- O banco de dados retorna negativo.

- O sistema envia uma mensagem de erro e pede que ao usuário que ele insira a senha correta.

- O usuário insere a senha correta.

- O sistema verifica no banco de dados se a senha está correta.

- O banco de dados retorna uma confirmação positiva.

- O sistema envia uma mensagem de sucesso e envia o usuário para a página de cadastro e login. 

### Caso de Uso 4: Editar dados de cadastro.

#### Atores: 

- Usuário

#### Fluxo principal: 

- O usuário acessa o menu do seu perfil com as configurações da sua conta.

- O usuário aperta o botão "editar dados de cadastro da conta".
  
- O sistema exibe os dados de cadastro do usuário.

- O usuário edita dados do seu cadastro e aperta o botão confirmar.
  
- O sistema edita os dados do usuário no banco de dados.

  ### Caso de Uso 5: Busca de produtos.

#### Atores: 

- Usuário

#### Fluxo principal: 

- O usuário aperta na barra de pesquisa.

- O usuário digita o tipo de flor que deseja.

- O usuário aperta no botão "Enter".

- O sistema consulta o banco de dados.

- O banco retorna a flor desejada.

- A busca é finalizada.
 
 ### Caso de Uso 6: Categorias.

#### Atores: 

- Usuário

#### Fluxo principal:  

- O usuário seleciona o menu "Categorias".

- O sistema carrega a lista de categorias disponíveis.

- O usuário clica na categoria desejada.

- O sistema busca os produtos pertecentes àquela categoria no banco de dados.

- O sistema exibe os produtos filtrados pela categoria selecionada com informações.

 ### Caso de Uso 7: Carrinho de compras.

#### Atores: 

- Usuário

#### Fluxo principal:  

- O usuário clica no ícone do "carrinho de compras".

- O sistema redireciona o usuário para a página contendo os itens desejados.

- O usuário pode iniciar o processo de compra dos produtos desejados.

- O usuário preenche o cadastro com suas informações de endereço.

- O usuário seleciona uma forma de pagamento.
  
- O usuário finaliza a compra e é redirecionado para a pagina inicial.

 ### Caso de Uso 8: Pagina de pedidos.

#### Atores: 

- Usuário

#### Fluxo principal:  

- O usuário clica no icone da pagina de pedidos.

- O sistema redireciona o usuário para a pagina contendo informações de seus pedidos.

- O usuário consulta seus pedidos e volta para pagina inicial.

 ### Caso de Uso 9: Logout

#### Atores: 

- Usuário

#### Fluxo principal:  

- O usuário acessa o menu do seu perfil com as configurações da sua conta e aperta o botão de "Logout".

- O sistema apresenta uma mensagem perguntando "Quer confirmar o Logout?".

- O usuário confirma.

- O sistema apaga o login do usuário.

- O sistema realoca o usuário à página inicial.

### Caso de Uso 10: Gerenciar Catálogo de produtos.

#### Atores: 

- Usuário

#### Fluxo principal: 

- O administrador acessa o sistema.

- Seleciona a opção "Catálogo de Produtos".

- Visualiza a lista de produtos cadastrados.

- Clica em "Adicionar Produto".

- Preenche as informações do produto (nome, descrição, preço, imagem, categoria).

- Clica em "Salvar".

- O sistema adiciona o novo produto ao catálogo.

### Caso de Uso 11: Gerenciar Categoria.

#### Atores:

- Admninistrador

#### Fluxos principal:

- O administrador acessa o sistema.

- Seleciona a opção "Categorias".

- Visualiza as categorias existentes.

- Clica em "Adicionar Categoria".

- Insere o nome da nova categoria.

- Clica em "Salvar".

- O sistema cadastra a nova categoria.

### Caso de Uso 12: Editar pedidos.

#### Atores:

- Administrador

#### Fluxo principal: 

- O administrador acessa o sistema.

- O administrador seleciona "Pedidos" e visualiza.

- O administrador clica em um pedido para ver detalhes.

- O administrador atualiza o status do pedido, por exempo, "em entrega" ou "concluído".

- O sistema registra a atualização.

### Caso de Uso 13: Gerenciar clientes. 

#### Atores: 

- Administrador

#### Fluxo principal: 

- O administrador acessa o sistema.

- O administrador vai até a seção "Clientes".

- O administrador visualiza a lista de clientes cadastrados.

- O administrador clica sobre um cliente para ver detalhes.

- O administrador pode optar por editar ou excluir o cadastro.

### Caso de Uso 14: Acessar relatório de vendas.

#### Atores: 

- Administrador

#### Fluxo principal:

- O administrador acessa o sistema.

- O administrador seleciona "Relatórios" no menu.

- O administrador escolhe o período desejado.

- O sistema exibe o relatório com as vendas no período.
