// lib/stores/pedidos.ts
// lib/stores/pedidos.ts
import { writable, derived, type Writable, type Readable } from 'svelte/store';
import { browser } from '$app/environment';
import api from '$lib/api'; // Sua instância do Axios

// Tipos
export interface Pedido {
  id: number;
  status: string;
  [key: string]: any; // Campos adicionais vindos da API
}

export interface Notificacao {
  pedidoId: number;
  vista: boolean;
  dataVisualizacao: Date;
}

// Stores
export const pedidos: Writable<Pedido[]> = writable([]);
export const notificacoes: Writable<Notificacao[]> = writable([]);

export const filtroStatus: Writable<string> = writable('TODOS');
export const pedidoSelecionado: Writable<Pedido | null> = writable(null);
export const carregando: Writable<boolean> = writable(false);

// Pedidos não visualizados
export const pedidosNaoVisualizados: Readable<number> = derived(
  [pedidos, notificacoes],
  ([$pedidos, $notificacoes]) =>
    $pedidos.filter(
      (pedido) =>
        !$notificacoes.some(
          (notif) => notif.pedidoId === pedido.id && notif.vista
        )
    ).length
);

// Pedidos filtrados
export const pedidosFiltrados: Readable<Pedido[]> = derived(
  [pedidos, filtroStatus],
  ([$pedidos, $filtroStatus]) => {
    if ($filtroStatus === 'TODOS') return $pedidos;
    return $pedidos.filter((pedido) => pedido.status === $filtroStatus);
  }
);

// Funções
export async function carregarPedidos(): Promise<void> {
  carregando.set(true);
  try {
    const response = await api.get<Pedido[]>('/pedidos');
    pedidos.set(response.data);

    // Marcar como visualizados
    if (browser) {
      const novosIds = response.data.map((p) => p.id);
      marcarComoVisualizado(novosIds);
    }
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

export function marcarComoVisualizado(pedidoIds: number | number[]): void {
  if (!Array.isArray(pedidoIds)) pedidoIds = [pedidoIds];

  notificacoes.update((notifs) => {
    const novasNotificacoes = [...notifs];

    pedidoIds.forEach((id) => {
      const index = novasNotificacoes.findIndex((n) => n.pedidoId === id);
      if (index === -1) {
        novasNotificacoes.push({
          pedidoId: id,
          vista: true,
          dataVisualizacao: new Date(),
        });
      } else {
        novasNotificacoes[index].vista = true;
        novasNotificacoes[index].dataVisualizacao = new Date();
      }
    });

    // Salvar na sessionStorage (apenas durante a sessão do admin)
    if (browser) {
      sessionStorage.setItem(
        'notificacoesPedidos',
        JSON.stringify(novasNotificacoes)
      );
    }

    return novasNotificacoes;
  });
}

// Carregar notificações salvas da sessão
if (browser) {
  const salvas = sessionStorage.getItem('notificacoesPedidos');
  if (salvas) {
    try {
      const parsed: Notificacao[] = JSON.parse(salvas);
      notificacoes.set(
        parsed.map((n) => ({
          ...n,
          dataVisualizacao: new Date(n.dataVisualizacao),
        }))
      );
    } catch {
      console.error('Erro ao carregar notificações da sessão');
    }
  }
}
