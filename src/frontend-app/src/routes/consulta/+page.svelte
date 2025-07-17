<script>
    let usuarios = [];
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
          <th>ID</th>
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
            <td>{usuario.id}</td>
            <td>{usuario.nome_completo}</td>
            <td>{usuario.email}</td>
            <td>{usuario.senha}</td>
            <td>{usuario.cpf}</td>
            <td>{usuario.telefone}</td>
            <td>{usuario.data_nascimento}</td>
            <td>{usuario.tipo_usuario}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
  