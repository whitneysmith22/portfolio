// whitneydelyse.com — small progressive enhancements
(function () {
  // Swipeable sliders: <div class="slider"><div class="swipe">…slides…</div></div>
  document.querySelectorAll('.slider').forEach(function (box) {
    var track = box.querySelector('.swipe');
    if (!track) return;
    var slides = Array.prototype.slice.call(track.children);
    if (slides.length < 2) return;
    var label = box.getAttribute('data-label') || 'image';
    var dots = document.createElement('div');
    dots.className = 'dots';
    var prev = document.createElement('button');
    var next = document.createElement('button');
    prev.className = 'arrow prev'; prev.type = 'button'; prev.setAttribute('aria-label', 'Previous ' + label); prev.innerHTML = '&larr;';
    next.className = 'arrow next'; next.type = 'button'; next.setAttribute('aria-label', 'Next ' + label); next.innerHTML = '&rarr;';
    var host = box.querySelector('.swipe-frame') || box;
    host.appendChild(prev); host.appendChild(next);
    function go(i) { track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' }); }
    slides.forEach(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Show ' + label + ' ' + (i + 1) + ' of ' + slides.length);
      b.addEventListener('click', function () { go(i); });
      dots.appendChild(b);
    });
    (box.querySelector('.dots-host') || box).appendChild(dots);
    function current() { return Math.round(track.scrollLeft / Math.max(1, track.clientWidth)); }
    function update() {
      var c = current();
      Array.prototype.forEach.call(dots.children, function (d, i) { d.setAttribute('aria-current', i === c ? 'true' : 'false'); });
      prev.disabled = c <= 0; next.disabled = c >= slides.length - 1;
    }
    prev.addEventListener('click', function () { go(Math.max(0, current() - 1)); });
    next.addEventListener('click', function () { go(Math.min(slides.length - 1, current() + 1)); });
    var t; track.addEventListener('scroll', function () { clearTimeout(t); t = setTimeout(update, 60); }, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  // Fixed-size collage "stages" that scale down to fit their container.
  // <div class="stage" data-w="1440" data-h="580"><div class="stage-inner">…</div></div>
  var stages = document.querySelectorAll('.stage');
  function fit() {
    stages.forEach(function (st) {
      var inner = st.querySelector('.stage-inner');
      var narrow = window.matchMedia('(max-width: 1024px)').matches;
      var w = +(narrow && st.dataset.wNarrow ? st.dataset.wNarrow : st.dataset.w);
      var h = +(narrow && st.dataset.hNarrow ? st.dataset.hNarrow : st.dataset.h);
      var s = Math.min(1, st.clientWidth / w);
      inner.style.width = w + 'px';
      inner.style.height = h + 'px';
      inner.style.transform = 'scale(' + s + ')';
      st.style.height = (h * s) + 'px';
      st.style.setProperty('--s', s);
    });
  }
  if (stages.length) { fit(); window.addEventListener('resize', fit); }

  // Click-to-play video embeds: <a class="video" data-vimeo="ID" href="https://vimeo.com/ID">
  document.querySelectorAll('[data-vimeo]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var f = document.createElement('iframe');
      f.src = 'https://player.vimeo.com/video/' + a.dataset.vimeo + '?autoplay=1&title=0&byline=0&portrait=0';
      f.allow = 'autoplay; fullscreen; picture-in-picture';
      f.allowFullscreen = true;
      f.title = a.getAttribute('aria-label') || 'Video';
      a.appendChild(f);
      a.querySelectorAll('.play,.chip').forEach(function (n) { n.remove(); });
      a.removeAttribute('href');
    });
  });

  // Autoplay muted loops (iOS needs a nudge)
  document.querySelectorAll('video[data-loop]').forEach(function (v) {
    v.muted = true;
    var p = v.play(); if (p && p.catch) p.catch(function () {});
  });
})();
