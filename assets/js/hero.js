/* Плашка-постер: буквы, частицы, шапка поверх фона */
(function () {
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Буквы заголовка --- */
  var title = document.getElementById('posterTitle');
  if (title) {
    var text = title.textContent.trim();
    title.textContent = '';
    text.split('').forEach(function (ch, i) {
      var outer = document.createElement('span');
      outer.className = 'letter';
      outer.style.animationDelay = (0.08 + i * 0.055) + 's';

      var inner = document.createElement('span');
      inner.className = 'letter-in';
      inner.textContent = ch;

      outer.appendChild(inner);
      title.appendChild(outer);
    });
    if (reduced) {
      title.querySelectorAll('.letter').forEach(function (el) {
        el.style.animation = 'none';
      });
    }
  }

  /* --- Частицы --- */
  var box = document.getElementById('particles');
  if (box && !reduced) {
    for (var i = 0; i < 28; i++) {
      var p = document.createElement('span');
      p.className = 'particle';
      var size = 2 + Math.random() * 2.5;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = (Math.random() * 100) + '%';
      p.style.top = (30 + Math.random() * 75) + '%';
      p.style.animationDuration = (14 + Math.random() * 14).toFixed(1) + 's';
      p.style.animationDelay = (-Math.random() * 22).toFixed(1) + 's';
      box.appendChild(p);
    }
  }

  /* --- Шапка: прозрачная на постере, плотная после скролла --- */
  var header = document.querySelector('.site-header');
  if (header && document.body.classList.contains('has-poster')) {
    var toggle = function () {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    toggle();
    window.addEventListener('scroll', toggle, { passive: true });
  }
})();
