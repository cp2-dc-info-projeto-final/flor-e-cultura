<script lang="ts">
  import api from '$lib/api';
  import { onMount } from 'svelte';
  import { adicionarAoCarrinho } from '$lib/stores/carrinho';

  // Categorias originais
  const categorias = [
    { nome: "𝐁𝐮𝐪𝐮𝐞𝐬", link: "/consultaplanta?categoria=buque", imagem: "/imagens/categoria_flores.jpeg" },
    { nome: "𝐀𝐫𝐫𝐚𝐧𝐣𝐨𝐬", link: "/consultaplanta?categoria=arranjo", imagem: "/imagens/categoria_arranjos.jpg" },
    { nome: "𝐏𝐫𝐞𝐬𝐞𝐧𝐭𝐞𝐬", link: "/consultaplanta?categoria=presente", imagem: "/imagens/categoria_presentes.jpeg" },
    { nome: "𝐏𝐞𝐥𝐮𝐜𝐢𝐚𝐬", link: "/consultaplanta?categoria=pelucia", imagem: "/imagens/categoria_pelucias.jpeg" },
    { nome: "𝐒𝐞𝐦𝐞𝐧𝐭𝐞𝐬", link: "/consultaplanta?categoria=semente", imagem: "/imagens/categoria_sementes.jpeg" },
    { nome: "𝐕𝐚𝐬𝐨𝐬", link: "/consultaplanta?categoria=vaso", imagem: "/imagens/categoria_vasos.jpeg" }
  ];

  // Produtos destacados
  const idsProdutos = [58, 59, 57, 7, 11, 8, 16, 17];
  let produtos: any[] = [];
  let erro = '';
  let loading = false;
  const baseURL = api.defaults.baseURL;

  let produtoAdicionado: number | null = null;

  function mostrarFeedback(id: number) {
    produtoAdicionado = id;
    setTimeout(() => {
      produtoAdicionado = null;
    }, 1800);
  }

  function adicionarProduto(produto: any) {
    adicionarAoCarrinho({
      id: produto.id,
      nome_produto: produto.nome_produto,
      descricao: produto.descricao,
      preco: produto.preco,
      quantidade: produto.quantidade,
      imagem: produto.imagem,
      criado_em: produto.criado_em,
      atualizado_em: produto.atualizado_em,
      categoria: produto.categoria,
    });
    mostrarFeedback(produto.id);
  }

  async function buscarProdutoPorId(id: number): Promise<any> {
    try {
      const res = await api.get(`/produtos/${id}`);
      return res.data.data;
    } catch {
      return null;
    }
  }

  async function buscarProdutosDestacados() {
    loading = true;
    let resultado: any[] = [];
    for (const id of idsProdutos) {
      const produto = await buscarProdutoPorId(id);
      if (produto) resultado.push(produto);
    }
    produtos = resultado;
    if (!produtos.length) erro = 'Nenhum produto destacado encontrado.';
    loading = false;
  }

  onMount(() => {
    buscarProdutosDestacados();
  });
</script>

<!-- Carousel/banner -->
<div class="relative w-full" data-carousel="slide">
  <div class="relative h-56 overflow-hidden rounded-lg md:h-96">
    <div class="duration-700 ease-in-out" data-carousel-item="active">
      <img src="/banner1.jpg" class="absolute block w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" alt="Banner 1">
    </div>
    <div class="hidden duration-700 ease-in-out" data-carousel-item>
      <img src="/1.png" class="absolute block w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" alt="Banner 2">
    </div>
  </div>
</div>

<!-- Categorias -->
<section class="bg-white flex flex-col items-center mt-8">
  <div class="max-w-screen-lg w-full px-4 text-center">
    <div class="flex flex-wrap justify-center gap-7">
      {#each categorias as categoria}
        <a href={categoria.link} class="flex flex-col items-center group w-28">
          <div class="w-24 h-24 rounded-full bg-pink-200 flex items-center justify-center shadow group-hover:bg-pink-300 transition-all overflow-hidden">
            <img src={categoria.imagem} alt={categoria.nome} class="w-full h-full object-cover group-hover:opacity-85" />
          </div>
          <span class="mt-2 text-base font-medium text-pink-800 group-hover:text-pink-900 truncate">
            {categoria.nome}
          </span>
        </a>
      {/each}
    </div>
  </div>
</section>

<!-- Produtos em Destaque -->
<section class="w-full flex flex-col items-center py-10 bg-pink-50 mt-10">
  <h2 class="text-2xl font-bold text-center mb-7 tracking-tight text-pink-800">🌸 Produtos em Destaque 🌸</h2>
  {#if loading}
    <p class="text-gray-500 mb-12">Carregando produtos...</p>
  {:else if erro}
    <p class="text-red-500 mb-12">{erro}</p>
  {:else}
    <div class="w-full flex justify-center">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
        {#each produtos as produto}
          <div class="bg-white border rounded-2xl p-4 shadow flex flex-col items-center w-64 mx-auto transition hover:scale-105 hover:shadow-xl">
            {#if produto.imagem}
              <img src={baseURL + produto.imagem} alt={produto.nome_produto} class="mb-3 rounded-xl h-40 w-40 object-cover border" />
            {:else}
              <div class="mb-3 rounded-xl h-40 w-40 bg-gray-100 flex items-center justify-center border">
                <span class="text-gray-400">Sem imagem</span>
              </div>
            {/if}
            <div class="w-full flex flex-col items-center">
              <span class="text-pink-700 font-semibold text-lg text-center mb-1 truncate w-full">{produto.nome_produto}</span>
              <span class="text-gray-600 text-sm text-center truncate w-full mb-1">{produto.descricao}</span>
              <span class="text-green-700 font-bold text-xl mb-1">R$ {produto.preco}</span>
              <span class="text-xs text-gray-500">Qtd: {produto.quantidade}</span>
              <span class="text-xs text-gray-400">Categoria: {produto.categoria}</span>

              <!-- Botão Adicionar ao Carrinho -->
              <button
                class="mt-3 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded transition disabled:opacity-60"
                disabled={produtoAdicionado === produto.id}
                on:click={() => adicionarProduto(produto)}>
                  {#if produtoAdicionado === produto.id}
                    ✓ Adicionado!
                  {:else}
                    🛒 Adicionar ao Carrinho
                  {/if}
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</section>