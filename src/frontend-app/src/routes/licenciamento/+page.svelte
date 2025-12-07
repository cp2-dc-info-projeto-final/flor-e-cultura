<script lang="ts">
  import { goto } from '$app/navigation';
  import { isLoggedIn } from '$lib/stores/auth';
  import { get } from 'svelte/store';

  function voltar() {
    const logged = get(isLoggedIn);

    // Se o usuário NÃO estiver logado → volta para o cadastro
    if (!logged) {
      goto('/cadastro');
      return;
    }

    // Se estiver logado → volta para o início
    goto('/');
  }
</script>

<section class="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-4">

  <div class="flex flex-col items-center justify-center min-h-screen lg:py-0">
    <div class="w-full bg-white rounded-lg shadow dark:border sm:max-w-3xl xl:p-0 dark:bg-white dark:border-gray-700">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-black">
            🔒 Termos Legais e de Uso – Flor&Cultura
          </h1>
        
        </header>

        <div class="text-sm text-gray-700 dark:text-gray-800 space-y-6">
          <section>
            <h2 class="font-semibold text-gray-900 dark:text-black">📜 Direitos Autorais e Propriedade Intelectual</h2>
            <p>© 2025 Flor&Cultura. Todos os direitos reservados.</p>
            <p>
              Este site e todo o seu conteúdo (incluindo, mas não se limitando a, textos, imagens, layouts, designs,
              vídeos e quaisquer obras intelectuais) são integralmente protegidos pela legislação brasileira de direitos
              autorais, notadamente a Lei nº 9.610/98.
            </p>
            <p>
              A Flor&Cultura é a titular dos direitos patrimoniais sobre o conteúdo publicado. É estritamente proibida a
              reprodução total ou parcial, cópia, adaptação, tradução, distribuição, exibição ou qualquer forma de
              utilização dos elementos deste site, com ou sem fins lucrativos, sem a autorização prévia e expressa, por
              escrito, da Flor&Cultura.
            </p>
            <p>
              A violação dos direitos autorais sujeitará o infrator às sanções civis e criminais previstas em lei,
              incluindo a obrigação de indenizar pelos danos causados.
            </p>
          </section>

          <section>
            <h2 class="font-semibold text-gray-900 dark:text-black">🔐 Proteção e Tratamento de Dados Pessoais (LGPD)</h2>
            <p>
              A Flor&Cultura atua em total conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/18).
            </p>
            <p>
              Garantimos a segurança, transparência e o uso adequado de quaisquer dados pessoais coletados, respeitando
              os direitos fundamentais de liberdade e de privacidade dos titulares. O tratamento de dados ocorre com
              finalidade específica, mediante consentimento, ou nas demais bases legais previstas na LGPD.
            </p>
          </section>

          <section>
            <h2 class="font-semibold text-gray-900 dark:text-black">🌐 Compromisso Digital</h2>
            <p>
              O uso da internet pela Flor&Cultura é pautado pelo Marco Civil da Internet (Lei nº 12.965/14), respeitando
              a inviolabilidade da intimidade, da vida privada e a proteção de dados.
            </p>
            <p>
              Nossas operações digitais são realizadas com diligência, buscando um ambiente virtual seguro e
              transparente.
            </p>
          </section>

          <section>
            <h2 class="font-semibold text-gray-900 dark:text-black">🤝 Relações de Consumo</h2>
            <p>
              A relação da Flor&Cultura com o consumidor é regida pelo Código de Defesa do Consumidor (Lei nº 8.078/90),
              visando a máxima transparência, segurança e respeito nas transações.
            </p>
            <p>
              Garantimos o direito à informação clara e adequada sobre os produtos e serviços, bem como um atendimento
              eficaz para a solução de quaisquer conflitos, em estrita observância aos direitos assegurados pelo CDC.
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
