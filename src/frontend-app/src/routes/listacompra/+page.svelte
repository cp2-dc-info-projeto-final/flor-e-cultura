<!-- routes/admin/pedidos/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    pedidos, 
    pedidosFiltrados, 
    filtroStatus, 
    carregando,
    carregarPedidos, 
    atualizarStatusPedido,
    pedidoSelecionado,
    obterDetalhesPedido,
    estatisticasPedidos
  } from '$lib/stores/pedidos';
  import { currentUser, isAdmin, isLoggedIn, isLoadingAuth } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  let mensagem = '';

  const STATUS_CLASSES: { [key: string]: string } = {
    'PENDENTE': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'CONFIRMADO': 'bg-blue-100 text-blue-800 border-blue-300',
    'PREPARANDO': 'bg-orange-100 text-orange-800 border-orange-300',
    'ENVIADO': 'bg-purple-100 text-purple-800 border-purple-300',
    'ENTREGUE': 'bg-green-100 text-green-800 border-green-300',
    'CANCELADO': 'bg-red-100 text-red-800 border-red-300'
  };

  const DEFAULT_STATUS_CLASS = 'bg-gray-100 text-gray-800 border-gray-300';

  onMount(() => {
    // Usar o store de auth para verificar login
    if (!$isLoggedIn && !$isLoadingAuth) {
      goto('/login');
      return;
    }
    
    if ($isLoggedIn) {
      try {
        carregarPedidos();
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        mensagem = 'Erro ao carregar pedidos. Tente novamente.';
      }
    }
  });

  // Reagir às mudanças de autenticação
  $: if ($isLoggedIn && !$isLoadingAuth) {
    // Se ficou logado, carregar pedidos
    carregarPedidos().catch(error => {
      console.error('Erro ao carregar pedidos:', error);
      mensagem = 'Erro ao carregar pedidos. Tente novamente.';
    });
  }

  $: if (!$isLoggedIn && !$isLoadingAuth) {
    // Se deslogou, redirecionar
    goto('/login');
  }

  async function handleStatusChange(pedidoId: number, novoStatus: string) {
    try {
      await atualizarStatusPedido(pedidoId, novoStatus);
      mensagem = `✅ Pedido #${pedidoId} atualizado para ${novoStatus}`;
      setTimeout(() => mensagem = '', 3000);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      mensagem = `❌ Erro ao atualizar pedido #${pedidoId}`;
    }
  }

  async function handleSelecionarPedido(pedido: any) {
    try {
      const detalhes = await obterDetalhesPedido(pedido.id);
      pedidoSelecionado.set(detalhes);
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
      mensagem = '❌ Erro ao carregar detalhes do pedido';
    }
  }

  function formatarData(data: string) {
    return new Date(data).toLocaleString('pt-BR');
  }

  function formatarPreco(preco: number | string) {
    const precoNumerico = typeof preco === 'string' ? parseFloat(preco) : preco;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(precoNumerico);
  }

  async function handleRecarregar() {
    try {
      carregando.set(true);
      await carregarPedidos();
      mensagem = '✅ Pedidos atualizados com sucesso';
      setTimeout(() => mensagem = '', 2000);
    } catch (error) {
      mensagem = '❌ Erro ao atualizar pedidos';
    } finally {
      carregando.set(false);
    }
  }

  // Obter título da página baseado no tipo de usuário
  $: tituloPagina = $isAdmin ? 'Todos os Pedidos - Painel Administrativo' : 'Minhas Compras';
  $: subtitulo = $isAdmin ? 'Gerencie todos os pedidos do sistema' : 'Acompanhe seus pedidos';
</script>

<svelte:head>
  <title>{tituloPagina}</title>
</svelte:head>

{#if $isLoadingAuth}
  <div class="flex justify-center items-center min-h-screen">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Carregando...</p>
    </div>
  </div>
{:else if !$isLoggedIn}
  <!-- Redirecionando para login -->
  <div class="flex justify-center items-center min-h-screen">
    <div class="text-center">
      <p class="text-gray-600">Redirecionando para login...</p>
    </div>
  </div>
{:else}
  <div class="container mx-auto p-4">
    <!-- Cabeçalho -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">{$isAdmin ? 'Painel de Pedidos' : 'Minhas Compras'}</h1>
        <p class="text-gray-600">{subtitulo}</p>
        {#if !$isAdmin}
          <p class="text-sm text-gray-500">Olá, {$currentUser?.nome_completo}!</p>
        {/if}
      </div>
      
      <div class="flex gap-2">
        <button 
          on:click={handleRecarregar}
          disabled={$carregando}
          class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50 transition"
        >
          {#if $carregando}
            Atualizando...
          {:else}
            ↻ Atualizar
          {/if}
        </button>
        
        {#if $isAdmin}
          <span class="bg-pink-600 text-white px-3 py-2 rounded-full text-sm">
            Modo Administrador
          </span>
        {/if}
      </div>
    </div>

    {#if mensagem}
      <div class="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg animate-fade-in z-50">
        {mensagem}
      </div>
    {/if}

    <!-- Filtros -->
    <div class="flex flex-wrap gap-2 my-4">
      {#each ['TODOS', 'PENDENTE', 'CONFIRMADO', 'PREPARANDO', 'ENVIADO', 'ENTREGUE', 'CANCELADO'] as status}
        <button 
          on:click={() => filtroStatus.set(status)}
          class="px-4 py-2 rounded-full transition-colors duration-200 
            {$filtroStatus === status 
              ? 'bg-pink-700 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
        >
          {status}
          {#if status !== 'TODOS'}
            ({$estatisticasPedidos[status.toLowerCase()] || 0})
          {/if}
        </button>
      {/each}
    </div>

    <!-- Estatísticas -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 my-6 text-center">
      <div class="p-4 bg-gray-100 rounded shadow">{$estatisticasPedidos.total} Total</div>
      <div class="p-4 bg-yellow-100 rounded shadow">{$estatisticasPedidos.pendentes} Pendentes</div>
      <div class="p-4 bg-green-100 rounded shadow">{$estatisticasPedidos.entregues} Entregues</div>
      {#if $isAdmin}
        <div class="p-4 bg-blue-100 rounded shadow">{$estatisticasPedidos.preparando} Preparando</div>
      {:else}
        <div class="p-4 bg-blue-100 rounded shadow">{$estatisticasPedidos.enviados} Enviados</div>
      {/if}
    </div>

    <!-- Lista de pedidos -->
    {#if $carregando && $pedidos.length === 0}
      <div class="text-center py-6">
        {#if $isAdmin}
          Carregando todos os pedidos...
        {:else}
          Carregando suas compras...
        {/if}
      </div>
    {:else if $pedidosFiltrados.length === 0}
      <div class="text-center py-6">
        <p class="text-gray-500 mb-4">
          {#if $isAdmin}
            Nenhum pedido encontrado
          {:else}
            Nenhum pedido encontrado
          {/if}
        </p>
        {#if !$isAdmin}
          <a href="/produtos" class="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition">
            Fazer uma compra
          </a>
        {/if}
      </div>
    {:else}
      <div class="overflow-x-auto bg-white rounded-lg shadow">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pedido</th>
              {#if $isAdmin}
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              {/if}
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {#each $pedidosFiltrados as pedido}
              <tr 
                on:click={() => handleSelecionarPedido(pedido)} 
                class="cursor-pointer hover:bg-gray-50 transition"
              >
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div>
                      <div class="text-sm font-medium text-gray-900">#{pedido.id}</div>
                      <div class="text-sm text-gray-500">{pedido.itens?.length || 0} itens</div>
                    </div>
                  </div>
                </td>
                
                {#if $isAdmin}
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{pedido.usuario?.nome_completo}</div>
                    <div class="text-sm text-gray-500">{pedido.usuario?.email}</div>
                  </td>
                {/if}
                
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatarData(pedido.data_pedido)}
                </td>
                
                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatarPreco(pedido.total)}
                </td>
                
                <td class="px-4 py-4 whitespace-nowrap">
                  <span class={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${STATUS_CLASSES[pedido.status] || DEFAULT_STATUS_CLASS}`}>
                    {pedido.status}
                  </span>
                </td>
                
                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  {#if $isAdmin}
                    <select 
                      on:change={(e) => handleStatusChange(pedido.id, e.target.value)}
                      on:click|stopPropagation
                      value={pedido.status}
                      class="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="PENDENTE">Pendente</option>
                      <option value="CONFIRMADO">Confirmado</option>
                      <option value="PREPARANDO">Preparando</option>
                      <option value="ENVIADO">Enviado</option>
                      <option value="ENTREGUE">Entregue</option>
                      <option value="CANCELADO">Cancelado</option>
                    </select>
                  {:else}
                    <button 
                      on:click|stopPropagation={() => handleSelecionarPedido(pedido)}
                      class="text-pink-600 hover:text-pink-900 bg-pink-50 hover:bg-pink-100 px-3 py-1 rounded text-sm transition"
                    >
                      Ver Detalhes
                    </button>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}

    <!-- Modal de detalhes do pedido -->
    {#if $pedidoSelecionado}
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold">Detalhes do Pedido #{$pedidoSelecionado.id}</h2>
              <button on:click={() => pedidoSelecionado.set(null)} class="text-gray-500 hover:text-gray-700 text-2xl">
                &times;
              </button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 class="font-semibold text-gray-700 mb-2">Informações do Pedido</h3>
                <p><strong>Data:</strong> {formatarData($pedidoSelecionado.data_pedido)}</p>
                <p><strong>Status:</strong> 
                  <span class={`ml-2 px-2 py-1 rounded text-xs border ${STATUS_CLASSES[$pedidoSelecionado.status] || DEFAULT_STATUS_CLASS}`}>
                    {$pedidoSelecionado.status}
                  </span>
                </p>
                <p><strong>Total:</strong> {formatarPreco($pedidoSelecionado.total)}</p>
              </div>
              <div>
                <h3 class="font-semibold text-gray-700 mb-2">Informações de Entrega</h3>
                <p><strong>Nome:</strong> {$pedidoSelecionado.usuario.nome_completo}</p>
                <p><strong>Email:</strong> {$pedidoSelecionado.usuario.email}</p>
                <p><strong>Telefone:</strong> {$pedidoSelecionado.usuario.telefone}</p>
                {#if $isAdmin}
                  <p><strong>CPF:</strong> {$pedidoSelecionado.usuario.cpf}</p>
                {/if}
              </div>
            </div>

            <div class="border-t pt-4">
              <h3 class="font-semibold text-gray-700 mb-3">Itens do Pedido</h3>
              <div class="space-y-3">
                {#each $pedidoSelecionado.itens as item}
                  <div class="flex justify-between items-start border-b pb-2">
                    <div class="flex-1">
                      <p class="font-medium">{item.produto.nome_produto}</p>
                      <p class="text-sm text-gray-600">{item.produto.descricao}</p>
                      <p class="text-sm text-gray-500">Quantidade: {item.quantidade}</p>
                    </div>
                    <div class="text-right">
                      <p class="font-medium">{formatarPreco(item.subtotal)}</p>
                      <p class="text-sm text-gray-500">{formatarPreco(item.preco_unitario)} cada</p>
                    </div>
                  </div>
                {/each}
              </div>
              
              <div class="mt-4 pt-4 border-t">
                <div class="flex justify-between items-center font-bold text-lg">
                  <span>Total do Pedido:</span>
                  <span>{formatarPreco($pedidoSelecionado.total)}</span>
                </div>
              </div>
            </div>

            {#if $isAdmin}
              <div class="mt-6 pt-4 border-t">
                <h3 class="font-semibold text-gray-700 mb-3">Alterar Status (Admin)</h3>
                <select 
                  on:change={(e) => handleStatusChange($pedidoSelecionado.id, e.target.value)}
                  value={$pedidoSelecionado.status}
                  class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="PENDENTE">Pendente</option>
                  <option value="CONFIRMADO">Confirmado</option>
                  <option value="PREPARANDO">Preparando</option>
                  <option value="ENVIADO">Enviado</option>
                  <option value="ENTREGUE">Entregue</option>
                  <option value="CANCELADO">Cancelado</option>
                </select>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>
{/if}