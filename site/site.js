/* Disarm Goliath — shared site behaviour
   - mobile nav toggle
   - scroll-reveal for .reveal elements
   - front-end-only handling for newsletter / contact forms
     (wire these up to a real backend, Mailchimp embed, Formspree, etc.) */

(function () {
  'use strict';

  // ---- Mobile nav ----
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  }

  // ---- Scroll reveal ----
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // ---- Forms (placeholder handling) ----
  document.querySelectorAll('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var msg = form.querySelector('[data-formmsg]');
      if (msg) {
        msg.textContent = 'Thanks — you’re on the list. (Connect this form to your mailing provider to go live.)';
        msg.style.color = '#e63946';
      }
      form.reset();
    });
  });

  // ---- Member photos ----
  // Each .member-photo[data-photo="Lastname"] gets its image auto-loaded from
  // ../Images/Lastname.<ext>, trying common formats. If none exist, the
  // initials placeholder stays. This means you can drop a Bell.jpg (or .png,
  // .webp…) into Images and it just appears — no HTML editing needed.
  document.querySelectorAll('.member-photo[data-photo]').forEach(function (ph) {
    var base = ph.getAttribute('data-photo');
    // Try several name-casings (Bell / bell / BELL) and formats, so the photo
    // resolves even on case-sensitive hosting regardless of how the file is named.
    var names = [base, base.toLowerCase(), base.toUpperCase()];
    var exts = ['jpg', 'jpeg', 'png', 'webp'];
    var candidates = [];
    names.forEach(function (n) {
      exts.forEach(function (e) { candidates.push('../Images/' + n + '.' + e); });
    });
    candidates = candidates.filter(function (v, idx) { return candidates.indexOf(v) === idx; });

    var i = 0;
    var img = new Image();
    img.alt = ph.getAttribute('data-alt') || base;
    img.onload = function () {
      ph.classList.add('has-photo');
      ph.appendChild(img);
    };
    function tryNext() {
      if (i < candidates.length) { img.src = candidates[i++]; }
    }
    img.onerror = tryNext;
    tryNext();
  });

  // ---- Footer year ----
  var y = document.querySelector('[data-year]');
  if (y) { y.textContent = new Date().getFullYear(); }
})();
