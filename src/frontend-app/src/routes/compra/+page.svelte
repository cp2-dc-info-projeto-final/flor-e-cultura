<!-- src/routes/compra/+page.svelte -->
<script lang="ts">
    import { carrinho, totalPrice, limparCarrinho } from '$lib/stores/carrinho';
    import { currentUser, isLoggedIn } from '$lib/stores/auth';
    import { goto } from '$app/navigation';
  
    $: total = $totalPrice;
    let mensagem: string | null = null;
  
    // Protege a rota: se não estiver logado, guarda intenção e manda para login
    if (!$isLoggedIn) {
      mensagem = 'Você precisa estar logado para acessar a página de compra!';
      sessionStorage.setItem('redirectAfterLogin', '/compra');
      setTimeout(() => goto('/login'), 2000);
    }
  
    async function confirmarCompra() {
      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${$currentUser?.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            usuarioId: $currentUser?.id,
            itens: $carrinho
          })
        });
  
        if (response.ok) {
          mensagem = `Compra confirmada para ${$currentUser?.nome}! Total: R$ ${total.toFixed(2)}`;
          limparCarrinho();
          setTimeout(() => goto('/'), 3000);
        } else {
          mensagem = 'Erro ao finalizar compra';
        }
      } catch (err) {
        console.error(err);
        mensagem = 'Erro de conexão com servidor';
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
  
    {#if $isLoggedIn}
      <p class="mb-4">Usuário: {$currentUser?.nome}</p>
  
      {#each $carrinho as item}
        <div class="flex justify-between border-b py-2">
          <span>{item.nome_produto} (x{item.quantidade})</span>
          <span>R$ {item.preco}</span>
        </div>
      {/each}
  
      <div class="mt-4 font-bold text-green-600">
        Total: R$ {total.toFixed(2)}
      </div>
  
      <button
        on:click={confirmarCompra}
        class="mt-6 w-full bg-green-500 hover:bg-green-700 text-white py-3 rounded-lg"
      >
        Confirmar Compra
      </button>
    {/if}
  </div>
  