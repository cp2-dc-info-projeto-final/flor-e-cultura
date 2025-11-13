<script lang="ts">
    import '../shared.css';
    import { onMount } from 'svelte';
    import { logout } from "$lib/auth";
    import { goto } from "$app/navigation";
    import { totalItems } from '$lib/stores/carrinho';
    import { currentUser, isLoadingAuth, isLoggedIn, isAdmin, refreshUser } from '$lib/stores/auth';
    import { page } from '$app/stores';
  
    export let children;
  
    async function handleLogout() {
        console.log('Logout iniciado...');
        try {
            await logout();
            setTimeout(() => {
                goto('/login');
            }, 100);
        } catch (error) {
            console.error('Erro no logout:', error);
        }
    }
  
    onMount(() => {
        refreshUser();
        const button = document.getElementById('dropdownDefaultButton');
        const dropdown = document.getElementById('dropdown');
        if (button && dropdown) {
            button.addEventListener('click', () => {
                dropdown.classList.toggle('hidden');
            });
            document.addEventListener('click', (event: MouseEvent) => {
                const target = event.target as Node;
                if (!button.contains(target) && !dropdown.contains(target)) {
                    dropdown.classList.add('hidden');
                }
            });
        }
        // Menu mobile (hambúrguer)
        const toggleButton = document.querySelector('[data-collapse-toggle="navbar-cta"]');
        const menu = document.getElementById('navbar-cta');
        if (toggleButton && menu) {
            toggleButton.addEventListener('click', () => {
                menu.classList.toggle('hidden');
            });
        }
    });

    
  </script>
  
  <nav class="bg-white border-gray-200 dark:bg-pink-100 shadow">

    
    <div class="max-w-screen-xl mx-auto px-4 py-2 flex items-center justify-between">
      <!-- LOGO -->
      <a href="/" class="flex items-center gap-3">
        <img src="logofloreculturabg.png" alt="" style="height: 64px;">
        <span class="self-center text-2xl font-bold dark:text-black">𝐅𝐥𝐨𝐫&𝐂𝐮𝐥𝐭𝐮𝐫𝐚</span>
      </a>
  
      <div class="flex items-center gap-6">
        <!-- DESKTOP NAV -->
        <ul class="hidden md:flex items-center gap-6 font-medium">
          <li>
            <a href="/" class="text-black hover:text-pink-600">Início</a>
          </li>
          <li>
            <a href="/consultaplanta" class="text-black hover:text-pink-600">Categorias</a>
          </li>
          {#if !$isLoggedIn && !$isLoadingAuth}
            <li>
              <a href="/login" class="text-black hover:text-pink-600">Login</a>
            </li>
            <li>
              <a href="/cadastro" class="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 dark:bg-green-400 dark:hover:bg-green-700">Cadastre-se</a>
            </li>
          {/if}
          {#if $isLoggedIn && !$isLoadingAuth}
            <li>
              <a on:click={handleLogout} class="text-black hover:text-pink-600 cursor-pointer">Logout</a>
            </li>
          {/if}
          {#if $isAdmin && !$isLoadingAuth}
            <li>
              <a href="/" class="text-black hover:text-pink-600">Adm</a>
            </li>
          {/if}
          <!-- Carrinho Desktop -->
          <li>
            <a href="/carrinho" class="relative flex items-center gap-1 px-3 py-2 rounded hover:bg-pink-50 transition group">
              <span class="text-xl group-hover:text-pink-600">🛒</span>
              <span class="font-semibold text-black">Carrinho</span>
              {#if $totalItems > 0}
                <span class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow">
                  {$totalItems}
                </span>
              {/if}
            </a>
          </li>
        </ul>
  
        <!-- Avatar Desktop -->
        {#if $isLoggedIn && !$isLoadingAuth}
          <img class="hidden md:block w-10 h-10 rounded-full border-2 border-pink-200" src="/docs/images/people/profile-picture-5.jpg" alt="Usuário" />
        {/if}
  
        <!-- Botão menu mobile -->
        <button data-collapse-toggle="navbar-cta" type="button"
          class="md:hidden inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-pink-200 dark:focus:ring-gray-600">
          <span class="sr-only">Abrir menu</span>
          <svg class="w-6 h-6" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
      </div>
    </div>
  
    <!-- MOBILE NAV -->
    <div class="md:hidden hidden" id="navbar-cta">
      <ul class="flex flex-col gap-4 p-4 font-medium">
        <li>
          <a href="/" class="text-black">Início</a>
        </li>
        <li>
          <a href="/consultaplanta" class="text-black">Categorias</a>
        </li>
        {#if !$isLoggedIn && !$isLoadingAuth}
          <li>
            <a href="/login" class="text-black">Login</a>
          </li>
          <li>
            <a href="/cadastro" class="px-4 py-2 bg-blue-700 text-white rounded">Cadastre-se</a>
          </li>
        {/if}
        {#if $isLoggedIn && !$isLoadingAuth}
          <li>
            <a on:click={handleLogout} class="text-black cursor-pointer">Logout</a>
          </li>
        {/if}
        {#if $isAdmin && !$isLoadingAuth}
          <li>
            <a href="/consulta" class="text-black">Ver Usuários</a>
          </li>
        {/if}
        <!-- Carrinho Mobile -->
        <li>
          <a href="/carrinho" class="flex items-center gap-1 px-3 py-2 rounded hover:bg-pink-50 transition group">
            <span class="text-xl group-hover:text-pink-600">🛒</span>
            <span class="font-semibold text-black">Carrinho</span>
            {#if $totalItems > 0}
              <span class="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow ml-2">
                {$totalItems}
              </span>
            {/if}
          </a>
        </li>
        <!-- Avatar Mobile -->
        {#if $isLoggedIn && !$isLoadingAuth}
          <li>
            <img class="w-10 h-10 rounded-full border-2 border-pink-200" src="/docs/images/people/profile-picture-5.jpg" alt="Usuário" />
          </li>
        {/if}
      </ul>
    </div>
  </nav>
  
  
  
  <!-- Conteúdo principal -->
  {@render children()}
  
  <!-- Rodapé (apenas uma vez!) -->
  <footer class="bg-white border-gray-200 dark:bg-pink-100">
    <div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
      <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">
        © 2023 <a href="https://flowbite.com/" class="hover:underline">Flowbite™</a>. Todos os direitos reservados.
      </span>
      <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
        <li>
          <a href="#" class="hover:underline me-4 md:me-6">Sobre</a>
        </li>
        <li>
          <a href="#" class="hover:underline me-4 md:me-6">Política de Privacidade</a>
        </li>
        <li>
          <a href="#" class="hover:underline me-4 md:me-6">Licenciamento</a>
        </li>
        <li>
          <a href="#" class="hover:underline">Contato</a>
        </li>
      </ul>
    </div>
  </footer>
  