<script lang="ts">
  const categorias = [
    { nome: "𝐁𝐮𝐪𝐮𝐞𝐬", link: "/consultaplanta?categoria=buque", imagem: "/imagens/bqrosas.png" },
    { nome: "𝐀𝐫𝐫𝐚𝐧𝐣𝐨𝐬", link: "/consultaplanta?categoria=arranjo", imagem: "/imagens/bqmargarida.png" },
    { nome: "𝐏𝐫𝐞𝐬𝐞𝐧𝐭𝐞𝐬", link: "/consultaplanta?categoria=presente", imagem: "/imagens/vasovioleta.png" },
    { nome: "𝐏𝐞𝐥𝐮𝐜𝐢𝐚𝐬", link: "/consultaplanta?categoria=pelucia", imagem: "/imagens/bqmargarida.png" },
    { nome: "𝐒𝐞𝐦𝐞𝐧𝐭𝐞𝐬", link: "/consultaplanta?categoria=semente", imagem: "/imagens/bqmargarida.png" },
    { nome: "𝐕𝐚𝐬𝐨𝐬", link: "/consultaplanta?categoria=vaso", imagem: "/imagens/bqtulipas.png" }
  ];
</script>

<div class="relative w-full" data-carousel="slide">
  <!-- Wrapper -->
  <div class="relative h-56 overflow-hidden rounded-lg md:h-96">
    <!-- Slide 1 -->
    <div class="duration-700 ease-in-out" data-carousel-item="active">
      <img src="/banner1.jpg" class="absolute block w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" alt="Banner 1">
    </div>
    <!-- Slide 2 -->
    <div class="hidden duration-700 ease-in-out" data-carousel-item>
      <img src="/1.png" class="absolute block w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" alt="Banner 2">
    </div>
  </div>

  <!-- Indicadores -->
  <div class="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
    <button type="button" class="w-3 h-3 rounded-full bg-gray-300" data-carousel-slide-to="0"></button>
    <button type="button" class="w-3 h-3 rounded-full bg-gray-300" data-carousel-slide-to="1"></button>
  </div>

  <!-- Controles -->
  <button type="button" class="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group" data-carousel-prev>
    <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
      <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 19-7-7 7-7"/></svg>
    </span>
  </button>
  <button type="button" class="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group" data-carousel-next>
    <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
      <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/></svg>
    </span>
  </button>
</div>

<!-- Categorias -->
<section class="bg-white min-h-[20vh] flex flex-col justify-center items-center mt-6">
  <div class="max-w-screen-xl mx-auto px-6 text-center">
    <div class="flex flex-wrap justify-center gap-8">
      {#each categorias as categoria}
        <a href={categoria.link} class="flex flex-col items-center group">
          <div class="w-32 h-32 rounded-full bg-pink-200 flex items-center justify-center shadow-lg overflow-hidden hover:bg-pink-300 transition">
            <img src={categoria.imagem} alt={categoria.nome} class="w-full h-full object-cover group-hover:opacity-90" />
          </div>
          <span class="mt-3 text-lg font-semibold text-pink-800 group-hover:text-pink-900">
            {categoria.nome}
          </span>
        </a>
      {/each}
    </div>
  </div>
</section>
