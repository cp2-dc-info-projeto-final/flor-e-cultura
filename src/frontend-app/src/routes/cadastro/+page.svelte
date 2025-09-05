<script>
  let nome = '';
  let email = '';
  let dataNascimento = '';
  let cpf = '';
  let telefone = '';
  let senha = '';
  let confirmarSenha = '';

  let mensagemErro = '';
  let mensagemSucesso = '';

  async function cadastrarUsuario() {
    // Limpa mensagens anteriores
    mensagemErro = '';
    mensagemSucesso = '';

    if (senha !== confirmarSenha) {
      mensagemErro = 'As senhas não coincidem!';
      return;
    }

    const usuario = {
      nome_completo: nome,
      email,
      senha,
      cpf,
      telefone,
      data_nascimento: dataNascimento,
      tipo_usuario: 1
    };

    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(usuario) 
      });

      const result = await response.json();

      if (response.ok && result.success) {
        mensagemSucesso = 'Usuário cadastrado com sucesso!';
        // Limpa os campos
        nome = '';
        email = '';
        dataNascimento = '';
        cpf = '';
        telefone = '';
        senha = '';
        confirmarSenha = '';
      } else {
        mensagemErro = result.message || 'Erro ao cadastrar usuário.';
      }
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      mensagemErro = 'Erro ao conectar com o servidor.';
    }
  }
</script>

<section>
  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
    <div class="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Cadastre-se
        </h1>

        <!-- MENSAGENS -->
        {#if mensagemErro}
          <div class="p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
            {mensagemErro}
          </div>
        {/if}

        {#if mensagemSucesso}
          <div class="p-3 text-sm text-green-700 bg-green-100 rounded-lg border border-green-300">
            {mensagemSucesso}
          </div>
        {/if}

        <form on:submit|preventDefault={cadastrarUsuario} class="space-y-4 md:space-y-6">
          <div>
            <label for="nome" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome</label>
            <input type="text" id="nome" bind:value={nome} required placeholder="Fulano da Silva"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>

          <div>
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
            <input type="email" id="email" bind:value={email} required placeholder="email@exemplo.com"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>

          <div>
            <label for="data-nascimento" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Data de nascimento</label>
            <input type="date" id="data-nascimento" bind:value={dataNascimento} required
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>

          <div>
            <label for="cpf" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">CPF</label>
            <input type="text" id="cpf" bind:value={cpf} required placeholder="000.000.000-00"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>

          <div>
            <label for="telefone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Telefone</label>
            <input type="text" id="telefone" bind:value={telefone} required placeholder="(00) 00000-0000"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>

          <div>
            <label for="senha" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha</label>
            <input type="password" id="senha" bind:value={senha} required placeholder="••••••••"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>

          <div>
            <label for="confirmarSenha" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirme sua senha</label>
            <input type="password" id="confirmarSenha" bind:value={confirmarSenha} required placeholder="••••••••"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>

          <button type="submit"
            class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Criar conta
          </button>

          <p class="text-sm font-light text-gray-500 dark:text-gray-400">
            Já possui uma conta? <a href="/login" class="font-medium text-blue-600 hover:underline dark:text-blue-500">Faça login</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</section>
