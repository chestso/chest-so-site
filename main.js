(function () {
  "use strict";

  // ── Typewriter Effect ──
  var phrases = [
    "Open your Chest.",
    "The terminal, reimagined.",
    "C for the core, Lisp for you.",
    "C and Lisp never Rusts.",
    "GPU-accelerated glory.",
    "Build with Chest.so",
  ];
  var phraseIndex = 0;
  var charIndex = 0;
  var isDeleting = false;
  var el = document.getElementById("typewriter");

  function type() {
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

    setTimeout(type, delay);
  }

  type();

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
