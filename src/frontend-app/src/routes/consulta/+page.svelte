<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import api from '$lib/api';

  type User = {
    id: number;
    nome_completo: string;
    email: string;
    cpf: string;
    telefone: string;
    data_nascimento: string;
    tipo_usuario: string;
  };

  let usuarios: User[] = [];
  let erro = '';
  let search = '';

  // Buscar todos os usuários
  async function buscarUsuarios() {
    erro = '';
    try {
      const res = await api.get('/users');
      usuarios = res.data.data;
    } catch (e: any) {
      erro = e.response?.data?.message || 'Erro ao buscar usuários';
    }
  }

  // Buscar usuários por nome
  async function buscarUsuariosPorNome(nome: string) {
    erro = '';
    try {
      const res = await api.get(`/users/nome/${nome}`);
      usuarios = res.data.data;
    } catch (e: any) {
      erro = e.response?.data?.message || 'Erro ao buscar usuários por nome';
    }
  }

  // Remover usuário
  async function removerUsuario(id: number) {
    try {
      await api.delete(`/users/${id}`);
      // Recarrega a lista após remoção
      search.length >= 3 ? buscarUsuariosPorNome(search) : buscarUsuarios();
    } catch (e: any) {
      erro = e.response?.data?.message || 'Erro ao remover usuário';
    }
  }

  // Carrega usuários ao montar o componente
  onMount(() => {
    buscarUsuarios();
  });

  // Reatividade da busca
  $: {
    if (search.length >= 3) {
      buscarUsuariosPorNome(search);
    } else if (search.length === 0) {
      buscarUsuarios();
    } else {
      usuarios = [];
      erro = 'Digite pelo menos 3 caracteres para buscar.';
    }
  }
</script>

<!-- Interface -->
<div class="max-w-6xl mx-auto px-4 sm:px-6 py-6">
  <h1 class="text-2xl font-bold text-center mb-6">LISTA DE USUÁRIOS</h1>

  <!-- Campo de busca -->
  <input
    type="text"
    placeholder="Pesquisar usuário por nome..."
    bind:value={search}
    class="w-full mb-6 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <!-- Mensagens -->
  {#if erro}
    <p class="text-red-500 mb-4">{erro}</p>
  {:else if usuarios.length === 0}
    <p class="text-gray-600">Nenhum usuário encontrado.</p>
  {:else}
    <!-- Lista de usuários -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each usuarios as usuario}
        <div class="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between">
          <div class="space-y-1">
            <p><span class="font-semibold">Nome:</span> {usuario.nome_completo}</p>
            <p><span class="font-semibold">Email:</span> {usuario.email}</p>
            <p><span class="font-semibold">CPF:</span> {usuario.cpf}</p>
            <p><span class="font-semibold">Telefone:</span> {usuario.telefone}</p>
            <p><span class="font-semibold">Nascimento:</span> {usuario.data_nascimento}</p>
            <p><span class="font-semibold">Tipo:</span> {usuario.tipo_usuario}</p>
          </div>

          <!-- Botões -->
          <div class="mt-4 flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
            <button
              class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm w-full"
              on:click={() => goto(`/editar?id=${usuario.id}`)}
            >
              Editar
            </button>
            <button
              class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm w-full"
              on:click={() => removerUsuario(usuario.id)}
            >
              Remover
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

