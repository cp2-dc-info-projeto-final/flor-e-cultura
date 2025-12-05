<!-- src/routes/compra/+page.svelte -->
<script lang="ts">
  import { carrinho, totalPrice, limparCarrinho } from '$lib/stores/carrinho';
  import { currentUser, isLoggedIn } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import api from '$lib/api';

  $: total = $totalPrice;
  let mensagem: string | null = null;

  // Modal e endereço
  let mostrarModal = false;
  let endereco = {
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: ''
  };
  let enderecoErro = '';

  // Protege a rota: se não estiver logado, guarda intenção e manda para login
  if (!$isLoggedIn) {
    mensagem = 'Você precisa estar logado para acessar a página de compra!';
    sessionStorage.setItem('redirectAfterLogin', '/compra');
    setTimeout(() => goto('/login'), 2000);
  }

  function abrirModal() {
    mostrarModal = true;
  }

  async function confirmarCompraComEndereco() {
    // Validação simples dos campos do endereço
    if (
      !endereco.rua ||
      !endereco.numero ||
      !endereco.bairro ||
      !endereco.cidade ||
      !endereco.estado ||
      !endereco.cep
    ) {
      enderecoErro = 'Preencha todos os campos!';
      return;
    }
    enderecoErro = '';
    mostrarModal = false;

    try {
      const response = await api.post('/checkout', {
        itens: $carrinho.map(item => ({
          produtoId: item.id,
          quantidade: item.quantidade
        })),
        endereco: { ...endereco }
      });
      mensagem = `Compra confirmada para ${$currentUser?.nome_completo}! Total: R$ ${total.toFixed(2)}`;
      limparCarrinho();
      setTimeout(() => goto('/'), 3000);
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.error) {
        mensagem = `Erro: ${err.response.data.error}`;
      } else {
        mensagem = 'Erro de conexão com servidor';
      }
    }
  }
</script>

<div class="max-w-3xl mx-auto p-6">
  <h1 class="text-2xl font-bold mb-4">Finalizar Compra</h1>

  {#if mensagem}
    <div class="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">
      {mensagem}
    </div>
  {/if}

  {#if mostrarModal}
    <div class="fixed inset-0  flex items-center justify-center z-50">
      <div class="bg-white rounded p-6 w-full max-w-md shadow-lg border-double border-4">
        <h2 class="text-lg font-bold mb-4">Informe seu endereço</h2>
        <div class="mb-2">
          <input class="border p-2 w-full mb-2" placeholder="Rua" bind:value={endereco.rua} />
          <input class="border p-2 w-full mb-2" placeholder="Número" bind:value={endereco.numero} />
          <input class="border p-2 w-full mb-2" placeholder="Bairro" bind:value={endereco.bairro} />
          <input class="border p-2 w-full mb-2" placeholder="Cidade" bind:value={endereco.cidade} />
          <input class="border p-2 w-full mb-2" placeholder="Estado" bind:value={endereco.estado} />
          <input class="border p-2 w-full mb-2" placeholder="CEP" bind:value={endereco.cep} />
          {#if enderecoErro}
            <div class="text-red-500 text-sm mb-2">{enderecoErro}</div>
          {/if}
        </div>
        <div class="flex gap-2 justify-end">
          <button class="px-4 py-2 bg-gray-200 rounded bg-gray-300" on:click={() => mostrarModal = false}>Cancelar</button>
          <button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" on:click={confirmarCompraComEndereco}>Confirmar</button>
        </div>
      </div>
    </div>
  {/if}

  {#if $isLoggedIn}
    <p class="mb-4">Usuário: {$currentUser?.nome}</p>

    {#each $carrinho as item}
      <div class="flex justify-between border-b py-2">
        <span>
          {item.nome} — 
          {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.preco)} 
          (x{item.quantidade})
        </span>
        <span>
          {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.preco * item.quantidade)}
        </span>
      </div>
    {/each}

    <div class="mt-4 font-bold text-green-600">
      Total: {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
    </div>

    <button
      on:click={abrirModal}
      class="mt-6 w-full bg-green-500 hover:bg-green-700 text-white py-3 rounded-lg"
    >
      Confirmar Compra
    </button>
  {/if}
</div>