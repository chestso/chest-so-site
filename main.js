(function () {
  "use strict";

  var SUPPORTED = ["en", "zh", "fa", "ar", "th", "ru"];
  var DEFAULT_LANG = "en";

  function getLang() {
    var stored = null;
    try {
      stored = localStorage.getItem("chest-lang");
    } catch (e) {}
    if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
    var nav = (navigator.language || "").toLowerCase();
    for (var i = 0; i < SUPPORTED.length; i++) {
      if (nav.indexOf(SUPPORTED[i]) === 0) return SUPPORTED[i];
    }
    return DEFAULT_LANG;
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT_LANG;
    try {
      localStorage.setItem("chest-lang", lang);
    } catch (e) {}
    applyLang(lang);
  }

  function applyLang(lang) {
    var dict = I18N[lang] || I18N[DEFAULT_LANG];

    document.documentElement.lang = lang;

    var isRTL = RTL_LANGS.indexOf(lang) !== -1;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.body.classList.toggle("rtl", isRTL);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });

    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      var pairs = el.getAttribute("data-i18n-attr").split(",");
      pairs.forEach(function (pair) {
        var parts = pair.split(":");
        var attr = parts[0].trim();
        var key = parts[1].trim();
        if (dict[key] !== undefined) el.setAttribute(attr, dict[key]);
      });
    });

    var btn = document.getElementById("lang-btn");
    if (btn) btn.textContent = lang.toUpperCase();

    var menu = document.getElementById("lang-menu");
    if (menu) {
      menu.querySelectorAll("[data-lang]").forEach(function (item) {
        if (item.getAttribute("data-lang") === lang) {
          item.classList.add("lang-active");
        } else {
          item.classList.remove("lang-active");
        }
      });
    }

    updateTypewriter(dict);
  }

  // ── Typewriter Effect ──
  var phrases = [
    "The terminal, reimagined.",
    "C and Lisp never Rusts.",
    "GPU-accelerated glory.",
    "Build with Chest.so",
  ];
  var phraseIndex = 0;
  var charIndex = 0;
  var isDeleting = false;
  var el = document.getElementById("typewriter");
  var typeTimer = null;

  function updateTypewriter(dict) {
    var newPhrases = dict.typewriter || phrases;
    if (newPhrases.join("|") !== phrases.join("|")) {
      phrases = newPhrases;
      phraseIndex = 0;
      charIndex = 0;
      isDeleting = false;
      if (el) el.textContent = "";
      if (typeTimer) clearTimeout(typeTimer);
      type();
    }
  }

  function type() {
    if (!el) return;
    var current = phrases[phraseIndex];
    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    var delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === current.length) {
      delay = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    typeTimer = setTimeout(type, delay);
  }

  type();

  // ── Language Switcher ──
  var langBtn = document.getElementById("lang-btn");
  var langMenu = document.getElementById("lang-menu");

  if (langBtn && langMenu) {
    langBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var isOpen = langMenu.classList.toggle("lang-menu-open");
      langBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    langMenu.addEventListener("click", function (e) {
      var item = e.target.closest("[data-lang]");
      if (item) {
        setLang(item.getAttribute("data-lang"));
        langMenu.classList.remove("lang-menu-open");
        langBtn.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("click", function () {
      langMenu.classList.remove("lang-menu-open");
      langBtn.setAttribute("aria-expanded", "false");
    });
  }

  applyLang(getLang());

  // ── Subtle Gaussian Noise (2D Canvas) ──
  var noiseContainer = document.getElementById("noise");
  if (noiseContainer) {
    var canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    noiseContainer.appendChild(canvas);

    var ctx = canvas.getContext("2d");
    var frameInterval = 83;

    var grainScale = 2;

    function resize() {
      canvas.width = Math.ceil(canvas.clientWidth / grainScale);
      canvas.height = Math.ceil(canvas.clientHeight / grainScale);
    }

    window.addEventListener("resize", resize);
    resize();

    function render() {
      ctx.imageSmoothingEnabled = false;
      var w = canvas.width;
      var h = canvas.height;
      var img = ctx.createImageData(w, h);
      var d = img.data;
      for (var i = 0; i < d.length; i += 4) {
        var v = Math.random() * 0.3 + 0.5;
        d[i] = d[i + 1] = d[i + 2] = (v * 255) | 0;
        d[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      setTimeout(function () {
        requestAnimationFrame(render);
      }, frameInterval);
    }

    render();
  }

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
})();
