<script lang="ts">
  import api from '$lib/api'; // API backend
  import { goto } from '$app/navigation'; // navegação
  let nome = '';
  let email = '';
  let dataNascimento = '';
  let cpf = '';
  let telefone = '';
  let senha = '';
  let confirmarSenha = '';

  let mensagemErro = '';
  let mensagemSucesso = '';

  // 👁️ Controle da visibilidade das senhas
  let senhaVisivel = false;
  let confirmarSenhaVisivel = false;

  async function cadastrarUsuario() {
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
      const response = await api.post('/users', usuario);

      mensagemSucesso = 'Usuário cadastrado com sucesso!';
      nome = '';
      email = '';
      dataNascimento = '';
      cpf = '';
      telefone = '';
      senha = '';
      confirmarSenha = '';

    } catch (e: any) {
      mensagemErro = e.response?.data?.message || 'Erro ao salvar usuário.';
    }
  }
</script>

<section>
  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
    <div class="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-white dark:border-gray-700">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-black">
          Cadastre-se
        </h1>

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
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500 dark:bg-pink-200 dark:border-gray-600 dark:text-white" />
          </div>

          <div>
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
            <input type="email" id="email" bind:value={email} required placeholder="email@exemplo.com"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500 dark:bg-pink-200 dark:border-gray-600 dark:text-white" />
          </div>

          <div>
            <label for="data-nascimento" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Data de nascimento</label>
            <input type="date" id="data-nascimento" bind:value={dataNascimento} required
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500 dark:bg-pink-200 dark:border-gray-600 dark:text-white" />
          </div>

          <div>
            <label for="cpf" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">CPF</label>
            <input type="text" id="cpf" bind:value={cpf} required placeholder="000.000.000-00"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500 dark:bg-pink-200 dark:border-gray-600 dark:text-white" />
          </div>

          <div>
            <label for="telefone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Telefone</label>
            <input type="text" id="telefone" bind:value={telefone} required placeholder="(00) 00000-0000"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500 dark:bg-pink-200 dark:border-gray-600 dark:text-white" />
          </div>

          <!-- Campo senha com botão de olho -->
          <div>
            <label for="senha" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha</label>
            <div class="relative">
              <input
                type={senhaVisivel ? 'text' : 'password'}
                id="senha"
                bind:value={senha}
                required
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 pr-10 focus:ring-blue-500 focus:border-blue-500 dark:bg-pink-200 dark:border-gray-600 dark:text-white"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-2 flex items-center text-gray-500"
                on:click={() => senhaVisivel = !senhaVisivel}
                tabindex="-1"
              >
                {#if senhaVisivel}
                 
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
                
                {:else}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                
                {/if}
              </button>
            </div>
          </div>

          <!-- Campo confirmar senha com botão de olho -->
          <div>
            <label for="confirmarSenha" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirme sua senha</label>
            <div class="relative">
              <input
                type={confirmarSenhaVisivel ? 'text' : 'password'}
                id="confirmarSenha"
                bind:value={confirmarSenha}
                required
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 pr-10 focus:ring-blue-500 focus:border-blue-500 dark:bg-pink-200 dark:border-gray-600 dark:text-white"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-2 flex items-center text-gray-500"
                on:click={() => confirmarSenhaVisivel = !confirmarSenhaVisivel}
                tabindex="-1"
              >
                {#if confirmarSenhaVisivel}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                
                {:else}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
                
                {/if}
              </button>
            </div>
          </div>

          <button type="submit"
            class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-pink-400 dark:hover:bg-pink-700 dark:focus:ring-blue-800">
            Criar conta
          </button>

          <p class="text-sm font-light text-gray-500 dark:text-gray-400">
            Já possui uma conta? <a href="/login" class="font-medium text-blue-600 hover:underline dark:text-green-500">Faça login</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</section>
