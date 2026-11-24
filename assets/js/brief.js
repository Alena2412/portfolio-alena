/* Бриф: сборка письма, черновик, копирование */
(function () {
  var form = document.getElementById('briefForm');
  if (!form) return;

  var EMAIL = 'alenapopova149@gmail.com';
  var DRAFT = 'brief-draft';
  var FIELDS = ['name', 'channel', 'contact', 'service', 'about', 'task', 'deadline', 'budget', 'refs', 'extra'];

  var result = document.getElementById('briefResult');
  var output = document.getElementById('briefText');
  var status = document.getElementById('briefStatus');
  var mailLink = document.getElementById('mailBrief');

  function val(name) {
    var el = form.elements[name];
    return el ? String(el.value || '').trim() : '';
  }

  function checkedAssets() {
    var boxes = form.querySelectorAll('input[name="assets"]');
    var out = [];
    Array.prototype.forEach.call(boxes, function (box) {
      if (box.checked) out.push(box.value);
    });
    return out;
  }

  function clearErrors() {
    Array.prototype.forEach.call(form.querySelectorAll('.field'), function (f) {
      f.classList.remove('has-error');
    });
    Array.prototype.forEach.call(form.querySelectorAll('.field-error'), function (e) {
      e.remove();
    });
    Array.prototype.forEach.call(form.querySelectorAll('[aria-invalid]'), function (e) {
      e.removeAttribute('aria-invalid');
    });
    Array.prototype.forEach.call(form.querySelectorAll('[aria-describedby^="err-"]'), function (e) {
      e.removeAttribute('aria-describedby');
    });
  }

  function setError(name, message) {
    var el = form.elements[name];
    if (!el) return;
    var field = el.closest('.field');
    if (!field) return;
    field.classList.add('has-error');
    el.setAttribute('aria-invalid', 'true');
    if (!field.querySelector('.field-error')) {
      var p = document.createElement('p');
      p.className = 'field-error';
      p.id = 'err-' + name;
      p.textContent = message;
      field.appendChild(p);
    }
    el.setAttribute('aria-describedby', 'err-' + name);
  }

  function buildText() {
    var lines = [];
    lines.push('Бриф с сайта');
    lines.push('');
    lines.push('Имя: ' + (val('name') || '—'));
    lines.push('Связь: ' + val('channel') + ' — ' + (val('contact') || '—'));
    lines.push('Услуга: ' + val('service'));
    lines.push('');
    lines.push('О проекте: ' + (val('about') || '—'));
    lines.push('');
    lines.push('Задача: ' + val('task'));
    lines.push('');
    lines.push('Что уже есть: ' + (checkedAssets().join(', ') || '—'));
    lines.push('Сроки: ' + val('deadline'));
    lines.push('Бюджет: ' + val('budget'));
    lines.push('');
    lines.push('Примеры: ' + (val('refs') || '—'));
    lines.push('Дополнительно: ' + (val('extra') || '—'));
    return lines.join('\n');
  }

  /* ---------- Черновик ---------- */
  function saveDraft() {
    var data = {};
    FIELDS.forEach(function (f) { data[f] = val(f); });
    data.assets = checkedAssets();
    try { localStorage.setItem(DRAFT, JSON.stringify(data)); } catch (e) {}
  }

  function loadDraft() {
    var raw = null;
    try { raw = localStorage.getItem(DRAFT); } catch (e) { return; }
    if (!raw) return;

    var data = null;
    try { data = JSON.parse(raw); } catch (e) { return; }
    if (!data) return;

    FIELDS.forEach(function (f) {
      if (data[f] != null && form.elements[f]) form.elements[f].value = data[f];
    });

    if (data.assets && data.assets.length) {
      Array.prototype.forEach.call(form.querySelectorAll('input[name="assets"]'), function (box) {
        box.checked = data.assets.indexOf(box.value) !== -1;
      });
    }
  }

  form.addEventListener('input', saveDraft);
  form.addEventListener('change', saveDraft);
  loadDraft();

  /* ---------- Отправка ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    var ok = true;
    if (!val('name')) {
      setError('name', 'Напишите, как к вам обращаться');
      ok = false;
    }
    if (!val('contact')) {
      setError('contact', 'Нужен контакт, чтобы ответить');
      ok = false;
    }
    if (val('task').length < 10) {
      setError('task', 'Опишите задачу хотя бы одним предложением');
      ok = false;
    }

    if (!ok) {
      var first = form.querySelector('.has-error input, .has-error textarea, .has-error select');
      if (first) first.focus();
      return;
    }

    var text = buildText();
    var subject = 'Бриф с сайта — ' + val('name') + ' · ' + val('service');

    output.value = text;
    mailLink.href = 'mailto:' + EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(text);

    result.hidden = false;
    status.textContent = 'Бриф собран. Отправьте письмо или скопируйте текст в Telegram.';
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
    result.setAttribute('tabindex', '-1');
    result.focus({ preventScroll: true });
  });

  /* ---------- Копирование ---------- */
  var copyBtn = document.getElementById('copyBrief');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      output.focus();
      output.select();
      output.setSelectionRange(0, output.value.length);

      function done() {
        status.textContent = 'Скопировано. Вставьте текст в письмо или в Telegram.';
      }
      function fail() {
        status.textContent = 'Не получилось скопировать автоматически — текст выделен, нажмите Ctrl+C.';
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(output.value).then(done, function () {
          try { document.execCommand('copy') ? done() : fail(); } catch (e) { fail(); }
        });
      } else {
        try { document.execCommand('copy') ? done() : fail(); } catch (e) { fail(); }
      }
    });
  }

  /* ---------- Очистка ---------- */
  var resetBtn = document.getElementById('briefReset');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      form.reset();
      clearErrors();
      try { localStorage.removeItem(DRAFT); } catch (e) {}
      result.hidden = true;
      status.textContent = '';
      var first = form.querySelector('input, textarea, select');
      if (first) first.focus();
    });
  }

  /* Если пользователь уже собрал бриф и правит поля — прячем результат */
  form.addEventListener('input', function () {
    if (!result.hidden) result.hidden = true;
  });
})();
