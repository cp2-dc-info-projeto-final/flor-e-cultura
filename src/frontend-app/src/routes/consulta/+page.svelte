<script>
    import { onMount } from 'svelte';
    
    let usuarios = [{
        id: 0,
        nome_completo: "",
        email: '',
        cpf: '',
        telefone: '',
        data_nascimento: '',
        tipo_usuario: 1
      }];
    usuarios.pop()
    let erro = '';
    let search = '';
    // Busca os usuários quando o componente é montado
    async function buscarUsuarios() {
    try {
      const res = await fetch('http://localhost:3000/users/');
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
 
  // Busca os usuários quando o componente é montado
  async function buscarUsuariosPorNome(nome) {
      try {
        const res = await fetch(`http://localhost:3000/users/nome/${nome}`);
        const data = await res.json();

        if (!data.success) {
          erro = data.message || 'Erro ao buscar usuários';
          return;
        }
        else{
          erro = '';
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

         /* POSIVEL CORTEEEEEEEEEEEEEEEEEEEEE usuarios = data.data;
          // Atualiza a lista local removendo o usuário da UI
          usuarios = usuarios.filter(usuario => usuario.id !== id);
          alert(usuarios)*/
          buscarUsuarios();

      } catch (erro) {
        
       console.error('erro ao conectar o servidor',erro);
      }
  }


  onMount(() => {
        buscarUsuarios();
        
  });
   // Quando o usuário digitar, chamamos a busca
   $: if (search.length >= 3) {
    buscarUsuariosPorNome(search);
  }
  else if (search.length === 0) {
    erro = '';
    buscarUsuarios();
    
  }

   else {
    usuarios = []; // Limpa a lista se menos de 3 caracteres
  }
  </script>
  
  <h1 style="text-align: center;" ><b >LISTA DE USUARIOS</b></h1>
  <br>  
  
  <input
  type="text"
  placeholder="Pesquisar usuário por nome..."
  bind:value={search}
/>

<ul>
  {#each usuarios as user}
    <li>{user.name}</li>
  {/each}
</ul>

  {#if erro}
    <p style="color: red">{erro}</p>
  {:else if usuarios.length === 0}
    <p>Nenhum usuário encontrado.</p>
  {:else}
    <table class="w-full text-sm text-left rtl:text-right text-white dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">Nome</th>
          <th scope="col" class="px-6 py-3">Email</th>
        
          <th scope="col" class="px-6 py-3">CPF</th>
          <th scope="col" class="px-6 py-3">Telefone</th>
          <th scope="col" class="px-6 py-3">Data de Nascimento</th>
          <th scope="col" class="px-6 py-3">Tipo de Usuário</th>
        </tr>
      </thead>
      <tbody>
        {#each usuarios as usuario}
          <tr>
            <td>{usuario.nome_completo}</td> 
            <td>{usuario.email}</td>
           
            <td>{usuario.cpf}</td>
            <td>{usuario.telefone}</td>
            <td>{usuario.data_nascimento}</td>
            <td>{usuario.tipo_usuario}</td>
            <td>
              <button class="w-full text-black bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" on:click={() => window.location.href = "/editar?id="+usuario.id}>Editar</button>
            </td>
            <td>
              <button class="w-full text-black bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" on:click={() => removerUsuario(usuario.id)}>Remover</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
  


