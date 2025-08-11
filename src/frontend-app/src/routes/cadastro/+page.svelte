<script>
    let nome = '';
    let email = '';
    let dataNascimento = '';
    let cpf = '';
    let telefone = '';
    let senha = '';
    let confirmarSenha = '';
  
    async function cadastrarUsuario() {
      if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
      }
  
      const usuario = {
        nome_completo: nome,
        email,
        senha,
        cpf,
        telefone,
        data_nascimento: dataNascimento,
        tipo_usuario: 1
      };
  
      try {
        const response = await fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(usuario)
        });
  
        const result = await response.json();
  
        if (response.ok && result.success) {
          alert('Usuário cadastrado com sucesso!');
          nome = '';
          email = '';
          dataNascimento = '';
          cpf  = '';
          telefone  = '';
          senha = '';
          confirmarSenha = '';
        } else {
          alert(`Erro: ${result.message}`);
        }
      } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        alert('Erro ao conectar com o servidor.');
      }
    }
  </script>
<section>
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Cadastre-se
                </h1>
                <form on:submit|preventDefault={cadastrarUsuario} class="space-y-4 md:space-y-6" action="#">
                    <div>
                        <label for="nome" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome</label>
                        <input type="text" name="nome" id="nome" bind:value={nome} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Fulano Beltrano Silva" required>
                    </div>
                    <div>
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                        <input type="email" name="email" id="email" bind:value={email} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="nome@compania.com" required>
                    </div>
                    <div>
                        <label for="data-nascimento" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Data de nascimento</label>
                        <input type="date" name="data-nascimento" id="data-nascimento" bind:value={dataNascimento} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                    </div>

                    <div>
                        <label for="cpf" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">CPF</label>
                        <input type="text" bind:value={cpf} name="cpf" id="cpf" placeholder="Seu CPF" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                    </div>
                    <div>
                        <label for="telefone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">telefone</label>
                        <input type="text" bind:value={telefone} name="telefone" id="telefone" placeholder="Seu telefone" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                    </div>
                    <div>
                        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha</label>
                        <input type="password" name="password" id="password" bind:value={senha}  placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                    </div>
                    <div>
                        <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirme sua senha</label>
                        <input type="password" name="confirm-password" id="confirm-password" bind:value={confirmarSenha} placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                    </div>
                    <button id="cadastro" type="submit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Crie uma conta</button>
                    <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                        Ja possui uma conta? <a href="#" class="font-medium text-primary-600 hover:underline dark:text-primary-500">faça login</a>
                    </p>
                </form>
            </div>
        </div>
    </div>
  </section>