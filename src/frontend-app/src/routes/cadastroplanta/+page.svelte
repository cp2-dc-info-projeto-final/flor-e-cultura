<script lang="ts">
  import { onMount } from 'svelte';
  import api from '$lib/api';
  import { goto } from '$app/navigation';
  import { Label } from "flowbite-svelte";

  let nome_produto = '';
  let descricao = '';
  let preco = '';
  let quantidade = '';
  let criado_em = '';
  let atualizado_em = '';
  let selectedcategoria = 'arranjo'; // Initial selected value
  const categoria = ['arranjo', 'buque', 'presente', 'pelucia', 'semente', 'vaso'];
  
  // Variáveis para upload de imagem
  let imagemFile: File | null = null;
  let previewUrl = '';

  let mensagemErro = '';
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
      goto('/login');
    }
  });
  // Manipular seleção de arquivo
  function handleImageSelect(event: Event) {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
          imagemFile = target.files[0];
          
          // Validações
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

          // Criar preview
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

  async function cadastrarProdutos() {
      mensagemErro = '';
      mensagemSucesso = '';
  
      // Validação básica
      if (!nome_produto || !descricao || !preco || !quantidade || !categoria) {
          mensagemErro = 'Nome, descrição, preço e quantidade são obrigatórios.';
          return;
      }

      try {
          // Usar FormData para enviar arquivo
          const formData = new FormData();
          formData.append('nome_produto', nome_produto);
          formData.append('descricao', descricao);
          formData.append('preco', preco);
          formData.append('quantidade', quantidade);
          formData.append('categoria', selectedcategoria);
          formData.append('criado_em', criado_em || new Date().toISOString().split('T')[0]);
          formData.append('atualizado_em', atualizado_em || new Date().toISOString().split('T')[0]);
          
          if (imagemFile) {
              formData.append('imagem', imagemFile);
          }

          const response = await api.post('/produtos', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          });
  
          mensagemSucesso = 'Produto cadastrado com sucesso!';
          
          // Resetar formulário
          nome_produto = '';
          descricao = '';
          preco = '';
          quantidade = '';
          selectedcategoria;
          criado_em = '';
          atualizado_em = '';
          resetImage();
  
      } catch (e: any) {
          mensagemErro = e.response?.data?.message || 'Erro ao salvar produto.';
      }
  }
</script>

<section>
  <div class="flex flex-col items-center justify-center min-h-screen lg:py-0">
      <div class="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-white dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-black">
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

                  <!-- Upload de Imagem -->
                  <div>
                      <Label class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">𝐈𝐦𝐚𝐠𝐞𝐦 𝐝𝐨 𝐩𝐫𝐨𝐝𝐮𝐭𝐨</Label>
                      <input 
                          type="file" 
                          id="imagem"
                          accept="image/*"
                          on:change={handleImageSelect}
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-pink-700 focus:border-pink-700 dark:bg-pink-200 dark:border-gray-600" 
                      />
                      <small class="text-gray-500">Formatos: JPEG, PNG, GIF, WebP (máx. 5MB)</small>
                  </div>

                  {#if previewUrl}
                      <div class="mt-2">
                          <img src={previewUrl} alt="Preview" class="w-32 h-32 object-cover rounded-lg border" />
                      </div>
                  {/if}

                  <div>
                      <label for="nome_produto" class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">𝐍𝐨𝐦𝐞 𝐝𝐨 𝐩𝐫𝐨𝐝𝐮𝐭𝐨</label>
                      <input type="text" id="nome_produto" bind:value={nome_produto} required placeholder="Margarida"
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-pink-700 focus:border-pink-700 dark:bg-pink-200 dark:border-gray-600" />
                  </div>

                  <div>
                      <label for="descricao" class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">𝐃𝐞𝐬𝐜𝐫𝐢𝐜𝐚𝐨</label>
                      <input type="text" id="descricao" bind:value={descricao} required placeholder="Planta com flor"
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-pink-700 focus:border-pink-700 dark:bg-pink-200 dark:border-gray-600" />
                  </div>

                  <div>
                      <label for="preco" class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">𝐏𝐫𝐞𝐜𝐨</label>
                      <input type="string" id="preco" bind:value={preco} required placeholder="29.90"
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-pink-700 focus:border-pink-700 dark:bg-pink-200 dark:border-gray-600" />
                  </div>

                  <div>
                      <label for="quantidade" class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">𝐐𝐮𝐚𝐧𝐭𝐢𝐝𝐚𝐝𝐞</label>
                      <input type="number" id="quantidade" bind:value={quantidade} required placeholder="10"
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-pink-700 focus:border-pink-700 dark:bg-pink-200 dark:border-gray-600" />
                  </div>
                  <div>
                  <select bind:value={selectedcategoria}>
                    {#each categoria as categoria}
                      <option value={categoria}>{categoria}</option>
                    {/each}
                  </select>
                  
                  <p>Selecione a categoria: {selectedcategoria}</p>
                </div>
                  <div>
                      <label for="criado_em" class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">𝐂𝐫𝐢𝐚𝐝𝐨 𝐞𝐦</label>
                      <input type="date" id="criado_em" bind:value={criado_em} 
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-pink-700 focus:border-pink-700 dark:bg-pink-200 dark:border-gray-600" />
                  </div>

                  <div>
                      <label for="atualizado_em" class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">𝐀𝐭𝐮𝐚𝐥𝐢𝐳𝐚𝐝𝐨 𝐞𝐦</label>
                      <input type="date" id="atualizado_em" bind:value={atualizado_em} 
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-pink-700 focus:border-pink-700 dark:bg-pink-200 dark:border-gray-600" />
                  </div>

                  <button type="submit"
                      class="w-full text-white bg-lime-400 hover:bg-lime-400 focus:ring-lime-400 focus:outline-none focus:border-lime-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-pink-400 dark:hover:bg-pink-700 dark:focus:ring-pink-700 disabled:opacity-60">
                      Criar produto
                  </button>

              </form>
          </div>
      </div>
  </div>
</section>