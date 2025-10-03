<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import api from '$lib/api';
  
    type Produto = {
      id: number;
      nome_produto: string;
      descricao: string;
      preco: string;
      quantidade: string;
      criado_em: string;
      atualizado_em: string;
    };
  
    let produtos: Produto[] = [];
    let erro = '';
    let search = '';
  
    // Buscar todos os produtos
    async function buscarProdutos() {
      erro = '';
      try {
        const res = await api.get('/produtos');
        produtos = res.data.data;
      } catch (e: any) {
        erro = e.response?.data?.message || 'Erro ao buscar produto';
      }
    }
  
    // Buscar produtos por nome
    async function buscarProdutosPorNome(nome_produto: string) {
      erro = '';
      try {
        const res = await api.get(`/produtos/nome_produto/${nome_produto}`);
        produtos = res.data.data;
      } catch (e: any) {
        erro = e.response?.data?.message || 'Erro ao buscar produtos por nome';
      }
    }
  
    // Remover produtos
    async function removerProduto(id: number) {
      try {
        await api.delete(`/produtos/${id}`);
        // Recarrega a lista após remoção
        search.length >= 3 ? buscarProdutosPorNome(search) : buscarProdutos();
      } catch (e: any) {
        erro = e.response?.data?.message || 'Erro ao remover produtos';
      }
    }
  
    // Carrega produtos ao montar o componente
    onMount(() => {
      buscarProdutos();
    });
  
    // Reatividade da busca
    $: {
      if (search.length >= 3) {
        buscarProdutosPorNome(search);
      } else if (search.length === 0) {
        buscarProdutos();
      } else {
        produtos = [];
        erro = 'Digite pelo menos 3 caracteres para buscar os produtos.';
      }
    }
  </script>
  
  <!-- Interface -->
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6">
    <h1 class="text-2xl font-bold text-center mb-6">𝑳𝒊𝒔𝒕𝒂 𝒅𝒆 𝒑𝒓𝒐𝒅𝒖𝒕𝒐𝒔</h1>
  
    <!-- Campo de busca -->
    <input
      type="text"
      placeholder="Pesquisar produto por nome..."
      bind:value={search}
      class="w-full mb-6 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  
    <!-- Mensagens -->
    {#if erro}
      <p class="text-red-500 mb-4">{erro}</p>
    {:else if produtos.length === 0}
      <p class="text-gray-600">Nenhum produto encontrado.</p>
    {:else}
      <!-- Lista de produtos -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each produtos as produtos} 
          <div class="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between">
            <div class="space-y-1">
              <p><span class="font-semibold">Nome:</span> {produtos.nome_produto}</p>
              <p><span class="font-semibold">Descrição:</span> {produtos.descricao}</p>
              <p><span class="font-semibold">Preço:</span> {produtos.preco}</p>
              <p><span class="font-semibold">Quantidade:</span> {produtos.quantidade}</p>
              <p><span class="font-semibold">Criado em:</span> {produtos.criado_em}</p>
              <p><span class="font-semibold">Atualizado em:</span> {produtos.atualizado_em}</p>
            </div>
  
            <!-- Botões -->
            <div class="mt-4 flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
              <button
                class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm w-full"
                on:click={() => goto(`/editar?id=${produtos.id}`)}
              >
                Editar
              </button>
              <button
                class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm w-full"
                on:click={() => removerProduto(produtos.id)}
              >
                Remover
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
  
  