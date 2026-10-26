/* ThruFly mobile menu: toggles the header drop-down. */
(function () {
  var h = document.querySelector('header.site'); if (!h) return;
  var b = h.querySelector('.menubtn'); if (!b) return;
  function set(o) {
    h.classList.toggle('open', o);
    b.setAttribute('aria-expanded', o ? 'true' : 'false');
    b.querySelector('.mt').textContent = o ? 'Close' : 'Menu';
  }
  b.addEventListener('click', function () { set(!h.classList.contains('open')); });
  [].forEach.call(h.querySelectorAll('ul a'), function (a) { a.addEventListener('click', function () { set(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && h.classList.contains('open')) { set(false); b.focus(); } });
  document.addEventListener('click', function (e) { if (!h.contains(e.target)) set(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 900) set(false); });
})();
