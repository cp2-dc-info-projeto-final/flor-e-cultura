import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface ItemCarrinho {
  id: number;
  nome_produto: string;
  descricao: string;
  preco: string;
  quantidade: number;
  imagem?: string;
}

// Recupera o carrinho do localStorage se estiver no browser
const carrinhoInicial: ItemCarrinho[] = browser 
  ? JSON.parse(localStorage.getItem('carrinho') || '[]')
  : [];

export const carrinho = writable<ItemCarrinho[]>(carrinhoInicial);

// Salva no localStorage sempre que o carrinho mudar
if (browser) {
  carrinho.subscribe((value) => {
    localStorage.setItem('carrinho', JSON.stringify(value));
  });
}

export function adicionarAoCarrinho(produto: Omit<ItemCarrinho, 'quantidade'>) {
  carrinho.update(items => {
    const itemExistente = items.find(item => item.id === produto.id);
    
    if (itemExistente) {
      // Se já existe, aumenta a quantidade
      return items.map(item =>
        item.id === produto.id
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      );
    } else {
      // Se não existe, adiciona novo item com quantidade 1
      return [...items, { ...produto, quantidade: 1 }];
    }
  });
}

export function removerDoCarrinho(id: number) {
  carrinho.update(items => items.filter(item => item.id !== id));
}

export function atualizarQuantidade(id: number, quantidade: number) {
  if (quantidade <= 0) {
    removerDoCarrinho(id);
    return;
  }

  carrinho.update(items =>
    items.map(item =>
      item.id === id ? { ...item, quantidade } : item
    )
  );
}

export function limparCarrinho() {
  carrinho.set([]);
}

export function getTotalItens() {
  let total = 0;
  carrinho.subscribe(items => {
    total = items.reduce((sum, item) => sum + item.quantidade, 0);
  })();
  return total;
}

export function getTotalPreco() {
  let total = 0;
  carrinho.subscribe(items => {
    total = items.reduce((sum, item) => {
      const preco = parseFloat(item.preco) || 0;
      return sum + (preco * item.quantidade);
    }, 0);
  })();
  return total;
}