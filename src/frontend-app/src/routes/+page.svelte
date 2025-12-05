<script lang="ts">
  const categorias = [
    { nome: "𝐁𝐮𝐪𝐮𝐞𝐬", link: "/consultaplanta?categoria=buque", imagem: "/imagens/categoria_flores.jpeg" },
    { nome: "𝐀𝐫𝐫𝐚𝐧𝐣𝐨𝐬", link: "/consultaplanta?categoria=arranjo", imagem: "/imagens/categoria_arranjos.jpg" },
    { nome: "𝐏𝐫𝐞𝐬𝐞𝐧𝐭𝐞𝐬", link: "/consultaplanta?categoria=presente", imagem: "/imagens/categoria_presentes.jpeg" },
    { nome: "𝐏𝐞𝐥𝐮𝐜𝐢𝐚𝐬", link: "/consultaplanta?categoria=pelucia", imagem: "/imagens/categoria_pelucias.jpeg" },
    { nome: "𝐒𝐞𝐦𝐞𝐧𝐭𝐞𝐬", link: "/consultaplanta?categoria=semente", imagem: "/imagens/categoria_sementes.jpeg" },
    { nome: "𝐕𝐚𝐬𝐨𝐬", link: "/consultaplanta?categoria=vaso", imagem: "/imagens/categoria_vasos.jpeg" }
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
