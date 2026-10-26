/* ThruFly hero workflow: rotates through five turnaround stages.
   Pause button, pause on hover/focus, no auto-rotation for reduced-motion users. */
(function () {
  var root = document.getElementById('flow'); if (!root) return;
  var tabs = [].slice.call(root.querySelectorAll('[role=tab]'));
  var panels = [].slice.call(root.querySelectorAll('.fl-panel'));
  var imgs = [].slice.call(root.querySelectorAll('.fl-media img'));
  var pp = root.querySelector('.fl-pp');
  var count = root.querySelector('.fl-count'), prev = root.querySelector('.fl-prev'), next = root.querySelector('.fl-next');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cur = 0, timer = null, held = reduce, hover = false;
  function show(i) {
    cur = (i + tabs.length) % tabs.length;
    tabs.forEach(function (t, k) {
      t.setAttribute('aria-selected', k === cur ? 'true' : 'false'); t.tabIndex = k === cur ? 0 : -1;
      t.classList.toggle('done', k < cur); t.classList.toggle('link', k <= cur);
    });
    panels.forEach(function (p, k) { p.hidden = k !== cur; p.classList.toggle('on', k === cur); });
    imgs.forEach(function (m, k) { m.classList.toggle('on', k === cur); });
    if (count) count.innerHTML = 'Stage <b>' + (cur + 1) + ' of ' + tabs.length + '</b> &middot; ' + tabs[cur].textContent;
  }
  function tick() { show(cur + 1); }
  function start() { stop(); if (!held && !hover) timer = setInterval(tick, 4800); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function label() { pp.textContent = held ? 'Play' : 'Pause'; pp.setAttribute('aria-label', held ? 'Play the workflow' : 'Pause the workflow'); }
  tabs.forEach(function (t, k) {
    t.addEventListener('click', function () { show(k); start(); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
      e.preventDefault(); show(cur + d); tabs[cur].focus(); start();
    });
  });
  if (prev) prev.addEventListener('click', function () { show(cur - 1); start(); });
  if (next) next.addEventListener('click', function () { show(cur + 1); start(); });
  pp.addEventListener('click', function () { held = !held; label(); held ? stop() : start(); });
  root.addEventListener('mouseenter', function () { hover = true; stop(); });
  root.addEventListener('mouseleave', function () { hover = false; start(); });
  root.addEventListener('focusin', function () { stop(); });
  root.addEventListener('focusout', function () { start(); });
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  label(); show(0); start();
})();
