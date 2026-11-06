import "./style.css";
import { saveLead } from "./leads.js";

var WHATSAPP = "5541998817220";

var BIASES = [
  { id: "perda", nome: "Aversão à perda", persona: "O Guardião",
    def: "A dor de perder pesa mais do que o prazer de ganhar o mesmo valor.",
    sabota: "Você mantém dinheiro demais em renda fixa e segura posições perdedoras para não transformar a queda em perda real. Evitar a dor hoje pode sair mais caro depois.",
    ajuda: "Afasta você de alavancagem e de apostas capazes de quebrar o patrimônio. Quem teme perder costuma respeitar a reserva de emergência.",
    trava: "Defina antes de comprar quanto aceita perder em cada posição e escreva a saída. Decidida antes, a perda vira regra.",
    prova: "Tversky e Kahneman (1992) estimaram que uma perda pesa cerca de 2,25 vezes o ganho equivalente." },
  { id: "preco", nome: "Efeito disposição", persona: "O Fiel ao Preço",
    def: "O preço que você pagou vira referência para vender, embora o mercado não saiba qual foi esse preço.",
    sabota: "Você vende cedo o que sobe, para garantir o lucro, e segura o que cai, esperando voltar ao preço de compra. A carteira acumula os perdedores.",
    ajuda: "A vontade de realizar também evita devolver todo o ganho numa reversão. Com critério definido, ela vira disciplina de saída.",
    trava: "Para cada posição, pergunte: eu compraria isto hoje, a este preço? Se a resposta for não, o preço de compra deixa de ser motivo para ficar.",
    prova: "Odean (1998), 10 mil contas: fora de dezembro, 14,8% dos ganhos disponíveis eram realizados, contra 9,8% das perdas." },
  { id: "ancora", nome: "Ancoragem", persona: "O Ancorado",
    def: "O primeiro número que você vê puxa sua estimativa, mesmo sem relação com o valor real.",
    sabota: "O pico da ação ou da carteira vira régua. Você chama de barato o que apenas caiu e chama de prejuízo o que ainda é ganho.",
    ajuda: "Uma âncora bem escolhida protege: meta de aporte, limite por ativo, retorno mínimo contra o CDI. Um número fixado antes da emoção reduz o improviso.",
    trava: "Troque a âncora de preço por uma âncora de critério: resultado, dívida e comparação com o CDI no mesmo período.",
    prova: "Tversky e Kahneman (1974): um número sorteado em uma roleta alterou as estimativas dos participantes." },
  { id: "confianca", nome: "Excesso de confiança", persona: "O Confiante",
    def: "Você superestima o que sabe e lembra mais dos acertos do que dos erros.",
    sabota: "Negociar demais, concentrar demais e nunca medir. A sensação de estar ganhando toma o lugar do cálculo.",
    ajuda: "Dá coragem para agir quando existe tese e para sustentar uma posição vencedora em meio ao ruído. Foi essa confiança que construiu muitos negócios.",
    trava: "Escreva a tese de cada compra e meça a carteira contra o CDI, depois de custos e impostos, uma vez por ano.",
    prova: "Barber e Odean (2000), 66.465 domicílios, 1991 a 1996: quem mais negociou obteve 11,4% ao ano, contra 17,9% do mercado. No Brasil, 97% dos que persistiram 300 dias ou mais no day trade perderam dinheiro (Chague, De-Losso e Giovannetti, 2019)." },
  { id: "recente", nome: "Disponibilidade e manada", persona: "O Seguidor",
    def: "O que é recente e muito comentado parece mais provável do que realmente é.",
    sabota: "Você entra depois da alta e sai depois da queda, porque o último ano parece uma previsão do próximo.",
    ajuda: "Prestar atenção ao que o mercado faz tem valor. Tendências existem, e quem as segue com regra de entrada e de saída usa esse impulso a favor.",
    trava: "Antes de entrar no que todos comentam, veja 5 anos de retorno e a maior queda do período. Depois espere 7 dias.",
    prova: "Tversky e Kahneman (1973): as pessoas julgam a probabilidade de um evento pela facilidade com que lembram de exemplos." },
  { id: "moldura", nome: "Enquadramento", persona: "O Leitor de Manchete",
    def: "A forma de apresentar a informação muda sua decisão, mesmo com os fatos iguais.",
    sabota: "Capital protegido, potencial de 40%, rendeu 11%. A frase convence antes da conta. Ficam de fora o retorno líquido, a comparação com o CDI e o dinheiro travado.",
    ajuda: "Você pode enquadrar a seu favor: tratar o aporte como conta fixa do mês e olhar uma queda como preço menor de uma compra já planejada.",
    trava: "Reescreva toda oferta na mesma moldura: quanto sobra, líquido de custos, impostos e inflação, comparado ao CDI no mesmo prazo.",
    prova: "Tversky e Kahneman (1981): o mesmo problema, descrito como vidas salvas ou vidas perdidas, inverteu a preferência da maioria." },
  { id: "inercia", nome: "Viés do status quo", persona: "O Adiador",
    def: "Manter o que já existe parece não ser uma decisão. Ainda assim, é uma decisão.",
    sabota: "O dinheiro fica onde o gerente colocou há anos. Cada ano sem revisão é uma escolha feita por omissão.",
    ajuda: "A inércia também trabalha para você: quem deixa o plano quieto evita trocas por impulso, e o aporte automático funciona por causa dela.",
    trava: "Uma vez por ano, faça a pergunta: se tudo estivesse em caixa hoje, eu compraria isto? Marque a data na agenda.",
    prova: "Samuelson e Zeckhauser (1988) documentaram uma preferência desproporcional pela opção que já existe." }
];

/* tipo s = situação (pontua no viés, de 0 a 3). tipo r = cálculo de reflexão (certa = índice da opção correta). */
var QUESTIONS = [
  { t: "s", bias: "perda", lambda: true, q: "Cara ou coroa, uma única vez. Coroa: você perde R$ 10 mil. Cara: você ganha um prêmio. Qual é o menor prêmio que faria você aceitar?",
    o: [["De R$ 11 mil a R$ 14 mil", 0, 1.25], ["De R$ 15 mil a R$ 24 mil", 1, 2], ["De R$ 25 mil a R$ 39 mil", 2, 3], ["R$ 40 mil ou mais, ou eu não aceitaria", 3, 4]] },
  { t: "s", bias: "inercia", q: "Quando foi a última vez que você revisou, com números na mão, onde todo o seu dinheiro está?",
    o: [["No último ano", 0], ["Há 2 ou 3 anos", 1], ["Não lembro", 2], ["Nunca. Ficou onde o banco colocou", 3]] },
  { t: "s", bias: "recente", q: "Um fundo subiu 38% em 12 meses e todo mundo no seu grupo comenta. O que você faz?",
    o: [["Entro antes que a alta acabe", 3], ["Coloco uma parte pequena para não ficar de fora", 2], ["Fico longe. O que subiu tanto vai cair", 1], ["Vejo 5 anos de histórico e a maior queda antes de pensar nisso", 0]] },
  { t: "r", q: "Um título e sua taxa de custódia custam juntos R$ 1.100. O título custa R$ 1.000 a mais que a taxa. Quanto custa a taxa?",
    o: ["R$ 100", "R$ 50", "R$ 75", "R$ 150"], certa: 1, curto: "Título e taxa",
    porque: "A intuição entrega R$ 100. Com taxa de R$ 100, o título custaria R$ 1.100 e a soma daria R$ 1.200. Com R$ 50, o título custa R$ 1.050 e a soma fecha." },
  { t: "s", bias: "preco", q: "Você comprou uma ação a R$ 50. Hoje vale R$ 35 e, sendo sincero, você não compraria de novo. O que faz?",
    o: [["Espero voltar a R$ 50 para vender", 3], ["Compro mais para baixar o preço médio", 3], ["Vendo metade e espero com o resto", 2], ["Vendo tudo. O preço que paguei não muda o que ela vale", 0]] },
  { t: "s", bias: "moldura", q: "O gerente oferece um COE: capital 100% protegido e potencial de 40% em 5 anos. O que pesa mais na sua decisão?",
    o: [["A proteção do capital", 3], ["O potencial de 40%", 2], ["A indicação do gerente", 2], ["A comparação com o CDI de 5 anos, e quanto recebo se a condição falhar", 0]] },
  { t: "s", bias: "confianca", q: "Comparada ao CDI, como foi sua carteira nos últimos 3 anos, depois de custos e impostos?",
    o: [["Melhor, tenho certeza", 3], ["Acho que melhor, mas nunca calculei", 2], ["Não faço ideia", 1], ["Calculei e sei o número, bom ou ruim", 0]] },
  { t: "s", bias: "ancora", q: "Uma ação que valia R$ 80 há um ano hoje vale R$ 40. Você não acompanha a empresa. Qual é seu primeiro pensamento?",
    o: [["Está pela metade do preço", 3], ["Deve voltar para perto de R$ 80 com o tempo", 2], ["Quero saber por que caiu", 1], ["O preço antigo não me diz nada sem ver resultado e dívida", 0]] },
  { t: "r", q: "Mil gestores decidem no cara ou coroa se vão superar o índice a cada ano. Depois de 5 anos, quantos terão superado o índice todos os anos, só por sorte?",
    o: ["Nenhum", "Cerca de 3", "Cerca de 31", "Cerca de 100"], certa: 2, curto: "Mil gestores",
    porque: "1.000 × (1/2)⁵ ≈ 31. Trinta e um gestores com 5 anos seguidos acima do índice, sem nenhuma habilidade. Histórico curto prova pouco." },
  { t: "s", bias: "perda", q: "Um investimento antigo está negativo e você precisa escolher. Opção A: sair hoje e assumir R$ 75 mil de perda. Opção B: 80% de chance de perder R$ 100 mil e 20% de não perder nada. Qual você escolhe?",
    o: [["A: assumo os R$ 75 mil", 0], ["B: fico com a chance de zerar a perda", 3], ["Adio a decisão pelo maior tempo possível", 2]] },
  { t: "s", bias: "recente", q: "Depois de um ano ruim na bolsa, com notícia de crise todo dia, o que você faz?",
    o: [["Reduzo ações até o cenário clarear", 3], ["Paro de aportar por enquanto", 2], ["Mantenho o aporte de sempre", 0], ["Sigo a regra definida antes e rebalanceio se passou do limite", 0]] },
  { t: "s", bias: "inercia", q: "Se toda a sua carteira virasse dinheiro hoje, você compraria os mesmos ativos?",
    o: [["Sim, e sei explicar cada um", 0], ["A maior parte, eu acho", 1], ["Não sei direito o que tenho", 2], ["Provavelmente não, mas trocar dá trabalho", 3]] },
  { t: "s", bias: "preco", q: "Você precisa de R$ 100 mil. A ação A está +40%, a ação B está −25%, e você não tem opinião forte sobre nenhuma das duas. Qual vende?",
    o: [["A, para garantir o lucro", 3], ["Um pouco de cada", 1], ["Busco o dinheiro em outro lugar para não realizar a perda", 2], ["B. Sem opinião, prefiro manter a que está subindo", 0]] },
  { t: "r", q: "Seu patrimônio dobra a cada 6 anos e chega a R$ 8 milhões em 30 anos. Em quantos anos ele chega a R$ 4 milhões?",
    o: ["12 anos", "15 anos", "20 anos", "24 anos"], certa: 3, curto: "Patrimônio que dobra",
    porque: "A intuição corta o tempo pela metade. Na capitalização composta, a última dobra leva de R$ 4 milhões a R$ 8 milhões em 6 anos: 30 − 6 = 24." },
  { t: "s", bias: "moldura", q: "Sua renda fixa rendeu 11% no ano e a inflação foi de 5%. Como você descreve esse resultado?",
    o: [["Ganhei 11%, ótimo resultado", 3], ["Só olho se o saldo subiu", 2], ["Ganhei 11%, mas a inflação levou uma parte", 1], ["Só concluo depois de tirar imposto e inflação", 0]] },
  { t: "s", bias: "confianca", q: "Uma compra sua subiu 60% e outra caiu 30%. Como você explica os dois casos?",
    o: [["O acerto foi meu. O erro foi do mercado ou do assessor", 3], ["Lembro bem do acerto. O erro prefiro esquecer", 2], ["Os dois foram meus, e não sei quanto foi sorte", 1], ["Tenho a tese escrita de cada um e comparo com o que aconteceu", 0]] },
  { t: "s", bias: "ancora", q: "Sua carteira chegou a R$ 1,2 milhão em janeiro e hoje está em R$ 1,05 milhão. Você aportou R$ 900 mil no total. Como você descreve sua situação?",
    o: [["Perdi R$ 150 mil", 3], ["Só fico tranquilo quando voltar a R$ 1,2 milhão", 2], ["Tenho R$ 150 mil de ganho e uma queda de 12,5% desde o pico", 0], ["Preciso comparar com o CDI do período antes de concluir", 0]] }
];

var state = { view: "intro", idx: 0, answers: {}, lead: null, formError: {}, sending: false };
var advanceTimer = null;
var app = document.getElementById("app");
var reduced = false;
try { reduced = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

function band(score) {
  if (score >= 67) return { cls: "band-alto", txt: "Exposição alta" };
  if (score >= 34) return { cls: "band-medio", txt: "Atenção" };
  return { cls: "band-baixo", txt: "Controlado" };
}

/* Cada viés tem duas situações de até 3 pontos: escore = pontos / 6. */
function computeResult(answers) {
  var pts = {}, lambda = null, reflex = [];
  BIASES.forEach(function (b) { pts[b.id] = 0; });
  QUESTIONS.forEach(function (q, i) {
    var a = answers[i];
    if (q.t === "r") {
      reflex.push({ q: q, escolha: a, certo: a === q.certa });
    } else if (a !== undefined) {
      pts[q.bias] += q.o[a][1];
      if (q.lambda) lambda = q.o[a][2];
    }
  });
  var ranked = BIASES.map(function (b) {
    return { bias: b, score: Math.round(pts[b.id] / 6 * 100) };
  }).sort(function (x, y) { return y.score - x.score; });
  var soma = ranked.reduce(function (s, r) { return s + r.score; }, 0);
  return {
    ranked: ranked,
    indice: Math.round(soma / ranked.length),
    lambda: lambda,
    reflex: reflex,
    acertos: reflex.filter(function (r) { return r.certo; }).length,
    semDominante: ranked[0].score <= 33
  };
}

function fmt(n) { return String(n).replace(".", ","); }

/* Curva de valor da Teoria da Perspectiva: v(x) = x^0,88 nos ganhos, -λ(-x)^0,88 nas perdas. */
function curve(lam, showRef) {
  var W = 420, H = 300, L = 14, R = 14, T = 20, B = 26, A = 0.88;
  var top = 1.15, floor = Math.max(lam, 2.25) * 1.14;
  var sx = (W - L - R) / 2, sy = (H - T - B) / (top + floor);
  var x0 = L + sx, y0 = T + top * sy;
  function px(x) { return (x0 + x * sx).toFixed(1); }
  function py(y) { return (y0 - y * sy).toFixed(1); }
  function value(x, l) { return x >= 0 ? Math.pow(x, A) : -l * Math.pow(-x, A); }
  function path(from, to, l) {
    var d = "", n = 60;
    for (var i = 0; i <= n; i++) {
      var t = i / n, x = from + (to - from) * t * t;
      d += (i ? "L" : "M") + px(x) + " " + py(value(x, l));
    }
    return d;
  }
  var refLine = showRef ? '<path d="' + path(0, -1, 2.25) + '" fill="none" stroke="var(--paper)" stroke-width="1.5"/>' : "";
  var title = "Curva de valor: uma perda de R$ 10 mil pesa " + fmt(lam) + " vezes um ganho de R$ 10 mil";
  return '<svg class="curve" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + title + '">' +
    '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + py(0) + '" y2="' + py(0) + '" stroke="var(--navy-line)"/>' +
    '<line x1="' + px(0) + '" x2="' + px(0) + '" y1="' + T + '" y2="' + (H - B) + '" stroke="var(--navy-line)"/>' +
    '<path d="' + path(0, -1, 1) + '" fill="none" stroke="var(--paper-soft)" stroke-width="1.5" stroke-dasharray="4 4"/>' +
    refLine +
    '<path d="' + path(0, -1, lam) + '" fill="none" stroke="var(--loss)" stroke-width="3"/>' +
    '<path d="' + path(0, 1, lam) + '" fill="none" stroke="var(--gold)" stroke-width="3"/>' +
    '<circle cx="' + px(1) + '" cy="' + py(1) + '" r="4.5" fill="var(--gold)"/>' +
    '<circle cx="' + px(-1) + '" cy="' + py(-lam) + '" r="4.5" fill="var(--loss)"/>' +
    '<text class="strong" x="' + (W - R) + '" y="' + (Number(py(1)) - 11) + '" text-anchor="end">Ganho: 1×</text>' +
    '<text class="strong" x="' + (Number(px(-1)) + 12) + '" y="' + (Number(py(-lam)) + 16) + '">Perda: ' + fmt(lam) + '×</text>' +
    '<text x="' + L + '" y="' + (Number(py(0)) - 8) + '">−R$ 10 mil</text>' +
    '<text x="' + (W - R) + '" y="' + (Number(py(0)) + 18) + '" text-anchor="end">+R$ 10 mil</text>' +
    '</svg>';
}

function bars(rows) {
  return '<div class="map">' + rows.map(function (r) {
    var b = band(r.score);
    return '<div class="row ' + b.cls + '"><span class="name">' + r.bias.nome + '</span>' +
      '<span class="val"><span class="band-tag">' + b.txt + '</span><b>' + r.score + '</b></span>' +
      '<div class="track"><span class="fill" style="width:' + r.score + '%"></span></div></div>';
  }).join("") + '</div>';
}

function esc(t) {
  return String(t).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function onlyDigits(t) { return String(t).replace(/\D/g, ""); }

/* Aceita DDD + número (10 ou 11 dígitos), com ou sem o 55 na frente. Devolve só o número nacional. */
function nationalPhone(t) {
  var d = onlyDigits(t);
  if ((d.length === 12 || d.length === 13) && d.indexOf("55") === 0) d = d.slice(2);
  if (d.length !== 10 && d.length !== 11) return null;
  if (Number(d.slice(0, 2)) < 11) return null;
  if (d.length === 11 && d.charAt(2) !== "9") return null;
  return d;
}

function maskPhone(t) {
  var d = onlyDigits(t).slice(0, 11);
  if (d.length <= 2) return d;
  var corte = d.length === 11 ? 7 : 6;
  if (d.length <= corte) return "(" + d.slice(0, 2) + ") " + d.slice(2);
  return "(" + d.slice(0, 2) + ") " + d.slice(2, corte) + "-" + d.slice(corte);
}

function leadForm() {
  var e = state.formError, v = state.formValues || {};
  function erro(k) { return e[k] ? '<p class="field-error" id="err-' + k + '">' + e[k] + '</p>' : ""; }
  return '<div class="shell narrow quiz"><div class="progress"><div class="progress-head">' +
      '<span class="label">Seu mapa está pronto</span><span class="label muted">17 de 17</span></div>' +
      '<div class="bar"><i style="width:100%"></i></div></div>' +
    '<h1 class="prompt" tabindex="-1" id="prompt">Informe seu nome e WhatsApp para abrir o resultado.</h1>' +
    '<form class="lead" id="lead-form" novalidate>' +
      '<div class="field"><label for="lead-nome">Nome</label>' +
        '<input id="lead-nome" name="nome" type="text" autocomplete="name" maxlength="80" value="' + esc(v.nome || "") + '"' + (e.nome ? ' aria-invalid="true" aria-describedby="err-nome"' : "") + '>' + erro("nome") + '</div>' +
      '<div class="field"><label for="lead-whatsapp">WhatsApp com DDD</label>' +
        '<input id="lead-whatsapp" name="whatsapp" type="tel" inputmode="tel" autocomplete="tel-national" maxlength="20" placeholder="(41) 99999-0000" value="' + esc(v.whatsapp || "") + '"' + (e.whatsapp ? ' aria-invalid="true" aria-describedby="err-whatsapp"' : "") + '>' + erro("whatsapp") + '</div>' +
      '<div class="trap" aria-hidden="true"><label for="lead-site">Site</label><input id="lead-site" name="site" type="text" tabindex="-1" autocomplete="off"></div>' +
      '<div class="field"><label class="consent" for="lead-consent"><input id="lead-consent" name="consent" type="checkbox"' + (v.consent ? " checked" : "") + '>' +
        '<span>Autorizo a Gabriel Investe a guardar estes dados e falar comigo pelo WhatsApp sobre este resultado e sobre seus serviços.</span></label>' + erro("consent") + '</div>' +
      '<button class="btn" type="submit"' + (state.sending ? " disabled" : "") + '>' + (state.sending ? "Abrindo seu resultado" : "Ver meu resultado") + '</button>' +
      '<p class="small muted">Não vendemos seus dados. Para corrigir ou apagar, peça pelo WhatsApp +55 41 99881-7220.</p>' +
    '</form>' +
    '<div class="quiz-foot"><button class="link-btn" id="back-form" type="button">Voltar</button></div></div>';
}

function trackingData() {
  var q = new URLSearchParams(location.search);
  return {
    utm_source: q.get("utm_source"), utm_medium: q.get("utm_medium"),
    utm_campaign: q.get("utm_campaign"), utm_content: q.get("utm_content"),
    referrer: document.referrer || null
  };
}

function submitLead(form) {
  var nome = form.nome.value.trim().replace(/\s+/g, " ");
  var fone = nationalPhone(form.whatsapp.value);
  var err = {};
  if (nome.length < 2) err.nome = "Digite seu nome.";
  if (!fone) err.whatsapp = "Digite o WhatsApp com DDD. Exemplo: (41) 99999-0000.";
  if (!form.consent.checked) err.consent = "Marque a autorização para ver o resultado.";
  state.formError = err;
  state.formValues = { nome: form.nome.value, whatsapp: form.whatsapp.value, consent: form.consent.checked };
  if (Object.keys(err).length) { render(); return; }

  if (form.site.value) { state.lead = { nome: nome }; state.view = "result"; render(); return; }

  state.sending = true;
  render();
  var r = computeResult(state.answers);
  var scores = {};
  r.ranked.forEach(function (x) { scores[x.bias.id] = x.score; });
  var row = Object.assign({
    nome: nome, whatsapp: "55" + fone, consentimento: true,
    vies_dominante: r.semDominante ? "nenhum" : r.ranked[0].bias.id,
    score_dominante: r.ranked[0].score,
    segundo_vies: r.ranked[1].bias.id, score_segundo: r.ranked[1].score,
    indice_geral: r.indice, lambda: r.lambda, acertos_reflexao: r.acertos, scores: scores
  }, trackingData());

  saveLead(row).catch(function (e) { console.warn("Lead não salvo", e); }).then(function () {
    try { if (window.fbq) window.fbq("track", "Lead", { content_name: "mapa-de-vieses" }); } catch (e) { /* sem pixel */ }
    state.sending = false;
    state.lead = { nome: nome };
    state.view = "result";
    render();
  });
}

function brand() {
  return '<header class="brand"><span>Gabriel Investe</span><span class="label">Mapa de Vieses</span></header>';
}

function intro() {
  var exemplo = [["inercia", 83], ["moldura", 67], ["perda", 50], ["preco", 33]].map(function (e) {
    return { bias: BIASES.filter(function (b) { return b.id === e[0]; })[0], score: e[1] };
  });
  return '<div class="shell">' + brand() +
    '<section class="hero"><div class="hero-text">' +
      '<span class="label">Psicologia do investidor</span>' +
      '<h1>Qual viés está decidindo pela sua carteira?</h1>' +
      '<p>Daniel Kahneman ganhou o Nobel de Economia de 2002 ao mostrar que decidimos sob risco com atalhos mentais previsíveis. Este mapa mostra quais deles aparecem nas suas decisões, onde custam caro e onde protegem você.</p>' +
      '<button class="btn" id="start" type="button">Começar o mapa</button>' +
      '<div class="facts"><span>17 decisões</span><span>5 minutos</span><span>Sem cadastro</span></div>' +
    '</div><figure>' + curve(2.25, false) +
      '<figcaption>Curva de valor da Teoria da Perspectiva. A perda desce mais rápido do que o ganho sobe. Estimativa de Tversky e Kahneman (1992).</figcaption>' +
    '</figure></section>' +
    '<section class="preview"><div><span class="label">Exemplo de resultado</span>' + bars(exemplo) + '</div>' +
    '<div><span class="label">O que você recebe</span><ul class="takeaways">' +
      '<li><strong>Seu mapa de 7 vieses</strong><span class="muted small">Do mais forte ao mais fraco, com a leitura de cada um.</span></li>' +
      '<li><strong>Sua curva de perda</strong><span class="muted small">Quanto uma perda pesa para você, comparada a um ganho igual.</span></li>' +
      '<li><strong>Os dois lados de cada viés</strong><span class="muted small">Onde ele sabota, onde ajuda e a regra que o mantém sob controle.</span></li>' +
    '</ul></div></section>' +
    disclaimer() + '</div>';
}

function question() {
  var q = QUESTIONS[state.idx], total = QUESTIONS.length, n = state.idx + 1;
  var pct = Math.round(state.idx / total * 100);
  var opts = q.o.map(function (o, i) {
    var txt = q.t === "r" ? o : o[0];
    var on = state.answers[state.idx] === i;
    return '<button class="option" type="button" id="opt-' + state.idx + '-' + i + '" data-i="' + i + '" aria-pressed="' + on + '"><span>' + (i + 1) + '</span><span>' + txt + '</span></button>';
  }).join("");
  return '<div class="shell narrow quiz"><div class="progress"><div class="progress-head">' +
      '<span class="label">' + (q.t === "r" ? "Cálculo rápido" : "Decisão") + '</span>' +
      '<span class="label muted">' + n + ' de ' + total + '</span></div>' +
      '<div class="bar"><i style="width:' + pct + '%"></i></div></div>' +
    '<h1 class="prompt" tabindex="-1" id="prompt">' + q.q + '</h1>' +
    '<div class="options">' + opts + '</div>' +
    '<div class="quiz-foot"><button class="link-btn" id="back" type="button"' + (state.idx === 0 ? " disabled" : "") + '>Voltar</button>' +
    '<span class="muted small">' + (q.t === "r" ? "Responda com a primeira resposta que parecer certa." : "Responda o que você fez ou faria, não o que deveria fazer.") + '</span></div></div>';
}

function biasCard(r, rotulo) {
  var b = r.bias, bd = band(r.score);
  return '<article class="bias ' + bd.cls + '"><div class="bias-head"><span class="label">' + rotulo + ' · ' + r.score + ' de 100</span>' +
    '<h2>' + b.nome + '</h2><p class="muted">' + b.def + '</p></div>' + sides(b) + '<p class="proof">' + b.prova + '</p></article>';
}

function sides(b) {
  return '<div class="sides"><div><span class="label s">Onde sabota</span><p class="small">' + b.sabota + '</p></div>' +
    '<div><span class="label h">Onde ajuda</span><p class="small">' + b.ajuda + '</p></div>' +
    '<div><span class="label">A trava</span><p class="small">' + b.trava + '</p></div></div>';
}

function reflexText(n) {
  if (n === 3) return "Três acertos. Você parou para conferir a primeira resposta, o trabalho que Kahneman atribui ao Sistema 2.";
  if (n === 2) return "Dois acertos. Seu Sistema 2 entra em ação, mas a primeira resposta às vezes passa sem conferência.";
  if (n === 1) return "Um acerto. A resposta rápida do Sistema 1 costuma decidir antes da conta.";
  return "Nenhum acerto. A resposta rápida do Sistema 1 decidiu nas três. Em uma decisão financeira, isso pede uma regra escrita antes do clique.";
}

function lambdaText(l) {
  if (l <= 1.25) return "Sua tolerância a perdas está acima da média neste exercício. Isso ajuda a aguentar quedas, e pede atenção redobrada ao tamanho de cada posição.";
  if (l <= 2) return "Sua resposta está perto do que Kahneman e Tversky encontraram na maioria das pessoas.";
  return "Você exige bem mais que a média para aceitar o risco. Isso protege o patrimônio, e pode deixar dinheiro parado por medo de oscilação.";
}

function shareText(r) {
  var t = r.ranked[0], s = r.ranked[1];
  return "Meu Mapa de Vieses\nViés dominante: " + t.bias.nome + " (" + t.score + "/100)\nSegundo viés: " + s.bias.nome + " (" + s.score + "/100)\nPerda pesa " + fmt(r.lambda) + "× um ganho igual\nCálculos rápidos: " + r.acertos + " de 3";
}

function whatsappUrl(r) {
  var t = r.ranked[0], s = r.ranked[1];
  var quem = state.lead ? "Aqui é " + state.lead.nome + ". " : "";
  var msg = "Olá, Gabriel. " + quem + "Fiz o Mapa de Vieses.\nViés dominante: " + t.bias.nome + " (" + t.score + "/100).\nSegundo viés: " + s.bias.nome + " (" + s.score + "/100).\nQuero a AUDITORIA da minha carteira.";
  return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg);
}

function result() {
  var r = computeResult(state.answers), top = r.ranked[0], second = r.ranked[1];
  var data = new Date().toLocaleDateString("pt-BR");
  var personaTxt = r.semDominante ? "O Auditor" : top.bias.persona;
  var abertura = r.semDominante
    ? "Nenhum viés dominante nas suas respostas. Autorrelato costuma ser generoso, então confira esse resultado contra os números da carteira."
    : "Seu viés dominante é " + top.bias.nome.toLowerCase() + ". " + top.bias.def;
  var primeiro = state.lead ? esc(state.lead.nome.split(" ")[0]) + ", este é o seu parecer" : "Parecer comportamental";
  var rest = r.ranked.slice(2).map(function (x) {
    return '<details><summary><span>' + x.bias.nome + '</span><span>' + x.score + '</span></summary><div class="detail-body"><p class="muted">' + x.bias.def + '</p>' + sides(x.bias) + '<p class="proof">' + x.bias.prova + '</p></div></details>';
  }).join("");
  var answers = r.reflex.map(function (a) {
    var escolhida = a.escolha === undefined ? "Sem resposta" : a.q.o[a.escolha];
    return '<div class="answer"><div class="answer-top"><strong>' + a.q.curto + '</strong>' +
      '<span class="mark ' + (a.certo ? "ok" : "no") + '">' + (a.certo ? "Certo" : "Você: " + escolhida + " · Certo: " + a.q.o[a.q.certa]) + '</span></div>' +
      '<p class="small muted">' + a.q.porque + '</p></div>';
  }).join("");

  return '<div class="shell">' + brand() +
    '<section class="report-head"><span class="label">' + primeiro + '</span>' +
      '<p class="persona">' + personaTxt + '</p><p style="max-width:62ch">' + abertura + '</p>' +
      '<dl class="fields">' +
        '<div><dt>Data</dt><dd>' + data + '</dd></div>' +
        '<div><dt>Índice geral</dt><dd>' + r.indice + ' de 100</dd></div>' +
        '<div><dt>Perda pesa</dt><dd>' + fmt(r.lambda) + '×</dd></div>' +
        '<div><dt>Cálculos</dt><dd>' + r.acertos + ' de 3</dd></div>' +
      '</dl></section>' +
    '<section class="split"><div class="section"><span class="label">Seu mapa</span><h2>Do viés mais forte ao mais fraco</h2>' + bars(r.ranked) + '</div>' +
      '<figure><span class="label">Sua curva de perda</span>' + curve(r.lambda, true) +
        '<div class="legend"><span><i></i>Você</span><span><i class="ref"></i>Referência 2,25×</span><span><i class="neutral"></i>Sem viés 1×</span></div>' +
        '<figcaption>' + lambdaText(r.lambda) + ' Leitura aproximada, tirada da aposta de cara ou coroa.</figcaption></figure></section>' +
    '<section class="section">' + biasCard(top, r.semDominante ? "Seu ponto mais sensível" : "Viés dominante") + biasCard(second, "Segundo viés") + '</section>' +
    '<section class="section"><span class="label">Os outros cinco</span><div>' + rest + '</div></section>' +
    '<section class="section narrow"><span class="label">Sistema 1 e Sistema 2</span><h2>' + r.acertos + ' de 3 nos cálculos rápidos</h2>' +
      '<p>' + reflexText(r.acertos) + '</p><div class="answers">' + answers + '</div></section>' +
    '<section class="cta"><span class="label" style="color:inherit">Próximo passo</span>' +
      '<h2>O mapa mostra o comportamento. A auditoria mostra quanto ele custou.</h2>' +
      '<p>Mande seu resultado no WhatsApp com a palavra AUDITORIA. A mensagem já vai preenchida, e a análise parte da sua carteira real, com seus números.</p>' +
      '<div class="cta-actions"><a class="btn" href="' + whatsappUrl(r) + '" target="_blank" rel="noopener noreferrer">Enviar meu resultado no WhatsApp</a><small>+55 41 99881-7220</small></div>' +
      '<p><em>Você não foi enganado. Você só nunca foi auditado.</em></p></section>' +
    '<div class="tools"><button class="btn ghost" id="copy" type="button">Copiar meu resultado</button>' +
      '<button class="btn ghost" id="restart" type="button">Refazer o mapa</button><span class="toast" id="toast" role="status"></span></div>' +
    disclaimer(true) + '</div>';
}

function disclaimer(full) {
  var fontes = full ? '<p>Como funciona: cada viés é medido por duas situações, de 0 a 3 pontos cada. O escore é a soma dividida por 6: até 33 controlado, de 34 a 66 atenção, 67 ou mais exposição alta. Os três cálculos são inspirados no Teste de Reflexão Cognitiva de Shane Frederick (2005), com cenários financeiros.</p>' +
    '<ul>' +
    '<li><a href="https://www.nobelprize.org/prizes/economic-sciences/2002/kahneman/facts/" target="_blank" rel="noopener noreferrer">Daniel Kahneman, Nobel de Economia de 2002</a></li>' +
    '<li>Kahneman e Tversky (1979), Prospect Theory. Tversky e Kahneman (1973, 1974, 1981, 1992).</li>' +
    '<li><a href="https://faculty.haas.berkeley.edu/odean/papers/disposition/disposition.html" target="_blank" rel="noopener noreferrer">Odean (1998), Are Investors Reluctant to Realize Their Losses?</a></li>' +
    '<li><a href="https://faculty.haas.berkeley.edu/odean/Papers%20current%20versions/Individual_Investor_Performance_Final.pdf" target="_blank" rel="noopener noreferrer">Barber e Odean (2000), Trading Is Hazardous to Your Wealth</a></li>' +
    '<li><a href="https://ideas.repec.org/p/fgv/eesptd/525.html" target="_blank" rel="noopener noreferrer">Chague, De-Losso e Giovannetti (2019), Day Trading for a Living?</a></li>' +
    '<li>Samuelson e Zeckhauser (1988), Status Quo Bias in Decision Making.</li>' +
    '</ul>' : "";
  return '<footer class="fine">' + fontes + '<p>Ferramenta educativa. Não é recomendação de investimento, não substitui a análise de perfil do investidor e não é avaliação psicológica. Os valores das perguntas são hipotéticos. Gabriel Investe, consultoria independente de investimentos.</p></footer>';
}

function render() {
  app.innerHTML = state.view === "intro" ? intro() : state.view === "quiz" ? question() : state.view === "lead" ? leadForm() : result();
  try { window.scrollTo(0, 0); } catch (e) {}
  if (state.view === "quiz" || state.view === "lead") {
    var p = document.getElementById("prompt");
    if (p) p.focus({ preventScroll: true });
  }
}

function pick(i) {
  if (advanceTimer) return;
  state.answers[state.idx] = i;
  var buttons = app.querySelectorAll(".option");
  for (var k = 0; k < buttons.length; k++) buttons[k].setAttribute("aria-pressed", String(k === i));
  advanceTimer = setTimeout(function () {
    advanceTimer = null;
    if (state.idx < QUESTIONS.length - 1) { state.idx++; } else { state.view = state.lead ? "result" : "lead"; }
    render();
  }, reduced ? 0 : 200);
}

app.addEventListener("click", function (e) {
  var opt = e.target.closest(".option");
  if (opt) { pick(Number(opt.getAttribute("data-i"))); return; }
  var el = e.target.closest("button");
  if (!el) return;
  if (el.id === "start") { state.view = "quiz"; state.idx = 0; render(); }
  else if (el.id === "back" && state.idx > 0) { state.idx--; render(); }
  else if (el.id === "back-form") { state.view = "quiz"; state.idx = QUESTIONS.length - 1; render(); }
  else if (el.id === "restart") { state.view = "intro"; state.idx = 0; state.answers = {}; render(); }
  else if (el.id === "copy") {
    var txt = shareText(computeResult(state.answers));
    var toast = document.getElementById("toast");
    var done = function () { toast.textContent = "Resultado copiado"; };
    var fail = function () { toast.textContent = txt.replace(/\n/g, " · "); };
    try { navigator.clipboard.writeText(txt).then(done, fail); } catch (err) { fail(); }
  }
});

document.addEventListener("keydown", function (e) {
  if (state.view !== "quiz" || e.metaKey || e.ctrlKey || e.altKey) return;
  var n = Number(e.key);
  if (n >= 1 && n <= QUESTIONS[state.idx].o.length) pick(n - 1);
});

app.addEventListener("submit", function (e) {
  e.preventDefault();
  if (e.target.id === "lead-form" && !state.sending) submitLead(e.target);
});

app.addEventListener("input", function (e) {
  if (e.target.id === "lead-whatsapp") e.target.value = maskPhone(e.target.value);
});

render();
