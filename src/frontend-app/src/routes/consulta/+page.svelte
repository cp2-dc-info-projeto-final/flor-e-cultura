<script>
    import { onMount } from 'svelte';
    
    let usuarios = [{
        id: 0,
        nome_completo: "",
        email: '',
        senha: '',
        cpf: '',
        telefone: '',
        data_nascimento: '',
        tipo_usuario: 1
      }];
    usuarios.pop()
    let erro = '';
    // Busca os usuários quando o componente é montado
    async function buscarUsuarios() {
    try {
      const res = await fetch('http://localhost:3000/users');
      const data = await res.json();

      if (!data.success) {
        erro = data.message || 'Erro ao buscar usuários';
        return;
      }

      usuarios = data.data;
    } catch (e) {
      erro = 'Erro ao conectar com o servidor';
    }
  }
 
      // Função para remover um usuário
    async function removerUsuario(id) {
      try {
        const res = await fetch(`http://localhost:3000/users/${id}`, {
          method: 'DELETE'
        });

        const data = await res.json();

        if (!data.success) {
          erro = data.message || 'Erro ao buscar usuários';
          return;
        }

        usuarios = data.data;
       // Atualiza a lista local removendo o usuário da UI
       usuarios = usuarios.filter(usuario => usuario.id !== id);
      } catch (e) {
        erro = 'Erro ao conectar com o servidor';
      }
  }


  onMount(() => {
        buscarUsuarios();
  });
  </script>
  
  <h1>Lista de Usuários</h1>
  
  {#if erro}
    <p style="color: red">{erro}</p>
  {:else if usuarios.length === 0}
    <p>Nenhum usuário encontrado.</p>
  {:else}
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Email</th>
          <th>Senha</th>
          <th>CPF</th>
          <th>Telefone</th>
          <th>Data de Nascimento</th>
          <th>Tipo de Usuário</th>
        </tr>
      </thead>
      <tbody>
        {#each usuarios as usuario}
          <tr>
            <td>{usuario.nome_completo}</td> 
            <td>{usuario.email}</td>
            <td>{usuario.senha}</td>
            <td>{usuario.cpf}</td>
            <td>{usuario.telefone}</td>
            <td>{usuario.data_nascimento}</td>
            <td>{usuario.tipo_usuario}</td>
            <td>
              <button class="w-full text-black bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" on:click={() => removerUsuario(usuario.id)}>Remover</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
  


