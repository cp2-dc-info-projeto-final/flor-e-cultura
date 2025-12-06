<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import api from '$lib/api';

  // Variáveis do formulário
  let nome_produto = '';
  let descricao = '';
  let preco = '';
  let quantidade = '';
  let criado_em = '';
  let atualizado_em = '';
  let categoria = '';
  let erro = '';
  let id: string | null = null; // Corrigido para 'string'
  let carregando = true;

  // Upload de imagem
  let imagemFile: File | null = null;
  let previewUrl = '';
  let mensagemErro = '';

  // Mensagem de sucesso in-page
  let mensagemSucesso = '';

  onMount(async () => {

    try {
      const response = await api.get('/users/me');
      const usuario = response.data.data;

      if (usuario.tipo_usuario !== 'admin') {
        goto('/');
        return;
      }

    } catch (err: any) {
      mensagemErro = 'Erro ao verificar permissões.';
      goto('/');
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    id = urlParams.get('id');    

    try {
      const response = await api.get(`/produtos/${id}`);
      const produto = response.data.data || response.data;

      nome_produto = produto.nome_produto;
      descricao = produto.descricao;
      preco = produto.preco;
      quantidade = produto.quantidade;
      criado_em = produto.criado_em ? new Date(produto.criado_em).toISOString().split('T')[0] : '';
      atualizado_em = produto.atualizado_em ? new Date(produto.atualizado_em).toISOString().split('T')[0] : '';
      categoria = produto.categoria;
      if (produto.imagem_url) {
        previewUrl = produto.imagem_url;
      }
    } catch (err: any) {
      erro = 'Erro ao buscar dados do produto.';
      if (err.response) erro += ` ${err.response.data.message || err.response.status}`;
      carregando = false;
      return;
    }
    carregando = false;
  });

  function handleImageSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      imagemFile = target.files[0];
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(imagemFile.type)) {
        mensagemErro = 'Tipo de arquivo não permitido. Use JPEG, PNG, GIF ou WebP.';
        resetImage();
        return;
      }
      if (imagemFile.size > 5 * 1024 * 1024) {
        mensagemErro = 'Arquivo muito grande. Tamanho máximo: 5MB';
        resetImage();
        return;
      }
      previewUrl = URL.createObjectURL(imagemFile);
      mensagemErro = '';
    }
  }

  function resetImage() {
    imagemFile = null;
    previewUrl = '';
    const fileInput = document.getElementById('imagem') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  async function editarProduto() {
    mensagemErro = '';
    mensagemSucesso = '';
    const formData = new FormData();
    formData.append('nome_produto', nome_produto);
    formData.append('descricao', descricao);
    formData.append('preco', preco);
    formData.append('quantidade', quantidade);
    formData.append('criado_em', criado_em);
    formData.append('atualizado_em', atualizado_em);
    formData.append('categoria', categoria);
    if (imagemFile) {
      formData.append('imagem', imagemFile);
    }

    try {
      const response = await api.put(`/produtos/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const result = response.data;
      if (result.success || result) {
        mensagemSucesso = 'Produto editado com sucesso!';
        mensagemErro = '';

        setTimeout(() => {
          goto('/consultaplanta');
        }, 1500);

      } else {
        mensagemErro = result.message || 'Erro desconhecido ao editar produto.';
        mensagemSucesso = '';
      }
    } catch (error: any) {
      mensagemErro = 'Erro ao atualizar produto.';
      if (error.response) mensagemErro += ` ${error.response.data.message || ''}`;
      mensagemSucesso = '';
    }
  }
</script>

{#if carregando}
  <p class="text-center text-white">Carregando dados do usuário...</p>
{:else}
<section>
  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
    <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-white dark:border-gray-700">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-black">
          Edite o Produto 
        </h1>
        {#if erro}
          <div class="text-red-700 bg-red-100 border border-red-400 rounded px-4 py-2">
            {erro}
          </div>
        {/if}
        {#if mensagemSucesso}
          <div class="text-green-700 bg-green-100 border border-green-400 rounded px-4 py-2">
            {mensagemSucesso}
          </div>
        {/if}
        <form on:submit|preventDefault={editarProduto} class="space-y-4 md:space-y-6" action="#">
          <div>
            <label for="imagem" class="pb-2 block text-sm font-medium text-gray-900 dark:text-black">𝐈𝐦𝐚𝐠𝐞𝐦 𝐝𝐨 𝐩𝐫𝐨𝐝𝐮𝐭𝐨</label>
            <input 
              type="file" 
              id="imagem"
              accept="image/*"
              on:change={handleImageSelect}
              class="bg-gray-50 border border-gray-300 text-pink-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500 dark:bg-pink-200 dark:border-gray-600 dark:text-black"
            />
            <small class="text-gray-500">Formatos: JPEG, PNG, GIF, WebP (máx. 5MB)</small>
            {#if previewUrl}
              <img src={previewUrl} alt="Prévia da imagem" class="mt-2 rounded-lg border" style="max-height: 200px;">
            {/if}
            {#if mensagemErro}
              <div class="text-red-700 mt-2">{mensagemErro}</div>
            {/if}
          </div>
          <div>
            <label for="nome_produto" class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">𝐍𝐨𝐦𝐞 𝐝𝐨 𝐩𝐫𝐨𝐝𝐮𝐭𝐨</label>
            <input type="text" name="nome_produto" id="nome_produto" bind:value={nome_produto} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-pink-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-pink-800 dark:focus:border-pink-800" required>
          </div>
          <div>
            <label for="descricao" class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">𝐃𝐞𝐬𝐜𝐫𝐢𝐜𝐚𝐨</label>
            <input type="text" name="descricao" id="descricao" bind:value={descricao} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-pink-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-pink-800 dark:focus:border-pink-800" required>
          </div>
          <div>
            <label for="preco" class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">𝐏𝐫𝐞𝐜𝐨</label>
            <input type="number" name="preco" id="preco" bind:value={preco} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-pink-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-pink-800 dark:focus:border-pink-800" required step="any">
          </div>
          <div>
            <label for="quantidade" class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">𝐐𝐮𝐚𝐧𝐭𝐢𝐝𝐚𝐝𝐞</label>
            <input type="number" bind:value={quantidade} name="quantidade" id="quantidade" placeholder="Quantidade" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-pink-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-pink-800 dark:focus:border-pink-800" required>
          </div>
          <div>
            <label for="criado_em" class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">𝐂𝐫𝐢𝐚𝐝𝐨 𝐞𝐦</label>
            <input type="date" bind:value={criado_em} name="criado_em" id="criado_em" placeholder="Criado em" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-pink-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-pink-800 dark:focus:border-pink-800" required>
          </div>
          <div>
            <label for="atualizado_em" class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">𝐀𝐭𝐮𝐚𝐥𝐢𝐳𝐚𝐝𝐨 𝐞𝐦</label>
            <input type="date" bind:value={atualizado_em} name="atualizado_em" id="atualizado_em" placeholder="Atualizado em" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-pink-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-pink-800 dark:focus:border-pink-800" required>
          </div>
          <div>
            <label for="categoria" class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐢𝐚</label>
            <input type="text" bind:value={categoria} name="categoria" id="categoria" placeholder="Categoria" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-pink-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-pink-800 dark:focus:border-pink-800" required>
          </div>
          <button id="cadastro" type="submit" class="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-700 dark:hover:bg-green-800 dark:focus:ring-green-800">Confirme seus dados</button>
        </form>
      </div>
    </div>
  </div>
</section>
{/if}