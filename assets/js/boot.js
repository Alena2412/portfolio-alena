/* Применяем тему и палитру до отрисовки — без белой вспышки */
(function () {
  var d = document.documentElement;
  var palette = 'forest';
  var theme = 'auto';
  try {
    palette = localStorage.getItem('palette') || 'forest';
    theme = localStorage.getItem('theme') || 'auto';
  } catch (e) {}

  var dark = matchMedia('(prefers-color-scheme: dark)').matches;
  d.setAttribute('data-palette', palette);
  d.setAttribute('data-theme', theme === 'auto' ? (dark ? 'dark' : 'light') : theme);
  d.classList.add('no-anim');

  window.addEventListener('load', function () {
    setTimeout(function () { d.classList.remove('no-anim'); }, 60);
  });
})();
