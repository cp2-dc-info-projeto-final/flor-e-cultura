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

  let showConfirm = false; // controla se o modal aparece
  let idConfirmacao = 0;

  async function confirmRemocao() {
      try {
          await removerUsuario(idConfirmacao);
      } catch (error) {
          console.error('Erro na remoção:', error);
      }
      showConfirm = false;
      idConfirmacao = 0;
  }

  function cancelRemocao() {
      showConfirm = false;
      idConfirmacao = 0;
  }

  function handleRemocao(id: number) {
      idConfirmacao = id;
      showConfirm = true; // abre o modal
  }


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
  <h1 class="text-2xl font-bold text-center mb-6">𝐋𝐢𝐬𝐭𝐚 𝐝𝐞 𝐔𝐬𝐮𝐚𝐫𝐢𝐨𝐬</h1>

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
            <p><span class="font">𝐍𝐨𝐦𝐞:</span> {usuario.nome_completo}</p>
            <p><span class="font">𝐄𝐦𝐚𝐢𝐥:</span> {usuario.email}</p>
            <p><span class="font">𝐂𝐏𝐅:</span> {usuario.cpf}</p>
            <p><span class="font">𝐓𝐞𝐥𝐞𝐟𝐨𝐧𝐞:</span> {usuario.telefone}</p>
            <p><span class="font">𝐃𝐚𝐭𝐚 𝐝𝐞 𝐧𝐚𝐬𝐜𝐢𝐦𝐞𝐧𝐭𝐨:</span> {usuario.data_nascimento}</p>
            <p><span class="font">𝐓𝐢𝐩𝐨:</span> {usuario.tipo_usuario}</p>
          </div>

          <!-- Botões -->
          <div class="mt-4 flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
            <button
              class="bg-green-400 hover:bg-green-600 text-white px-3 py-2 rounded text-sm w-full"
              on:click={() => goto(`/editar?id=${usuario.id}`)}
              
            >
            ✏️
            </button>
            <button
              class="bg-pink-400 hover:bg-pink-700 text-white px-3 py-2 rounded text-sm w-full"
              on:click={() => handleRemocao(usuario.id)}
             
            >
            🗑️
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- Modal de confirmação -->
{#if showConfirm} 
  <!-- Overlay transparente -->
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <!-- Bloco do modal -->
    <div class="bg-white rounded shadow-lg p-6 w-80 border-double border-4">
      <h2 class="text-lg mb-4">𝐂𝐨𝐧𝐟𝐢𝐫𝐦𝐚𝐫 𝐑𝐞𝐦𝐨𝐜𝐚𝐨</h2>
      <p class="mb-6">Tem certeza que deseja remover a conta deste usuário? Esta ação é irreversível</p>
      <div class="flex justify-end gap-4">
        <button on:click={cancelRemocao} class="px-4 py-2 bg-green-400 text-white rounded hover:bg-green-500">
          Cancelar
        </button>
        <button on:click={confirmRemocao} class="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600">
          Confirmar
        </button>
      </div>
    </div>
  </div>
{/if}