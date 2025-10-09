<script>
    import { onMount } from 'svelte';
  
    // Variáveis do formulário
  
    let produto = [{ 
    nome_produto: "",    
    descricao: "",
    preco: "", 
    quantidade: "",
    criado_em: "",
    atualizado_em: "",
        }];
    produto.pop()
  
    let nome_produto = '';
    let descricao = '';
    let preco = '';
    let quantidade = '';
    let criado_em = '';
    let atualizado_em = '';
    let erro = '';
    let id = '';
    let carregando = true;
  
    async function carregarProduto() {
      try {
        const res = await fetch('http://localhost:3000/produtos/');
        const data = await res.json();
  
        if (!data.success) {
          erro = data.message || 'Erro ao buscar produto';
          return;
        }
  
        produto = data.data;
      } catch (e) {
        erro = 'Erro ao conectar com o servidor';
      }
    }
    
    // Buscar os dados do usuário ao carregar a página
    onMount(async () => {
      const urlParams = new URLSearchParams(window.location.search);
      id = urlParams.get('id');
      if (!id) {
        alert('ID de produto não encontrado.');
        return;
      }
    
      try {
        const res = await fetch(`http://localhost:3000/produtos/${id}`);
        const dados = await res.json();
        const produto = dados.data || dados;
        nome_produto = produto.nome_produto;
        descricao = produto.descricao;
        preco = produto.preco;
        quantidade = produto.quantidade;
        criado_em = produto.criado_em;
        atualizado_em = produto.atualizado_em;
      } catch (err) {
        console.error('Erro ao buscar dados do usuário:', err);
        alert('Erro ao buscar dados do usuário.');
      }
      finally {
        carregando = false;
      }
    });
  
    // Atualizar dados do usuário
    async function editarProduto() {
  
      const produto = {
        nome_produto: nome_produto,
        descricao,
        preco,
        quantidade,
        criado_em,
        atualizado_em,
      };
  
      try {
        const response = await fetch(`http://localhost:3000/produtos/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(produto)
        });
  
        const result = await response.json();
  
        if (response.ok && result.success) {
          alert('Produto atualizado com sucesso!');
        } else {
          alert(`Erro: ${result.message}`);
        }
      } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        alert('Erro ao conectar com o servidor.');
      }
    }
    
  </script>
  
  {#if !carregando}
  <section>
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                      Edite os dados do produto
                  </h1>
                  <form on:submit|preventDefault={editarProduto} class="space-y-4 md:space-y-6" action="#">
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
                        <button id="cadastro" type="submit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Confirme seus dados</button>
                  </form>
              </div>
          </div>
      </div>
    </section>
    {:else}
    <p class="text-center text-white">Carregando dados da planta...</p>
  {/if}