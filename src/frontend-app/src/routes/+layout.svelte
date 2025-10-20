<script lang="ts">
    import '../shared.css';
    import { onMount } from 'svelte';
    import { logout, getCurrentUser, getToken, type User } from "$lib/auth";
    import { goto } from "$app/navigation";
    import { carrinho, getTotalItens } from '$lib/stores/carrinho';
    import { page } from '$app/stores';

    $: totalItens = getTotalItens();

    export let children;

    let user: User | null = null;
    let hasToken = false;
    let isLoading = true;

    $: isLoggedIn = hasToken && user !== null;

    function updateAuthStatus() {
        const token = getToken();

        if (token) {
            getCurrentUser()
                .then(userData => {
                    user = userData;
                    hasToken = true;
                })
                .catch(() => {
                    user = null;
                    hasToken = false;
                    logout();
                })
                .finally(() => {
                    isLoading = false;
                });
        } else {
            user = null;
            hasToken = false;
            isLoading = false;
        }
    }

    async function handleLogout() {
        console.log('Logout iniciado...');
        try {
            await logout();
            user = null;
            hasToken = false;
            setTimeout(() => {
                goto('/login');
            }, 100);
        } catch (error) {
            console.error('Erro no logout:', error);
        }
    }

    onMount(() => {
        updateAuthStatus();

        // Dropdown de configurações
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

<nav class="bg-white border-gray-200 dark:bg-pink-100">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">

        <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="logofloreculturabg.png" alt="" srcset="" style="height: 100px;">
            <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-black">𝐅𝐥𝐨𝐫&𝐂𝐮𝐥𝐭𝐮𝐫𝐚</span>
        </a>

        <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse space-x-4">

            {#if !isLoggedIn && !isLoading}
                <a href="/cadastro" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-green-400 dark:hover:bg-green-700 dark:focus:ring-blue-800">
                    Cadastre-se
                </a>
            {/if}

            {#if isLoggedIn && !isLoading}
                <div class="relative inline-block text-left">
                    <button id="dropdownDefaultButton"
                        class="text-white bg-blue-700 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-500 dark:hover:bg-gray-700 dark:focus:ring-blue-800"
                        type="button">
                        Configurações
                        <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                        </svg>
                    </button>

                    <img class="w-10 h-10 rounded-full" src="/docs/images/people/profile-picture-5.jpg" alt="Rounded avatar">

                    <div id="dropdown" class="absolute z-10 hidden mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
                        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                            <li>
                                <a href="/editar" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                    Editar usuário
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            {/if}

            <button data-collapse-toggle="navbar-cta" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-pink-200 dark:focus:ring-gray-600" aria-controls="navbar-cta" aria-expanded="false">
                <span class="sr-only">Open main menu</span>
                <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
                </svg>
            </button>
        </div>

        <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-cta">
            <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-white md:dark:bg-pink-100 dark:border-gray-700">
                <li>
                    <a href="/" class="block py-2 px-3 md:p-0 text-black bg-pink-100 rounded-sm md:bg-transparent md:text-pink-100 md:dark:text-green-400" aria-current="page">Início</a>
                </li>

                <li>
                    <a href="/consultaplanta" class="block py-2 px-3 md:p-0 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-green-500 dark:text-black dark:hover:bg-pink-100 dark:hover:text-black md:dark:hover:bg-transparent dark:border-gray-700">Categorias</a>
                </li>

                {#if !isLoggedIn && !isLoading}
                    <li>
                        <a href="/login" class="block py-2 px-3 md:p-0 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-green-500 dark:text-black dark:hover:bg-pink-100 dark:hover:text-black md:dark:hover:bg-transparent dark:border-gray-700">Login</a>
                    </li>
                {/if}

                {#if isLoggedIn && !isLoading}
                    <li>
                        <a on:click={handleLogout} class="block py-2 px-3 md:p-0 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-green-500 dark:text-black dark:hover:bg-gray-700 dark:hover:text-black md:dark:hover:bg-transparent dark:border-gray-700 cursor-pointer">Logout</a>
                    </li>
                {/if}

                {#if isLoggedIn && user?.tipo_usuario === 'admin' && !isLoading}
                    <li>
                        <a href="/consulta" class="block py-2 px-3 md:p-0 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-green-500 dark:text-black dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Ver Usuários</a>
                    </li>
                {/if}
            </ul>

            <div>
                <a href="/carrinho" class="relative">
                  🛒 Carrinho
                  {#if totalItens > 0}
                    <span class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {totalItens}
                    </span>
                  {/if}
                </a>
              </div>
        </div>
    </div>
</nav>

{@render children()}

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