<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import api from '$lib/api';
  import { page } from '$app/stores';
  import { adicionarAoCarrinho, carrinho } from '$lib/stores/carrinho';
  import {getToken} from '$lib/auth';

  const baseURL = api.defaults.baseURL;

  type Produto = {
    id: number;
    nome_produto: string;
    descricao: string;
    preco: string;
    quantidade: string;
    criado_em: string;
    atualizado_em: string;
    imagem?: string;
    categoria: string;
  };

  let produtos: Produto[] = [];
  const categoria = $page.url.searchParams.get('categoria');
  const filtraCategoria = $page.url.searchParams.has('categoria');
  
  let erro = '';
  let search = '';
  let isAdmin = false;
  let loading = false;

  let produtoAdicionado: number | null = null;
  let produtoAExcluir: Produto | null = null;
  let mostrandoConfirmacao = false;

  function mostrarFeedback(id: number) {
      produtoAdicionado = id;
      setTimeout(() => {
        produtoAdicionado = null;
      }, 2000);
  }

  async function adicionarProdutoAoCarrinho(produto: Produto) {
    adicionarAoCarrinho({
      id: produto.id,
      nome_produto: produto.nome_produto,
      descricao: produto.descricao,
      preco: produto.preco,
      quantidade: produto.quantidade,
      imagem: produto.imagem,
      criado_em: produto.criado_em,
      atualizado_em: produto.atualizado_em
    });
    mostrarFeedback(produto.id);
  }

  async function buscarUsuarioLogado() {
    try {
      const token = getToken();
      if (!token) {
        isAdmin = false;
      }
      else{
        const res = await api.get('/users/me');
        isAdmin = res.data.data.tipo_usuario?.toLowerCase().trim() === 'admin';
      }
    } catch (e: any) {
      if (e.response?.status === 401) {
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
      const res = await api.get(`/produtos${filtraCategoria ? '?categoria=' + categoria : ''} `);
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
      const res = await api.get(`/produtos/nome_produto/${encodeURIComponent(nome)}${filtraCategoria ? '?categoria=' + categoria : ''} `);
      produtos = res.data.data;
    } catch (e: any) {
      erro = e.response?.data?.message || 'Erro ao buscar produtos por nome';
      produtos = [];
    } finally {
      loading = false;
    }
  }

  // NOVAS FUNÇÕES PARA MODAL DE CONFIRMAÇÃO

  function solicitarRemocao(produto: Produto) {
    produtoAExcluir = produto;
    mostrandoConfirmacao = true;
  }

  async function confirmarRemocao() {
    if (produtoAExcluir) {
      await removerProduto(produtoAExcluir.id);
    }
    mostrandoConfirmacao = false;
    produtoAExcluir = null;
  }

  function cancelarRemocao() {
    mostrandoConfirmacao = false;
    produtoAExcluir = null;
  }

  async function removerProduto(id: number) {
    erro = '';
    try {
      await api.delete(`/produtos/${id}`);
      if (search.length >= 3) {
        buscarProdutosPorNome(search);
      } else {
        buscarProdutos();
      }
    } catch (e: any) {
      erro = e.response?.data?.message || 'Erro ao remover produto';
    }
  }

  onMount(async () => {
    await buscarUsuarioLogado();
    await buscarProdutos();
  });

  $: {
    if (search.length >= 3) {
      buscarProdutosPorNome(search);
    } else if (search.length === 0) {
      buscarProdutos();
    } else {
      produtos = [];
      erro = 'Digite pelo menos 3 caracteres para buscar.';
    }
  }
</script>

<!-- MODAL DE CONFIRMAÇÃO DE REMOÇÃO DE PRODUTO -->
{#if mostrandoConfirmacao && produtoAExcluir}
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <div class="bg-white rounded p-6 shadow-lg max-w-sm w-full text-center">
      <p class="mb-4 text-lg">Tem certeza que deseja remover o produto <b>{produtoAExcluir.nome_produto}</b>?</p>
      <div class="flex justify-center gap-4">
        <button class="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded" on:click={confirmarRemocao}>
          Sim, remover
        </button>
        <button class="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded" on:click={cancelarRemocao}>
          Cancelar
        </button>
      </div>
    </div>
  </div>
{/if}

<div class="max-w-6xl mx-auto px-4 sm:px-6 py-6">
  <h1 class="text-2xl font-bold text-center mb-6">𝐋𝐢𝐬𝐭𝐚 𝐝𝐞 𝐏𝐥𝐚𝐧𝐭𝐚𝐬</h1>

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
        <div class="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between border border-gray-200">
          {#if produto.imagem}
            <div class="mb-3 flex justify-center">
              <img 
                src={baseURL + produto.imagem} 
                alt={produto.nome_produto}
                class="w-full h-80 object-cover rounded-lg border"
                on:error={(e) => {
                  console.error('Erro ao carregar imagem:', produto.imagem);
                  e.target.style.display = 'none';
                }}
                on:load={() => console.log('Imagem carregada:', produto.imagem)}
              />
            </div>
          {:else}
            <div class="mb-3 flex justify-center items-center h-80 bg-gray-100 rounded-lg border">
              <span class="text-gray-400">📷 Sem imagem</span>
            </div>
          {/if}

          <div class="space-y-2 flex-grow">
            <p><span class="font-semibold">Nome:</span> {produto.nome_produto}</p>
            <p><span class="font-semibold">Descrição:</span> {produto.descricao}</p>
            <p><span class="font-semibold">Preço:</span> R$ {produto.preco}</p>
            <p><span class="font-semibold">Quantidade:</span> {produto.quantidade}</p>
            <p><span class="font-semibold">Criado em:</span> {new Date(produto.criado_em).toLocaleDateString('pt-BR')}</p>
            <p><span class="font-semibold">Atualizado em:</span> {new Date(produto.atualizado_em).toLocaleDateString('pt-BR')}</p>
          </div>

          <div class="mt-4 flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
            <button
              class="bg-pink-400 hover:bg-pink-700 text-white px-3 py-2 rounded text-sm w-full flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              on:click={() => adicionarProdutoAoCarrinho(produto)}
              disabled={produtoAdicionado === produto.id}
            >
              {#if produtoAdicionado === produto.id}
                <span>✓ Adicionado!</span>
              {:else}
                <span>🛒 Adicionar ao Carrinho</span>
              {/if}
            </button>
          </div>

          {#if isAdmin}
            <div class="mt-4 flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
              <button
                class="bg-green-400 hover:bg-green-600 text-white px-3 py-2 rounded text-sm w-full transition-colors"
                on:click={() => goto(`/editarprodutos?id=${produto.id}`)}
              >
                Editar
              </button>
              <button
                class="bg-red-400 hover:bg-red-600 text-white px-3 py-2 rounded text-sm w-full transition-colors"
                on:click={() => solicitarRemocao(produto)}
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