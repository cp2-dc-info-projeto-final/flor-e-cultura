<script>
  import { onMount } from 'svelte';
  import api from '$lib/api';
  import { goto } from '$app/navigation';

  // Variáveis do formulário
  let nome = '';
  let email = '';
  let dataNascimento = '';
  let cpf = '';
  let telefone = '';
  let erro = '';
  let sucesso = ''; // <--- feedback de sucesso
  let id = '';
  let carregando = true;

  // Buscar os dados do usuário ao carregar a página (com axios.get)
  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    id = urlParams.get('id');
  
    try {
      const response = await api.get(`http://localhost:3000/users/${id}`);
      const user = response.data.data || response.data;
      nome = user.nome_completo;
      email = user.email;
      dataNascimento = user.data_nascimento ? new Date(user.data_nascimento).toISOString().split('T')[0] : '';
      cpf = user.cpf;
      telefone = user.telefone;
    } catch (err) {
      console.error('Erro ao buscar dados do usuário:', err);
      if (err.response) {
          erro = `Erro do servidor: ${err.response.data.message || err.response.status}`;
      } else if (err.request) {
          erro = 'Erro ao conectar com o servidor (sem resposta)';
      } else {
          erro = `Erro: ${err.message}`;
      }
    }
    finally {
      carregando = false;
    }
  });

  // Atualizar dados do usuário (com api.put)
  async function editarUsuario() {
    // Limpa mensagens anteriores ao tentar editar
    erro = '';
    sucesso = '';

    const usuario = {
      nome_completo: nome,
      email,
      cpf,
      telefone,
      data_nascimento: dataNascimento,
      tipo_usuario: 1
    };

    try {
      const response = await api.put(`http://localhost:3000/users/${id}`, usuario);
      const result = response.data;

      if (result.success || result) {
        sucesso = 'Usuário atualizado com sucesso!';
      } else {
        erro = result.message || 'Erro desconhecido';
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      if (error.response) {
          erro = error.response.data.message || 'Não foi possível atualizar';
      } else if (error.request) {
          erro = 'Erro ao conectar com o servidor.';
      } else {
          erro = error.message;
      }
    }
  }
</script>

{#if !carregando}
<section>
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-white dark:border-gray-700">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-black">
                    Edite seus dados 
                </h1>
                {#if erro}
                  <div class="text-red-700 bg-red-100 border border-red-400 rounded px-4 py-2">
                    {erro}
                  </div>
                {/if}
                {#if sucesso}
                  <div class="text-green-700 bg-green-100 border border-green-400 rounded px-4 py-2">
                    {sucesso}
                  </div>
                {/if}
                <form on:submit|preventDefault={editarUsuario} class="space-y-4 md:space-y-6" action="#">
                    <div>
                        <label for="nome" class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Nome</label>
                        <input type="text" name="nome" id="nome" bind:value={nome} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-pink-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-pink-800 dark:focus:border-pink-800" placeholder="Fulano Beltrano Silva" required>
                    </div>
                    <div>
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Email</label>
                        <input type="email" name="email" id="email" bind:value={email} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-pink-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-pink-800 dark:focus:border-pink-800" placeholder="nome@compania.com" required>
                    </div>
                    <div>
                        <label for="data-nascimento" class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Data de nascimento</label>
                        <input type="date" name="data-nascimento" id="data-nascimento" bind:value={dataNascimento} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-pink-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-pink-800 dark:focus:border-pink-800" required>
                    </div>
                    <div>
                        <label for="cpf" class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">CPF</label>
                        <input type="text" bind:value={cpf} name="cpf" id="cpf" placeholder="Seu CPF" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-pink-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-pink-800 dark:focus:border-pink-800" required>
                    </div>
                    <div>
                        <label for="telefone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">telefone</label>
                        <input type="text" bind:value={telefone} name="telefone" id="telefone" placeholder="Seu telefone" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-pink-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-pink-800 dark:focus:border-pink-800" required>
                    </div>
                    
                    <button id="cadastro" type="submit" class="w-full text-white bg-green-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Confirme seus dados</button>
                </form>
            </div>
        </div>
    </div>
  </section>
{:else}
  <p class="text-center text-white">Carregando dados do usuário...</p>
{/if}