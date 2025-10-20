<script lang="ts">
    import { carrinho, removerDoCarrinho, atualizarQuantidade, getTotalPreco, limparCarrinho } from '$lib/stores/carrinho';
    import { goto } from '$app/navigation';
  
    let total = $derived(getTotalPreco());
  
    function finalizarCompra() {
      alert('Compra finalizada com sucesso! Total: R$ ' + total.toFixed(2));
      limparCarrinho();
      goto('/');
    }
  </script>
  
  <svelte:head>
    <title>Carrinho de Compras</title>
  </svelte:head>
  
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-6">
    <h1 class="text-2xl font-bold text-center mb-6">🛒 Meu Carrinho</h1>
  
    {#if $carrinho.length === 0}
      <div class="text-center py-12">
        <p class="text-gray-600 text-lg mb-4">Seu carrinho está vazio</p>
        <button 
          on:click={() => goto('/consultaplanta')} 
          class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Continuar Comprando
        </button>
      </div>
    {:else}
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6">
          {#each $carrinho as item (item.id)}
            <div class="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
              <div class="flex-1">
                <h3 class="font-semibold text-lg">{item.nome_produto}</h3>
                <p class="text-gray-600 text-sm">{item.descricao}</p>
                <p class="text-green-600 font-semibold mt-1">R$ {item.preco}</p>
              </div>
              
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                  <button
                    on:click={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                    class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                  >
                    −
                  </button>
                  <span class="w-8 text-center font-semibold">{item.quantidade}</span>
                  <button
                    on:click={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                    class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>
                
                <button
                  on:click={() => removerDoCarrinho(item.id)}
                  class="text-red-500 hover:text-red-700 p-2 transition-colors"
                  title="Remover item"
                >
                  🗑️
                </button>
              </div>
            </div>
          {/each}
        </div>
        
        <div class="bg-gray-50 px-6 py-4">
          <div class="flex justify-between items-center mb-4">
            <span class="text-lg font-semibold">Total:</span>
            <span class="text-xl font-bold text-green-600">R$ {total.toFixed(2)}</span>
          </div>
          
          <div class="flex gap-3">
            <button
              on:click={limparCarrinho}
              class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors"
            >
              Limpar Carrinho
            </button>
            <button
              on:click={finalizarCompra}
              class="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors"
            >
              Finalizar Compra
            </button>
          </div>
          
          <button 
            on:click={() => goto('/consultaplanta')} 
            class="w-full mt-3 text-blue-500 hover:text-blue-700 py-2 transition-colors"
          >
            ← Continuar Comprando
          </button>
        </div>
      </div>
    {/if}
  </div>