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

  let isAdmin = false;
  let loading = false;

  let searchTimeout: ReturnType<typeof setTimeout>;

    async function buscarUsuarioLogado() {
  try {
    const res = await api.get('/users/me');
    isAdmin = res.data.data.tipo_usuario?.toLowerCase().trim() === 'admin';
    console.log('Tipo usuário:', res.data.data.tipo_usuario, 'isAdmin:', isAdmin);
  } catch (e: any) {
    if (e.response?.status === 401) {
      // Usuário não está logado, tudo bem, não é admin
      isAdmin = false;
    } else {
      console.error('Erro ao buscar usuário logado:', e);
      isAdmin = false;
    }
  }
}


  async function buscarProdutos() {
    erro = '';
    loading = true;
    try {
      const res = await api.get('/produtos');
      produtos = res.data.data;
    } catch (e: any) {
      erro = e.response?.data?.message || 'Erro ao buscar produtos';
      produtos = [];
    } finally {
      loading = false;
    }
  }

  async function buscarProdutosPorNome(nome: string) {
    erro = '';
    loading = true;
    try {
      const res = await api.get(`/produtos/nome_produto/${encodeURIComponent(nome)}`);
      produtos = res.data.data;
    } catch (e: any) {
      erro = e.response?.data?.message || 'Erro ao buscar produtos por nome';
      produtos = [];
    } finally {
      loading = false;
    }
  }

  async function removerProduto(id: number) {
    erro = '';
    try {
      await api.delete(`/produtos/${id}`);
      // Atualiza lista depois da remoção
      if (search.length >= 3) {
        buscarProdutosPorNome(search);
      } else {
        buscarProdutos();
      }
    } catch (e: any) {
      erro = e.response?.data?.message || 'Erro ao remover produto';
      alert(erro);  // Opcional: mostrar alerta para o usuário
    }
  }

  onMount(async () => {
    await buscarUsuarioLogado();  // tenta definir isAdmin
    await buscarProdutos();
  });

  $: if (searchTimeout) clearTimeout(searchTimeout);
  $: searchTimeout = setTimeout(() => {
    if (search.length >= 3) {
      buscarProdutosPorNome(search);
    } else if (search.length === 0) {
      buscarProdutos();
    } else {
      produtos = [];
      erro = 'Digite pelo menos 3 caracteres para buscar os produtos.';
    }
  }, 400);
</script>

<div class="max-w-6xl mx-auto px-4 sm:px-6 py-6">
  <h1 class="text-2xl font-bold text-center mb-6">🌱 Lista de Plantas</h1>

  <p class="mb-4 font-semibold text-center">
    Você é admin? {isAdmin ? 'Sim' : 'Não'}
  </p>

  <input
    type="text"
    placeholder="Pesquisar planta por nome..."
    bind:value={search}
    class="w-full mb-6 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
  />

  {#if erro}
    <p class="text-red-500 mb-4">{erro}</p>
  {:else if loading}
    <p class="text-gray-600 mb-4">Carregando...</p>
  {:else if produtos.length === 0}
    <p class="text-gray-600">Nenhuma planta encontrada.</p>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each produtos as produto}
        <div class="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between">
          <div class="space-y-1">
            <p><span class="font-semibold">Nome:</span> {produto.nome_produto}</p>
            <p><span class="font-semibold">Descrição:</span> {produto.descricao}</p>
            <p><span class="font-semibold">Preço:</span> {produto.preco}</p>
            <p><span class="font-semibold">Quantidade:</span> {produto.quantidade}</p>
            <p><span class="font-semibold">Criado em:</span> {produto.criado_em}</p>
            <p><span class="font-semibold">Atualizado em:</span> {produto.atualizado_em}</p>
          </div>

          {#if isAdmin}
            <div class="mt-4 flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
              <button
                class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm w-full"
                on:click={() => goto(`/editarprodutos?id=${produto.id}`)}
              >
                Editar
              </button>
              <button
                class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm w-full"
                on:click={() => removerProduto(produto.id)}
              >
                Remover
              </button>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
