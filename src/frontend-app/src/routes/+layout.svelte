<script lang="ts">
	let { children } = $props();
	import '../shared.css';
</script>


<nav class="bg-white border-gray-200 dark:bg-pink-100">
	<div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
	<a href="bbbbb" class="flex items-center space-x-3 rtl:space-x-reverse">
		<span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-black">𝐅𝐥𝐨𝐫&𝐂𝐮𝐥𝐭𝐮𝐫𝐚</span>
	</a>
	<div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
		<a href="/cadastro" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-green-400 dark:hover:bg-green-700 dark:focus:ring-blue-800">Cadastre-se</a>
		<button data-collapse-toggle="navbar-cta" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-cta" aria-expanded="false">
		  <span class="sr-only">Open main menu</span>
		  <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
			  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
		  </svg>
	  </button>
	</div>
	<div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-cta">
	  <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-pink-100 dark:border-gray-700">
		<li>
		  <a href="/" class="block py-2 px-3 md:p-0 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:dark:text-green-400" aria-current="page">Início</a>
		</li>
		<li>
			<a href="/Categorias" class="block py-2 px-3 md:p-0 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-green-500 dark:text-black dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Categorias</a>
		</li>
		<li>
			<a href="/configuracoes" class="block py-2 px-3 md:p-0 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-green-500 dark:text-black dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Sobre nós</a>
		</li>
		<li>
			<a href="/consulta" class="block py-2 px-3 md:p-0 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-green-500 dark:text-black dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Ver Usuarios</a>
		</li>
	</ul>
</div>
</div>
</nav>
{@render children()}


  <footer class="bg-white border-gray-200 dark:bg-pink-100">
    <div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
      <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="https://flowbite.com/" class="hover:underline">Flowbite™</a>. All Rights Reserved.
    </span>
    <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
        <li>
            <a href="#" class="hover:underline me-4 md:me-6">About</a>
        </li>
        <li>
            <a href="#" class="hover:underline me-4 md:me-6">Privacy Policy</a>
        </li>
        <li>
            <a href="#" class="hover:underline me-4 md:me-6">Licensing</a>
        </li>
        <li>
            <a href="#" class="hover:underline">Contact</a>
        </li>
    </ul>
    </div>
</footer>

