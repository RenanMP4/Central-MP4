(function () {
  'use strict';

  // ---------- abas do painel ----------
  var TABS = {
    mapa: ['Missões', 'O modo história: a cidade em 3D com os capítulos, o ato atual e as missões, mais as missões do dia e os desafios da semana. Clique num prédio para entrar no lugar.'],
    config: ['Configurações', 'Som, trilha, som ambiente, tempos do pomodoro, visual PS1, qualidade do 3D e a câmera do mapa. Tudo num lugar só, salvando sozinho.'],
    foco: ['Foco', 'Pomodoro ou foco livre, com o boneco trabalhando na mesa (e dormindo na pausa). No Livre você trabalha o quanto quiser e o descanso sai proporcional. Ele avisa no canto da tela, pausa sozinho quando você para de mexer e mostra um mini relógio quando você vai para outra aba.'],
    amigos: ['Amigos', 'Código de amigo, quem está focando agora, ranking da semana, feed de conquistas e o card de cada amigo com o boneco de corpo inteiro. Dá para entrar no mesmo foco de um amigo e terminar junto.'],
    inicio: ['Início', 'Seu perfil e nível, o baú do dia, as missões de hoje, os desafios da semana, seus números e o que está aberto no Premiere agora.'],
    tarefas: ['Tarefas', 'Lista ligada ao pomodoro: escolha a tarefa do foco, marque prioridade, estime quantos focos ela leva e veja quantos levou de verdade.'],
    pack: ['Pack', 'A biblioteca do Essential Pack dentro do Premiere: busca, miniaturas ou lista, forma de onda nos sons, favoritos, etiquetas próprias e arrastar direto para a timeline.'],
    relatorio: ['Relatório', 'Horas por projeto ou por cliente, mapa de calor dos últimos meses, gráfico por dia, meta da semana e quanto isso vale pela sua hora. Exporta planilha.'],
    loja: ['Loja', 'Gaste as fitas que você ganha trabalhando: chapéus, óculos, roupas, salas, pets, ovos de brainrot e itens de temporada. O provador mostra o item no boneco antes de comprar.'],
    conquistas: ['Conquistas', '97 conquistas de bronze, prata, ouro, platina e Lendárias, 10 delas só do After. Cada uma paga fitas uma vez só.']
  };
  var tabs = document.getElementById('tabs');
  var img = document.getElementById('tab-img');
  var shot = img.parentNode;
  function pick(name) {
    var data = TABS[name];
    if (!data) { return; }
    Array.prototype.forEach.call(tabs.children, function (b) { b.setAttribute('aria-selected', String(b.getAttribute('data-tab') === name)); });
    document.getElementById('tab-title').textContent = data[0];
    document.getElementById('tab-desc').textContent = data[1];
    img.alt = 'Painel Central MP4, aba ' + data[0];
    if (img.getAttribute('src') === 'img/painel-' + name + '.webp') { return; }
    shot.classList.add('is-switching');
    var next = new Image();
    next.onload = function () { img.src = next.src; shot.classList.remove('is-switching'); };
    next.src = 'img/painel-' + name + '.webp';
  }
  tabs.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (b) { pick(b.getAttribute('data-tab')); }
  });
  pick('foco');
  // pre-carrega as outras abas depois que a pagina abriu
  window.addEventListener('load', function () {
    Object.keys(TABS).forEach(function (n) { var i = new Image(); i.src = 'img/painel-' + n + '.webp'; });
  });

  // ---------- instalar: Windows / Mac ----------
  var os = document.getElementById('os');
  function pickOs(name) {
    Array.prototype.forEach.call(os.children, function (b) { b.setAttribute('aria-selected', String(b.getAttribute('data-os') === name)); });
    Array.prototype.forEach.call(document.querySelectorAll('.steps'), function (el) { el.hidden = el.getAttribute('data-for') !== name; });
  }
  os.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (b) { pickOs(b.getAttribute('data-os')); }
  });
  if (/Mac/i.test(navigator.platform || navigator.userAgent)) { pickOs('mac'); }

  // ---------- versao mais nova, direto do GitHub ----------
  fetch('https://api.github.com/repos/RenanMP4/Central-MP4/releases/latest')
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (rel) {
      if (!rel || !rel.tag_name) { return; }
      var d = new Date(rel.published_at);
      var when = d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }).replace('.', '');
      document.getElementById('versao').textContent = 'Versão ' + rel.tag_name.replace(/^v/, '') + ' · ' + when;
    })
    .catch(function () { /* fica a versao escrita na pagina */ });

  // ---------- barra do topo ganha linha ao rolar ----------
  var nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- entrada suave dos blocos ----------
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (items) {
      items.forEach(function (it) { if (it.isIntersecting) { it.target.classList.add('is-in'); io.unobserve(it.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    Array.prototype.forEach.call(document.querySelectorAll('.block .head, .block .shot, .split-copy, .grid, .log, .steps, .faq'), function (el) {
      el.classList.add('reveal');
      io.observe(el);
    });
  }
})();
