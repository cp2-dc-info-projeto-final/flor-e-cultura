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

<section class="px-4 py-8 sm:px-6 lg:px-8">
  <div class="flex flex-col items-center justify-center min-h-screen lg:py-0">
    <div class="w-full bg-white rounded-lg shadow dark:border sm:max-w-3xl xl:p-0 dark:bg-white dark:border-gray-700">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-black">
            🌸 Termos e Condições da flor&cultura
          </h1>
          <div class="flex gap-3">
            <button
              type="button" on:click={voltar}
                class="w-full sm:w-auto px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm text-gray-900">
                ← Voltar
            </button>
          </div>
        </header>

        <div class="text-sm text-gray-700 dark:text-gray-800 space-y-4">
          <section>
            <h2 class="font-semibold text-gray-900 dark:text-black">Informações Gerais</h2>
            <p>
              Bem-vindo(a) à flor&cultura. Ao acessar ou realizar uma compra em nossa loja, você concorda
              com os Termos e Condições descritos abaixo. Recomendamos que leia atentamente antes de
              efetuar seu pedido. ⚠️
            </p>
          </section>

          <section>
            <h2 class="font-semibold text-gray-900 dark:text-black">Produtos</h2>
            <p>
              Todos os nossos arranjos e buquês são montados com flores frescas e podem variar levemente em
              cor, tamanho e formato, conforme a disponibilidade no dia.
            </p>
            <p>
              As fotos exibidas são ilustrativas, representando o estilo e a combinação das flores, não sendo
              idênticas em todos os pedidos.
            </p>
            <p>
              Caso uma flor específica esteja em falta, faremos a substituição por outra de valor e aparência
              semelhantes, mantendo a beleza do arranjo.
            </p>
          </section>

          <section>
            <h2 class="font-semibold text-gray-900 dark:text-black">Pedidos e Pagamentos</h2>
            <p>Os pedidos só são confirmados após a confirmação do pagamento.</p>
            <p>Aceitamos pagamentos por Pix, cartão de crédito e dinheiro.</p>
            <p>
              O cliente é responsável por fornecer informações corretas no momento da compra (endereço, telefone,
              nome do destinatário etc.). Pedidos com informações incorretas podem causar atrasos na entrega.
            </p>
          </section>

          <section>
            <h2 class="font-semibold text-gray-900 dark:text-black">Entregas</h2>
            <p>Realizamos entregas em [nome dos lugares].</p>
            <p>As entregas são feitas de ex: 7h às 23h, de segunda a sábado.</p>
            <p>
              Caso o destinatário não esteja no local, tentaremos contato telefônico. Se não for possível entregar,
              o produto retornará à loja, e uma nova entrega poderá ser cobrada.
            </p>
            <p>
              Em datas comemorativas (Dia das Mães, Namorados, etc.), pode haver variação de horário devido ao alto
              volume de pedidos.
            </p>
          </section>

          <section>
            <h2 class="font-semibold text-gray-900 dark:text-black">Trocas e Cancelamentos</h2>
            <p>
              Por se tratarem de produtos perecíveis, as flores não podem ser trocadas após a entrega.
            </p>
            <p>
              Cancelamentos só são aceitos com no mínimo 24 horas de antecedência à data de entrega.
            </p>
            <p>
              Se o produto chegar danificado, o cliente deve entrar em contato em até 2 horas após o recebimento,
              enviando foto do produto para análise e substituição, se aplicável.
            </p>
          </section>

          <section>
            <h2 class="font-semibold text-gray-900 dark:text-black">Política de Privacidade</h2>
            <p>
              A flor&cultura respeita sua privacidade e garante que seus dados pessoais não serão compartilhados com
              terceiros, exceto quando necessário para processamento de pagamento ou entrega. Todas as informações são
              armazenadas com segurança.
            </p>
          </section>

          <section>
            <h2 class="font-semibold text-gray-900 dark:text-black">Responsabilidade</h2>
            <p>
              A loja não se responsabiliza por atrasos causados por fatores externos, como trânsito, eventos climáticos
              ou informações incorretas fornecidas pelo cliente.
            </p>
            <p>A compra implica na aceitação integral destes termos.</p>
          </section>

          <section>
            <h2 class="font-semibold text-gray-900 dark:text-black">Contato</h2>
            <p>Em caso de dúvidas, entre em contato pelos canais abaixo:</p>
            <ul class="list-disc pl-5">
              <li>📞 Telefone: 9999-9999</li>
              <li>📧 E-mail: contato@florecultura.com</li>
              <li>📍 Endereço: Rua Doutor Manoel Reis, 501, Duque de Caxias </li>
              <li>💬 WhatsApp: 21 99999-9999</li>
            </ul>
          </section>

          <section>
            <h2 class="font-semibold text-gray-900 dark:text-black">🌼 Agradecimento</h2>
            <p>
              A equipe da flor&cultura agradece por escolher nossas flores para tornar seus momentos ainda mais especiais!
            </p>
          </section>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  @media print {
    button { display: none !important; }
    body { -webkit-print-color-adjust: exact; }
  }
</style>
