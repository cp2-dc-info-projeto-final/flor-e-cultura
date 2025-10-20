import { writable, derived } from 'svelte/store';
import { getCurrentUser, getToken, type User } from '$lib/auth';

// Store para o usuário atual
export const currentUser = writable<User | null>(null);

// Store para indicar se está carregando
export const isLoadingAuth = writable<boolean>(true);

// Store derivada para verificar se está logado
export const isLoggedIn = derived(
  currentUser,
  ($currentUser) => $currentUser !== null
);

// Store derivada para verificar se é admin
export const isAdmin = derived(
  currentUser,
  ($currentUser) => $currentUser?.tipo_usuario === 'admin'
);

// Função para atualizar o usuário atual
export async function refreshUser() {
  isLoadingAuth.set(true);
  try {
    const token = getToken();
    if (token) {
      const user = await getCurrentUser();
      currentUser.set(user);
    } else {
      currentUser.set(null);
    }
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    currentUser.set(null);
  } finally {
    isLoadingAuth.set(false);
  }
}

// Função para limpar o usuário (logout)
export function clearUser() {
  currentUser.set(null);
}
