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
  let erro = '';
  let id: String | null = null;
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
        // Se não for admin, redireciona
        goto('/');
        return;
      }

    } catch (err: any) {
      mensagemErro = 'Erro ao verificar permissões.';
      goto('/');
    }

    const urlParams = new URLSearchParams(window.location.search);
    id = urlParams.get('id');    

    try {
      const response = await api.get(`http://localhost:3000/produtos/${id}`);
      const produto = response.data.data || response.data;

      nome_produto = produto.nome_produto;
      descricao = produto.descricao;
      preco = produto.preco;
      quantidade = produto.quantidade;
      criado_em = produto.criado_em ? new Date(produto.criado_em).toISOString().split('T')[0] : '';
      atualizado_em = produto.atualizado_em ? new Date(produto.atualizado_em).toISOString().split('T')[0] : '';
      // Preview da imagem já cadastrada, se houver
      if(produto.imagem_url){
        previewUrl = produto.imagem_url;
      }
    } catch (err) {
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
    if(imagemFile){
      formData.append('imagem', imagemFile);
    }

    try {
      const response = await api.put(`/produtos/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const result = response.data;
      if(result.success || result){
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
  <p class="text-center text-gray-700 my-8">Carregando dados da planta...</p>
{:else}
  <section class="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-2">
    <div class="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 sm:p-8 my-8">
      <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 mb-4">
        Editar produto
      </h1>

      {#if mensagemErro}
        <div class="p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300 mb-3">
          {mensagemErro}
        </div>
      {/if}
      {#if mensagemSucesso}
        <div class="p-3 text-sm text-green-700 bg-green-100 rounded-lg border border-green-300 mb-3">
          {mensagemSucesso}
        </div>
      {/if}

      <form on:submit|preventDefault={editarProduto} class="space-y-4">
        <!-- Upload de Imagem -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-900">Imagem do Produto</label>
          <input 
            type="file" 
            id="imagem"
            accept="image/*"
            on:change={handleImageSelect}
            class="block w-full border border-gray-300 rounded-lg text-sm file:bg-blue-50 file:border-0 file:mr-3 file:py-1 file:px-2 file:text-blue-700 focus:ring-blue-500 focus:border-blue-500"
          />
          <small class="text-gray-500">Formatos: JPEG, PNG, GIF, WebP (máx. 5MB)</small>
        </div>
        {#if previewUrl}
          <div class="flex justify-center">
            <img src={previewUrl} alt="Preview" class="w-32 h-32 object-cover rounded-lg border border-gray-200 mt-2" />
          </div>
        {/if}

        <div>
          <label for="nome_produto" class="block mb-1 text-sm font-medium text-gray-900">Nome do produto</label>
          <input type="text" id="nome_produto" bind:value={nome_produto} required placeholder="Margarida"
            class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label for="descricao" class="block mb-1 text-sm font-medium text-gray-900">Descrição</label>
          <input type="text" id="descricao" bind:value={descricao} required placeholder="Planta com flor"
            class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div class="flex flex-col gap-4 sm:flex-row">
          <div class="w-full">
            <label for="preco" class="block mb-1 text-sm font-medium text-gray-900">Preço</label>
            <input type="text" id="preco" bind:value={preco} required 
              class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div class="w-full">
            <label for="quantidade" class="block mb-1 text-sm font-medium text-gray-900">Quantidade</label>
            <input type="number" id="quantidade" bind:value={quantidade} required placeholder="10"
              class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <div class="flex flex-col gap-4 sm:flex-row">
          <div class="w-full">
            <label for="criado_em" class="block mb-1 text-sm font-medium text-gray-900">Criado em</label>
            <input type="date" id="criado_em" bind:value={criado_em} required
              class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div class="w-full">
            <label for="atualizado_em" class="block mb-1 text-sm font-medium text-gray-900">Atualizado em</label>
            <input type="date" id="atualizado_em" bind:value={atualizado_em} required
              class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <button type="submit"
          class="mt-4 w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-150 shadow">
          Salvar alterações
        </button>
      </form>
    </div>
  </section>
{/if}