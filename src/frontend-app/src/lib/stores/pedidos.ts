import { writable, derived, type Writable, type Readable, get } from 'svelte/store';
import { browser } from '$app/environment';
import api from '$lib/api';
import { currentUser, isAdmin, isLoggedIn } from '$lib/stores/auth';

// Tipos
export interface Pedido {
  id: number;
  usuario_id: number;
  status: string;
  total: number;
  data_pedido: string;
  usuario: {
    nome_completo: string;
    email: string;
    telefone: string;
    cpf: string;
  };
  itens: Array<{
    id: number;
    quantidade: number;
    preco_unitario: number;
    subtotal: number;
    produto: {
      nome_produto: string;
      descricao: string;
    };
  }>;
  [key: string]: any;
}

// Stores
export const pedidos: Writable<Pedido[]> = writable([]);
export const filtroStatus: Writable<string> = writable('TODOS');
export const pedidoSelecionado: Writable<Pedido | null> = writable(null);
export const carregando: Writable<boolean> = writable(false);

// Pedidos filtrados (funciona para ambos)
export const pedidosFiltrados: Readable<Pedido[]> = derived(
  [pedidos, filtroStatus, currentUser, isAdmin],
  ([$pedidos, $filtroStatus, $currentUser, $isAdmin]) => {
    let pedidosParaFiltrar = $pedidos;
    
    // Se for usuário comum, mostrar apenas seus pedidos
    if ($currentUser && !$isAdmin) {
      pedidosParaFiltrar = $pedidos.filter(pedido => pedido.usuario_id === $currentUser.id);
    }
    
    if ($filtroStatus === 'TODOS') return pedidosParaFiltrar;
    return pedidosParaFiltrar.filter((pedido) => pedido.status === $filtroStatus);
  }
);

// Estatísticas (adaptáveis)
export const estatisticasPedidos = derived(
  [pedidos, currentUser, isAdmin],
  ([$pedidos, $currentUser, $isAdmin]) => {
    let pedidosParaCalcular = $pedidos;
    
    if ($currentUser && !$isAdmin) {
      pedidosParaCalcular = $pedidos.filter(pedido => pedido.usuario_id === $currentUser.id);
    }
    
    return {
      total: pedidosParaCalcular.length,
      pendentes: pedidosParaCalcular.filter(p => p.status === 'PENDENTE').length,
      entregues: pedidosParaCalcular.filter(p => p.status === 'ENTREGUE').length,
      enviados: pedidosParaCalcular.filter(p => p.status === 'ENVIADO').length,
      confirmados: pedidosParaCalcular.filter(p => p.status === 'CONFIRMADO').length,
      preparando: pedidosParaCalcular.filter(p => p.status === 'PREPARANDO').length,
      cancelados: pedidosParaCalcular.filter(p => p.status === 'CANCELADO').length
    };
  }
);

// Funções principais
export async function carregarPedidos(): Promise<void> {
  // Verificar se está logado antes de carregar
  if (!get(isLoggedIn)) {
    throw new Error('Usuário não está logado');
  }

  carregando.set(true);
  try {
    const response = await api.get<Pedido[]>('/pedidos');
    pedidos.set(response.data);
  } catch (error) {
    console.error('Erro ao carregar pedidos:', error);
    throw error;
  } finally {
    carregando.set(false);
  }
}

export async function atualizarStatusPedido(
  pedidoId: number,
  novoStatus: string
): Promise<boolean> {
  // Verificar se é admin antes de tentar atualizar
  if (!get(isAdmin)) {
    throw new Error('Apenas administradores podem atualizar status de pedidos');
  }

  try {
    const response = await api.patch<Partial<Pedido>>(
      `/pedidos/${pedidoId}`,
      { status: novoStatus }
    );

    // Atualiza localmente
    pedidos.update((lista) =>
      lista.map((pedido) =>
        pedido.id === pedidoId ? { ...pedido, ...response.data } : pedido
      )
    );
    return true;
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    throw error;
  }
}

export async function obterDetalhesPedido(
  pedidoId: number
): Promise<Pedido> {
  try {
    const response = await api.get<Pedido>(`/pedidos/${pedidoId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter detalhes do pedido:', error);
    throw error;
  }
}

// Função para criar um novo pedido (para usuários comuns)
export async function criarPedido(dadosPedido: {
  itens: Array<{
    produto_id: number;
    quantidade: number;
    preco_unitario: number;
  }>;
  total: number;
}): Promise<Pedido> {
  // Verificar se está logado antes de criar pedido
  if (!get(isLoggedIn)) {
    throw new Error('Usuário não está logado');
  }

  try {
    const response = await api.post<Pedido>('/pedidos', dadosPedido);
    
    // Adiciona o novo pedido à store
    pedidos.update(lista => [response.data, ...lista]);
    
    return response.data;
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    throw error;
  }
}

// Limpar store quando o usuário fizer logout
isLoggedIn.subscribe(($isLoggedIn) => {
  if (!$isLoggedIn) {
    pedidos.set([]);
    filtroStatus.set('TODOS');
    pedidoSelecionado.set(null);
  }
});