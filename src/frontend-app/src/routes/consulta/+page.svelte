<script>
  import { onMount } from 'svelte';

  let usuarios = [];
  let erro = '';
  let search = '';

  async function buscarUsuarios() {
    try {
      const res = await fetch('http://localhost:3000/users/');
      const data = await res.json();

      if (!data.success) {
        erro = data.message || 'Erro ao buscar usuários';
        return;
      }

      erro = '';
      usuarios = data.data;
    } catch (e) {
      erro = 'Erro ao conectar com o servidor';
    }
  }

  async function buscarUsuariosPorNome(nome) {
    try {
      const res = await fetch(`http://localhost:3000/users/nome/${nome}`);
      const data = await res.json();

      if (!data.success) {
        erro = data.message || 'Erro ao buscar usuários';
        return;
      }

      erro = '';
      usuarios = data.data;
    } catch (e) {
      erro = 'Erro ao conectar com o servidor';
    }
  }

  async function removerUsuario(id) {
    try {
      const res = await fetch(`http://localhost:3000/users/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (!data.success) {
        erro = data.message || 'Erro ao remover usuário';
        return;
      }

      if (search.length >= 3) {
        buscarUsuariosPorNome(search);
      } else {
        buscarUsuarios();
      }

    } catch (e) {
      console.error('Erro ao conectar ao servidor', e);
    }
  }

  onMount(() => {
    buscarUsuarios();
  });

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

<!-- Container principal -->
<div class="max-w-6xl mx-auto px-4 sm:px-6 py-6">
  <h1 class="text-2xl font-bold text-center mb-6">LISTA DE USUÁRIOS</h1>

  <!-- Campo de pesquisa -->
  <input
    type="text"
    placeholder="Pesquisar usuário por nome..."
    bind:value={search}
    class="w-full mb-6 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <!-- Exibe mensagens -->
  {#if erro}
    <p class="text-red-500 mb-4">{erro}</p>
  {:else if usuarios.length === 0}
    <p class="text-gray-600">Nenhum usuário encontrado.</p>
  {:else}
    <!-- Lista de cards responsivos -->
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
              on:click={() => window.location.href = `/editar?id=${usuario.id}`}
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
