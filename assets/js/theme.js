/* Переключатели палитры и темы */
(function () {
  var d = document.documentElement;
  var PALETTES = {
    forest: { name: 'Лес и бумага', light: '#F6F3EA', dark: '#0E1613' },
    clay: { name: 'Терракота', light: '#FAF5EE', dark: '#17120F' },
    steel: { name: 'Туман и сталь', light: '#F3F5F7', dark: '#0F1418' },
    rose: { name: 'Пыльная роза', light: '#FAF4F4', dark: '#161113' },
    graphite: { name: 'Графит', light: '#F7F7F4', dark: '#121212' }
  };

  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  function syncPaletteButtons() {
    var current = d.getAttribute('data-palette');
    document.querySelectorAll('.palette-dot').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.dataset.palette === current));
    });
  }

  function syncThemeButton() {
    var isDark = d.getAttribute('data-theme') === 'dark';
    var btn = document.querySelector('.theme-btn');
    if (!btn) return;
    btn.setAttribute('aria-label', isDark ? 'Включить светлую тему' : 'Включить тёмную тему');
    btn.setAttribute('title', isDark ? 'Светлая тема' : 'Тёмная тема');
  }

  function syncMetaThemeColor() {
    var meta = document.querySelector('meta[name="theme-color"]');
    var palette = PALETTES[d.getAttribute('data-palette')] || PALETTES.forest;
    var color = d.getAttribute('data-theme') === 'dark' ? palette.dark : palette.light;
    if (meta) meta.setAttribute('content', color);
  }

  function setPalette(name) {
    if (!PALETTES[name]) return;
    d.setAttribute('data-palette', name);
    store('palette', name);
    syncPaletteButtons();
    syncMetaThemeColor();
  }

  function setTheme(theme) {
    d.setAttribute('data-theme', theme);
    store('theme-mode', theme);
    syncThemeButton();
    syncMetaThemeColor();
  }

  document.querySelectorAll('.palette-dot').forEach(function (btn) {
    btn.addEventListener('click', function () { setPalette(btn.dataset.palette); });
  });

  var themeBtn = document.querySelector('.theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      setTheme(d.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  /* Мобильное меню */
  var burger = document.querySelector('.burger');
  var menu = document.querySelector('.mobile-menu');
  if (burger && menu) {
    var lastFocus = null;

    var setMenu = function (open) {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Меню');
      menu.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);

      if (open) {
        lastFocus = document.activeElement;
        var first = menu.querySelector('a, button');
        if (first) first.focus();
      } else if (lastFocus && lastFocus.focus) {
        lastFocus.focus();
        lastFocus = null;
      }
    };

    burger.addEventListener('click', function () {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });

    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        burger.focus();
      }
    });

    /* На широком экране меню не нужно — закрываем, чтобы не залипло */
    var wide = matchMedia('(min-width: 981px)');
    var onWide = function () {
      if (wide.matches && burger.getAttribute('aria-expanded') === 'true') setMenu(false);
    };
    if (wide.addEventListener) wide.addEventListener('change', onWide);
    else if (wide.addListener) wide.addListener(onWide);
  }

  /* Кнопка «Скопировать почту» */
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.getAttribute('data-copy');
      var status = btn.parentNode.querySelector('.copy-status');
      var done = function () {
        if (status) status.textContent = 'Адрес скопирован';
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done, function () {
          if (status) status.textContent = 'Не удалось скопировать. Адрес: ' + value;
        });
      } else if (status) {
        status.textContent = 'Адрес: ' + value;
      }
    });
  });

  /* Подсветка текущего раздела в меню.
     Ссылки с якорем (#about, #contact) не считаем текущей страницей:
     иначе на главной они подсвечиваются вместе с ней. */
  var page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a, .mobile-menu a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (href.indexOf('#') !== -1) return;
    if (href.split('#')[0] === page) a.setAttribute('aria-current', 'page');
  });

  syncPaletteButtons();
  syncThemeButton();
  syncMetaThemeColor();
})();
