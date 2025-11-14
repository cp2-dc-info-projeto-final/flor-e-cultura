<!-- routes/admin/pedidos/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { currentUser, isLoggedIn } from '$lib/stores/auth';
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
   
    // 👈 CORREÇÃO: Constante com classes estáticas e explícitas
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
      // 1. Verificar se é admin
      if (!$isLoggedIn || $currentUser?.tipo_usuario !== 'admin') {
        goto('/');
        return;
      }
   
      // 2. Carregar os pedidos uma única vez ao montar
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
    
    // A função getStatusColor foi removida
   
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
    <title>Painel Administrativo - Pedidos</title>
  </svelte:head>
   
  {#if $pedidosNaoVisualizados > 0}
<span class="notification-badge">{$pedidosNaoVisualizados}</span>
{/if}

<button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50">
    Atualizar Manualmente
</button>

{#if mensagem}
<div class="message">{mensagem}</div>
{/if}

<div class="status-filters">
    {#each ['TODOS', 'PENDENTE', 'CONFIRMADO', 'PREPARANDO', 'ENVIADO', 'ENTREGUE', 'CANCELADO'] as status}
        <button 
            on:click={() => filtroStatus.set(status)}
            class="px-4 py-2 rounded-full {$filtroStatus === status ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
        >
            {status}
            {#if status !== 'TODOS'}
                ({$pedidos.filter(p => p.status === status).length})
            {/if}
        </button>
    {/each}
</div>

<div class="stats">
    <div>{$pedidos.length} Total de Pedidos</div>
    <div>{$pedidos.filter(p => p.status === 'PENDENTE').length} Pendentes</div>
    <div>{$pedidos.filter(p => p.status === 'ENTREGUE').length} Entregues</div>
    <div>{$pedidosNaoVisualizados} Não Visualizados</div>
</div>

{#if $carregando && $pedidos.length === 0}
    <div>Carregando pedidos...</div>
{:else if $pedidosFiltrados.length === 0}
    <div>Nenhum pedido encontrado</div>
{:else}
    <table>
        <thead>
            <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Data</th>
                <th>Total</th>
                <th>Status</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            {#each $pedidosFiltrados as pedido}
                <tr on:click={() => handleSelecionarPedido(pedido)}>
                    <td>
                        {#if !$notificacoes.some(n => n.pedidoId === pedido.id && n.vista)}
                            <span class="new-notification"></span>
                        {/if}
                        #{pedido.id}
                        <small>{pedido.itens?.length || 0} itens</small>
                    </td>
                    <td>
                        {pedido.usuario?.nome_completo}
                        <small>{pedido.usuario?.email}</small>
                    </td>
                    <td>{formatarData(pedido.data_pedido)}</td>
                    <td>{formatarPreco(pedido.total)}</td>
                    <td>{pedido.status}</td>
                    <td>
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
{/if}

{#if $pedidoSelecionado}
<div class="pedido-detalhes">
    <h3>Detalhes do Pedido #{pedidoSelecionado.id}</h3>
    <button on:click={() => pedidoSelecionado.set(null)} class="close-button">×</button>
    
    <div class="cliente-info">
        <h4>Informações do Cliente</h4>
        <p>Nome: {$pedidoSelecionado.usuario?.nome_completo}</p>
        <p>Email: {$pedidoSelecionado.usuario?.email}</p>
        <p>Telefone: {$pedidoSelecionado.usuario?.telefone}</p>
        <p>CPF: {$pedidoSelecionado.usuario?.cpf}</p>
    </div>
    
    <div class="pedido-info">
        <h4>Informações do Pedido</h4>
        <p>Data: {formatarData($pedidoSelecionado.data_pedido)}</p>
        <p>Status: {$pedidoSelecionado.status}</p>
        <p>Total: {formatarPreco($pedidoSelecionado.total)}</p>
    </div>
    
    <div class="itens-pedido">
        <h4>Itens do Pedido</h4>
        {#each $pedidoSelecionado.itens || [] as item}
            <div class="item">
                <p>{item.produto?.nome_produto}</p>
                <p>Quantidade: {item.quantidade}</p>
                <p>{formatarPreco(item.preco_unitario)} cada</p>
                <p>Subtotal: {formatarPreco(item.subtotal)}</p>
            </div>
        {/each}
    </div>
    
    <button on:click={() => pedidoSelecionado.set(null)} class="btn-fechar">Fechar</button>
    
    <select 
        on:change={(e) => handleStatusChange($pedidoSelecionado.id, e.target.value)}
        class="status-select"
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