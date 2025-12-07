<script lang="ts">
  import { goto } from '$app/navigation';
  import { isLoggedIn } from '$lib/stores/auth';
  import { get } from 'svelte/store';

  function voltar() {
    const logged = get(isLoggedIn);

    if (!logged) {
      goto('/cadastro');
      return;
    }
    goto('/');
  }
</script>

<section class="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-4">
  <div class="flex flex-col items-center justify-center min-h-screen lg:py-0">
    <div class="w-full bg-white rounded-lg shadow dark:border sm:max-w-3xl xl:p-0 dark:bg-white dark:border-gray-700">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-black">
            🌷 Sobre a Flor&Cultura
          </h1>

        </header>

        <div class="text-sm text-gray-700 dark:text-gray-800 space-y-6">
          <section>
            <h2 class="font-semibold text-gray-900 dark:text-black">🌸 Nossa História</h2>
            <p>
              A Flor&Cultura nasceu em abril de 2023, fruto do sonho compartilhado por cinco amigos —
              Luís, Karoline, Beatriz, Moisés e Leslie. Unidos pelo amor às flores e pela vontade de
              espalhar beleza e afeto, decidiram transformar esse sentimento em uma floricultura que
              acolhe e encanta.
            </p>
          </section>

          <section>
            <h2 class="font-semibold text-gray-900 dark:text-black">📍 Onde Estamos</h2>
            <p>
              Estamos localizados na Rua Doutor Manoel Reis, 501, no bairro Centenário, Duque de Caxias,
              dentro do Colégio Pedro II de Caxias. Um espaço que respira cultura e educação, perfeito
              para florescer nossa proposta de unir natureza e carinho.
            </p>
          </section>

          <section>
            <h2 class="font-semibold text-gray-900 dark:text-black">💚 Nossa Essência</h2>
            <p>
              Mais do que vender flores, acreditamos em criar experiências. Cada arranjo é preparado com
              cuidado, buscando transmitir sentimentos e tornar momentos inesquecíveis. Nosso compromisso
              é com a qualidade, a sustentabilidade e o respeito à natureza.
            </p>
          </section>

          <section>
            <h2 class="font-semibold text-gray-900 dark:text-black">🌐 Nossa Comunidade</h2>
            <p>
              A Flor&Cultura é feita de pessoas para pessoas. Valorizamos o contato próximo com nossos
              clientes e participamos de eventos locais, sempre com o objetivo de fortalecer laços e
              espalhar alegria. Para nós, cada entrega é também um gesto de amizade.
            </p>
          </section>

          <section>
            <h2 class="font-semibold text-gray-900 dark:text-black">🌼 Nosso Compromisso</h2>
            <p>
              Queremos ser lembrados não apenas pelas flores, mas pelo cuidado em cada detalhe. Seja para
              celebrar, confortar ou simplesmente alegrar o dia, estamos aqui para transformar sentimentos
              em cores e aromas.
            </p>
          </section>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  @media print {
    button {
      display: none !important;
    }
    body {
      -webkit-print-color-adjust: exact;
    }
  }
</style>
