/* ThruFly media controls: adds Pause/Play (and Sound on/off where data-sound is set)
   to every video[data-autoplay]. A user pause is respected by the scroll-based autoplay. */
(function () {
  document.querySelectorAll('video[data-autoplay], video[data-bg]').forEach(function (v) {
    var bg = v.hasAttribute('data-bg');
    var fig = bg ? v.closest('.hero, .team-bg') : v.closest('figure'); if (!fig) return;
    var nativePlay = v.play;
    v.play = function () { return v._held ? Promise.resolve() : nativePlay.call(v); };
    var wrap = document.createElement('div'); wrap.className = 'vctl' + (bg ? ' hctl' : '');
    function btn(label, txt) { var b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', label); b.textContent = txt; wrap.appendChild(b); return b; }
    var pp = btn('Pause video', 'Pause');
    function sync() { pp.textContent = v.paused ? 'Play' : 'Pause'; pp.setAttribute('aria-label', v.paused ? 'Play video' : 'Pause video'); }
    pp.addEventListener('click', function () {
      if (v.paused) { v._held = false; nativePlay.call(v).catch(function () {}); }
      else { v._held = true; v.pause(); }
      sync();
    });
    v.addEventListener('play', sync); v.addEventListener('pause', sync); sync();
    if (v.hasAttribute('data-sound')) {
      var sb = btn('Turn sound on', 'Sound on');
      sb.addEventListener('click', function () {
        v.muted = !v.muted;
        sb.textContent = v.muted ? 'Sound on' : 'Sound off';
        sb.setAttribute('aria-label', v.muted ? 'Turn sound on' : 'Turn sound off');
      });
    }
    fig.appendChild(wrap);
    if (bg) {
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) { v.pause(); wrap.hidden = true; wrap.style.display = 'none'; }
      else {
        v.muted = true; v.defaultMuted = true; v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
        var armed = false;
        function arm() {
          if (armed) return; armed = true;
          var go = function () {
            ['pointerdown', 'touchstart', 'keydown', 'click', 'wheel'].forEach(function (n) { document.removeEventListener(n, go, true); });
            armed = false; try_play();
          };
          ['pointerdown', 'touchstart', 'keydown', 'click', 'wheel'].forEach(function (n) { document.addEventListener(n, go, true); });
        }
        function try_play() {
          if (v._held || document.hidden) return;
          v.muted = true;
          var pr = nativePlay.call(v);
          if (pr && pr.catch) pr.catch(function () { arm(); });
        }
        v.addEventListener('loadeddata', try_play);
        v.addEventListener('canplay', try_play);
        document.addEventListener('visibilitychange', function () { if (!document.hidden) try_play(); });
        if ('IntersectionObserver' in window) {
          new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) try_play(); else v.pause(); }); }, { threshold: 0.05 }).observe(fig);
        } else { try_play(); }
        try_play();
      }
    }
  });
})();
