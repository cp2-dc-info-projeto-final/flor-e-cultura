<script lang="ts">
    const categorias = [
      { nome: "𝐁𝐮𝐪𝐮𝐞𝐬", link: "/consultaplanta/buques", imagem: "/imagens/bqrosas.png" },
      { nome: "𝐀𝐫𝐫𝐚𝐧𝐣𝐨𝐬", link: "/consultaplanta/arranjos", imagem: "/imagens/bqmargarida.png" },
      { nome: "𝐏𝐫𝐞𝐬𝐞𝐧𝐭𝐞𝐬", link: "/consultaplanta/presentes", imagem: "/imagens/vasovioleta.png" },
      { nome: "𝐏𝐞𝐥𝐮𝐜𝐢𝐚𝐬", link: "/consultaplanta/pelucias", imagem: "/imagens/bqmargarida.png" },
      { nome: "𝐒𝐞𝐦𝐞𝐧𝐭𝐞𝐬", link: "/consultaplanta/sementes", imagem: "/imagens/bqmargarida.png" },
      { nome: "𝐕𝐚𝐬𝐨𝐬", link: "/consultaplanta/vasos", imagem: "/imagens/bqtulipas.png" }
    ];
  </script>
  




<div id="content">
    <div id="carrosel">
        <div id="default-carousel" class="relative w-full" data-carousel="slide">
            <!-- Carousel wrapper -->
            <div class="relative h-56 overflow-hidden rounded-lg md:h-96">
                 <!-- Item 1 -->
                <div class="duration-700 ease-in-out" data-carousel-item>
                    <img src="/banner1.jpg" class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="...">
                </div>
                <!-- Item 2 -->
                <div class="hidden duration-700 ease-in-out" data-carousel-item>
                    <img src="/banner2.jpeg" class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="...">
                </div>
            </div>


            <!-- Seção de Categorias -->
            <section class="bg-white min-h-[20vh] flex flex-col justify-center items-center">
                <div class="max-w-screen-xl mx-auto px-6 text-center">
                  <div class="flex flex-wrap justify-center gap-8">
                    {#each categorias as categoria}
                      <a href={categoria.link} class="flex flex-col items-center group">
                        <div class="w-32 h-32 rounded-full bg-pink-200 flex items-center justify-center shadow-lg overflow-hidden hover:bg-pink-300 transition">
                          <img src={categoria.imagem} alt={categoria.nome}
                               class="w-full h-full object-cover group-hover:opacity-90" />
                        </div>
                        <span class="mt-3 text-lg font-semibold text-pink-800 group-hover:text-pink-900">
                          {categoria.nome}
                        </span>
                      </a>
                    {/each}
                  </div>
                </div>
              </section>
              
  
            <!-- Slider indicators 
            <div class="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
                <button type="button" class="w-3 h-3 rounded-full" aria-current="true" aria-label="Slide 1" data-carousel-slide-to="0"></button>
                <button type="button" class="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 2" data-carousel-slide-to="1"></button>
            </div>
             Slider controls 
            <button type="button" class="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
                <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                    <svg class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
                    </svg>
                    <span class="sr-only">Previous</span>
                </span>
            </button>
            <button type="button" class="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
                <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                    <svg class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    <span class="sr-only">Next</span>
                </span>
            </button>
            -->
        </div>
    </div>
    

    
    <div class="produtos-bar">
        <div class="bg-white">
            <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <h2 class="text-3xl font-bold tracking-tight text-pink-600 sm:text-4xl mb-8">ᴍᴀɪꜱ ᴠᴇɴᴅɪᴅᴏꜱ</h2>


    <div class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
     
      <!-- More products... -->
    </div>
  </div>
</div>

    </div>
</div>