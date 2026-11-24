/* Отрисовка работ, кейсов и услуг */
(function () {
  var IMG = 'assets/img/works/';

  function imgTag(image, sizes, eager) {
    var base = IMG + image.src;
    var pos = image.pos ? ' style="object-position:' + image.pos + '"' : '';
    return '<img src="' + base + '-800.jpg" ' +
      'srcset="' + base + '-800.jpg 800w, ' + base + '-1600.jpg 1600w" ' +
      'sizes="' + sizes + '" alt="' + image.alt + '" ' +
      (eager ? '' : 'loading="lazy" ') +
      'decoding="async"' + pos + '>';
  }

  function workCard(work) {
    return '<a class="work-card" href="work.html?id=' + work.id + '">' +
      '<div class="work-media">' + imgTag(work.images[0], '(min-width: 1180px) 370px, 45vw') + '</div>' +
      '<div class="work-body">' +
        '<span class="work-cat">' + work.catLabel + '</span>' +
        '<span class="work-title">' + work.title + '</span>' +
        '<span class="work-desc">' + work.summary + '</span>' +
        '<span class="work-year">' + work.year + '</span>' +
      '</div></a>';
  }

  /* ---------- Сетка работ с фильтрами ---------- */
  var grid = document.getElementById('worksGrid');
  if (grid) {
    var filters = document.getElementById('filters');
    var count = document.getElementById('worksCount');
    var current = 'all';

    /* Фильтр можно передать ссылкой: works.html?cat=poster */
    var wanted = new URLSearchParams(location.search).get('cat');
    if (wanted && CATEGORIES.some(function (c) { return c.id === wanted; })) current = wanted;

    function draw() {
      var list = current === 'all' ? WORKS : WORKS.filter(function (w) { return w.cat === current; });
      grid.innerHTML = list.map(workCard).join('');
      if (count) count.textContent = list.length + ' ' + plural(list.length, 'работа', 'работы', 'работ');
    }

    function remember() {
      var url = location.pathname + (current === 'all' ? '' : '?cat=' + encodeURIComponent(current));
      try { history.replaceState(null, '', url); } catch (e) {}
    }

    if (filters) {
      filters.innerHTML = CATEGORIES.map(function (c) {
        return '<button class="filter" data-cat="' + c.id + '" aria-pressed="' +
          (c.id === current) + '">' + c.label + '</button>';
      }).join('');

      filters.addEventListener('click', function (e) {
        var btn = e.target.closest('.filter');
        if (!btn) return;
        current = btn.dataset.cat;
        filters.querySelectorAll('.filter').forEach(function (b) {
          b.setAttribute('aria-pressed', String(b === btn));
        });
        remember();
        draw();
      });
    }

    draw();
  }

  function plural(n, one, few, many) {
    var mod10 = n % 10, mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
    return many;
  }

  /* ---------- Услуги ---------- */
  var servicesGrid = document.getElementById('servicesGrid');
  if (servicesGrid && typeof SERVICES !== 'undefined') {
    servicesGrid.innerHTML = SERVICES.map(function (s) {
      return '<div class="service' + (s.featured ? ' featured' : '') + '">' +
        '<h3>' + s.title + '</h3>' +
        '<p class="hint">' + s.hint + '</p>' +
        '<ul>' + s.items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>' +
        '<div class="service-foot">' +
          '<div class="service-price">' + s.term + '<b>' + s.price + '</b></div>' +
        '</div></div>';
    }).join('');
  }

  /* ---------- Страница кейса ---------- */
  var caseRoot = document.getElementById('caseRoot');
  if (caseRoot) {
    var id = new URLSearchParams(location.search).get('id');
    var index = WORKS.findIndex(function (w) { return w.id === id; });
    if (index === -1) index = 0;
    var work = WORKS[index];
    var prev = WORKS[(index - 1 + WORKS.length) % WORKS.length];
    var next = WORKS[(index + 1) % WORKS.length];

    document.title = work.title + ' — Алёна Попова';
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', work.summary);

    var first = work.images[0];
    var rest = work.images.slice(1);
    var cover = first.tall ? '' :
      '<div class="container"><figure class="case-cover">' + imgTag(first, '(min-width: 1180px) 1120px, 100vw', true) + '</figure></div>';

    var galleryImages = first.tall ? work.images : rest;
    var gallery = '';
    if (galleryImages.length) {
      gallery = '<div class="container"><div class="gallery' + (galleryImages.length > 1 ? ' cols-2' : '') + '">' +
        galleryImages.map(function (image) {
          if (image.tall) {
            return '<figure class="tall">' + imgTag(image, '(min-width: 1180px) 860px, 100vw') +
              '<figcaption><a href="' + IMG + image.src + '-1600.jpg" target="_blank" rel="noopener">Открыть оригинал в новой вкладке ↗</a></figcaption></figure>';
          }
          return imgTag(image, galleryImages.length > 1 ? '(min-width: 1180px) 540px, 45vw' : '(min-width: 1180px) 1120px, 100vw');
        }).join('') + '</div></div>';
    }

    caseRoot.innerHTML =
      '<div class="container case-head">' +
        '<a class="back-link" href="works.html">← Все работы</a>' +
        '<h1>' + work.title + '</h1>' +
        '<p class="case-lead">' + work.lead + '</p>' +
        '<dl class="case-meta">' +
          '<div><dt>Категория</dt><dd>' + work.catLabel + '</dd></div>' +
          '<div><dt>Год</dt><dd>' + work.year + '</dd></div>' +
          '<div><dt>Роль</dt><dd>' + work.role + '</dd></div>' +
          '<div><dt>Инструменты</dt><dd>' + work.tools.join(', ') + '</dd></div>' +
        '</dl>' +
      '</div>' +
      cover +
      '<div class="container case-body">' +
        '<aside class="case-aside">' +
          '<div class="block"><h2>Что сделано</h2><ul>' +
            work.did.map(function (d) { return '<li>' + d + '</li>'; }).join('') +
          '</ul></div>' +
        '</aside>' +
        '<div class="case-text">' +
          '<h2>Задача</h2><p>' + work.task + '</p>' +
          '<h2 style="margin-top:28px">Решение</h2><p>' + (work.solution || work.summary) + '</p>' +
        '</div>' +
      '</div>' +
      gallery +
      '<div class="container case-nav">' +
        '<a href="work.html?id=' + prev.id + '"><span class="dir">← Предыдущая</span><span class="name">' + prev.title + '</span></a>' +
        '<a href="work.html?id=' + next.id + '" style="text-align:right"><span class="dir">Следующая →</span><span class="name">' + next.title + '</span></a>' +
      '</div>';
  }
})();
