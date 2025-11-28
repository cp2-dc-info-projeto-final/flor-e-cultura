<!-- routes/admin/pedidos/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { currentUser, isLoggedIn, isLoadingAuth, isAdmin, } from '$lib/stores/auth';
  import { 
    pedidos, 
    pedidosFiltrados, 
    pedidosNaoVisualizados, 
    filtroStatus, 
    carregando,
    carregarPedidos, 
    atualizarStatusPedido,
    marcarComoVisualizado,
    pedidoSelecionado,
    obterDetalhesPedido,
    notificacoes
  } from '$lib/stores/pedidos';
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
    if (!$isLoggedIn || $currentUser?.tipo_usuario !== 'admin') {
      goto('/');
      return;
    }
    try {
      carregarPedidos();
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      mensagem = 'Erro ao carregar pedidos. Tente novamente.';
    }
  });

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
      marcarComoVisualizado(pedido.id);
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
</script>

<svelte:head>
  {#if $isAdmin && !$isLoadingAuth}
  <title>Painel Administrativo - Pedidos</title>
  {/if}
</svelte:head>

{#if $pedidosNaoVisualizados > 0}
  <span class="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
    {$pedidosNaoVisualizados}
  </span>
{/if}

{#if mensagem}
  <div class="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
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
        ({$pedidos.filter(p => p.status === status).length})
      {/if}
    </button>
  {/each}
</div>

<!-- Estatísticas -->
<div class="grid grid-cols-2 md:grid-cols-4 gap-4 my-6 text-center">
  <div class="p-4 bg-gray-100 rounded shadow">{$pedidos.length} Total</div>
  <div class="p-4 bg-yellow-100 rounded shadow">{$pedidos.filter(p => p.status === 'PENDENTE').length} Pendentes</div>
  <div class="p-4 bg-green-100 rounded shadow">{$pedidos.filter(p => p.status === 'ENTREGUE').length} Entregues</div>
  <div class="p-4 bg-red-100 rounded shadow">{$pedidosNaoVisualizados} Não Visualizados</div>
</div>

<!-- Lista de pedidos -->
{#if $carregando && $pedidos.length === 0}
  <div class="text-center py-6">Carregando pedidos...</div>
{:else if $pedidosFiltrados.length === 0}
  <div class="text-center py-6">Nenhum pedido encontrado</div>
{:else}
  <div class="overflow-x-auto">
    <table class="min-w-full border border-gray-200 rounded-lg shadow-sm">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-4 py-2 text-left">Pedido</th>
          <th class="px-4 py-2 text-left">Cliente</th>
          <th class="px-4 py-2 text-left">Data</th>
          <th class="px-4 py-2 text-left">Total</th>
          <th class="px-4 py-2 text-left">Status</th>
          <th class="px-4 py-2 text-left">Ações</th>
        </tr>
      </thead>
      <tbody>
        {#each $pedidosFiltrados as pedido}
          <tr 
            on:click={() => handleSelecionarPedido(pedido)} 
            class="cursor-pointer hover:bg-gray-100 transition"
          >
            <td class="px-4 py-2">
              {#if !$notificacoes.some(n => n.pedidoId === pedido.id && n.vista)}
                <span class="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              {/if}
              #{pedido.id}
              <small class="block text-gray-500">{pedido.itens?.length || 0} itens</small>
            </td>
            <td class="px-4 py-2">
              {pedido.usuario?.nome_completo}
              <small class="block text-gray-500">{pedido.usuario?.email}</small>
            </td>
            <td class="px-4 py-2">{formatarData(pedido.data_pedido)}</td>
            <td class="px-4 py-2">{formatarPreco(pedido.total)}</td>
            <td class="px-4 py-2">
              <span class={`px-2 py-1 rounded text-xs border ${STATUS_CLASSES[pedido.status] || DEFAULT_STATUS_CLASS}`}>
                {pedido.status}
              </span>
            </td>
            <td class="px-4 py-2">
              <select 
                on:change={(e) => handleStatusChange(pedido.id, e.target.value)}
                on:click|stopPropagation
                class="text-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PENDENTE">Pendente</option>
                <option value="CONFIRMADO">Confirmado</option>
                <option value="PREPARANDO">Preparando</option>
                <option value="ENVIADO">Enviado</option>
                <option value="ENTREGUE">Entregue</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

