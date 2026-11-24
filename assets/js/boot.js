/* Применяем тему и палитру до отрисовки — без белой вспышки */
(function () {
  var d = document.documentElement;
  var palette = 'forest';
  var theme = 'light';
  try {
    palette = localStorage.getItem('palette') || 'forest';
    /* Светлая тема — основная. Тёмная включается кнопкой и запоминается
       под новым ключом, чтобы старый выбор «тёмная» не перекрывал новый вид. */
    theme = localStorage.getItem('theme-mode') === 'dark' ? 'dark' : 'light';
  } catch (e) {}

  d.setAttribute('data-palette', palette);
  d.setAttribute('data-theme', theme);
  d.classList.add('no-anim');

  window.addEventListener('load', function () {
    setTimeout(function () { d.classList.remove('no-anim'); }, 60);
  });
})();
