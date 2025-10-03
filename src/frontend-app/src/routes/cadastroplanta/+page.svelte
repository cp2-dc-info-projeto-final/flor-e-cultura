<script lang="ts">
    import api from '$lib/api'; // API backend
    import { goto } from '$app/navigation'; // navegação
    let nome_produto = '';
    let descricao = '';
    let preco = '';
    let quantidade = '';
    let criado_em = '';
    let atualizado_em = '';
  
    let mensagemErro = '';
    let mensagemSucesso = '';
  
    async function cadastrarProdutos() {
      mensagemErro = '';
      mensagemSucesso = '';
  
      const produtos = {
        nome_produto: nome_produto,
        descricao,
        preco,
        quantidade,
        criado_em,
        atualizado_em

      };
  
      try {
        const response = await api.post('/produtos', produtos);
  
        mensagemSucesso = 'Produto cadastrado com sucesso!';
        nome_produto = '';
        descricao = '';
        preco = '';
        quantidade = '';
        criado_em = '';
        atualizado_em = '';
  
      } catch (e: any) {
        mensagemErro = e.response?.data?.message || 'Erro ao salvar produto.';
      }
    }
  </script>
  
  <section>
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div class="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Cadastre produto
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
  
          <form on:submit|preventDefault={cadastrarProdutos} class="space-y-4 md:space-y-6">
            <div>
              <label for="nome_produto" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome do produto</label>
              <input type="text" id="nome_produto" bind:value={nome_produto} required placeholder="Margarida"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
  
            <div>
              <label for="descricao" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descrição</label>
              <input type="text" id="descricao" bind:value={descricao} required placeholder="Planta com flor"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
  
            <div>
              <label for="preco" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Preço</label>
              <input type="string" id="preco" bind:value={preco} required
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
  
            <div>
              <label for="quantidade" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Quantidade</label>
              <input type="text" id="quantidade" bind:value={quantidade} required placeholder="10"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
  
            <div>
              <label for="criado_em" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Criado em:</label>
              <input type="date" id="criado_em" bind:value={criado_em} required placeholder="00/00/0000"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>

            <div>
                <label for="atualizado_em" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Atualizado em:</label>
                <input type="date" id="atualizado_em" bind:value={atualizado_em} required placeholder="00/00/0000"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
  
  
            
            <button type="submit"
              class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Criar Produto
            </button>
  
          </form>
        </div>
      </div>
    </div>
  </section>
  