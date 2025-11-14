<script lang="ts">
    import { pedidosNaoVisualizados, carregarPedidos } from '$lib/stores/pedidos';
    import { currentUser } from '$lib/stores/auth';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
  
    let showDropdown = false;
  
    onMount(() => {
      // Carregar pedidos se for admin
      if ($currentUser?.tipo_usuario === 'admin') {
        carregarPedidos().catch(error => {
          console.error('Erro ao carregar pedidos para notificações:', error);
        });
      }
    });
  
    function toggleDropdown() {
      showDropdown = !showDropdown;
    }
  
    function goToAdmin() {
      goto('/pedidos');
      showDropdown = false;
    }
  </script>
  
  {#if $currentUser?.tipo_usuario === 'admin'}
    <div class="relative">
      <button
        on:click={toggleDropdown}
        class="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 010 12h-6a6 6 0 010-12h6z">
          </path>
        </svg>
        
        {#if $pedidosNaoVisualizados > 0}
          <span class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
            {$pedidosNaoVisualizados}
          </span>
        {/if}
      </button>
  
      {#if showDropdown}
        <div class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50">
          <div class="p-4">
            <div class="flex justify-between items-center mb-2">
              <h3 class="font-semibold">Notificações</h3>
              {#if $pedidosNaoVisualizados > 0}
                <span class="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                  {$pedidosNaoVisualizados} nova(s)
                </span>
              {/if}
            </div>
            
            {#if $pedidosNaoVisualizados > 0}
              <p class="text-sm text-gray-600 mb-3">
                Você tem {$pedidosNaoVisualizados} pedido(s) não visualizado(s)
              </p>
              <button
                on:click={goToAdmin}
                class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm"
              >
                Ver Pedidos
              </button>
            {:else}
              <p class="text-sm text-gray-600 text-center py-2">
                Nenhuma nova notificação
              </p>
            {/if}
          </div>
        </div>
      {/if}
  
      <!-- Overlay para fechar ao clicar fora -->
      {#if showDropdown}
        <div class="fixed inset-0 z-40" on:click={toggleDropdown}></div>
      {/if}
    </div>
  {/if}
  