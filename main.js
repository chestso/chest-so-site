(function () {
  'use strict';

  // ── Page-specific i18n hook: typewriter ──
  Common.onApplyLang = function (dict) {
    updateTypewriter(dict);
  };

  // ── Typewriter Effect ──
  var phrases = [
    'The terminal, reimagined.',
    'C and Lisp never Rusts.',
    'GPU-accelerated glory.',
    'Build with Chest.so',
  ];
  var phraseIndex = 0;
  var charIndex = 0;
  var isDeleting = false;
  var el = document.getElementById('typewriter');
  var typeTimer = null;

  function updateTypewriter(dict) {
    var newPhrases = dict.typewriter || phrases;
    if (newPhrases.join('|') !== phrases.join('|')) {
      phrases = newPhrases;
      phraseIndex = 0;
      charIndex = 0;
      isDeleting = false;
      if (el) el.textContent = '';
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

  // ── Language Switcher & Nav Icons ──
  Common.initLangSwitcher();
  Common.applyLang(Common.getLang());
  Common.renderNavIcons();

  // ── Subtle Gaussian Noise (WebGL) ──
  var noiseContainer = document.getElementById('noise');
  if (noiseContainer && document.createElement('canvas').getContext('webgl')) {
    var canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    noiseContainer.appendChild(canvas);

    var gl = canvas.getContext('webgl');
    if (gl) {
      var vsSource =
        'attribute vec2 a_pos;void main(){gl_Position=vec4(a_pos,0,1);}';
      var fsSource =
        'precision mediump float;uniform float u_time;uniform vec2 u_res;' +
        'float hash(vec2 p){vec3 p3=fract(vec3(p.xyx)*0.1031);' +
        'p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}' +
        'float gaussianNoise(vec2 coord){vec2 seed=coord+u_time*0.01;' +
        'float u1=hash(seed);float u2=hash(seed+vec2(1.0,0.0));' +
        'u1=max(u1,0.0001);float mag=sqrt(-2.0*log(u1));' +
        'return mag*cos(6.28318530718*u2);}' +
        'void main(){vec2 coord=gl_FragCoord.xy;' +
        'coord+=vec2(sin(u_time*0.1)*0.5,cos(u_time*0.13)*0.5);' +
        'float noise=gaussianNoise(coord);' +
        'float intensity=clamp(noise*0.08+0.5,0.0,1.0);' +
        'gl_FragColor=vec4(vec3(intensity),1.0);}';

      function createShader(type, source) {
        var s = gl.createShader(type);
        gl.shaderSource(s, source);
        gl.compileShader(s);
        return s;
      }

      var vs = createShader(gl.VERTEX_SHADER, vsSource);
      var fs = createShader(gl.FRAGMENT_SHADER, fsSource);
      var prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      gl.useProgram(prog);

      var buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW,
      );

      var aPos = gl.getAttribLocation(prog, 'a_pos');
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      var uTime = gl.getUniformLocation(prog, 'u_time');
      var uRes = gl.getUniformLocation(prog, 'u_res');

      function resize() {
        var w = canvas.clientWidth || canvas.parentNode.clientWidth;
        var h = canvas.clientHeight || canvas.parentNode.clientHeight;
        if (w < 2 || h < 2) return;
        canvas.width = w / 2;
        canvas.height = h / 2;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      window.addEventListener('resize', resize);
      requestAnimationFrame(function () {
        resize();
        render();
      });

      var startTime = Date.now();
      var frameInterval = 83;

      function render() {
        gl.uniform1f(uTime, (Date.now() - startTime) / 1000);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        setTimeout(function () {
          requestAnimationFrame(render);
        }, frameInterval);
      }
    }
  }

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ── Apps & Libs Sections ──
  var appsGrid = document.getElementById('apps-grid');
  var libsGrid = document.getElementById('libs-grid');

  function capitalizeName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  function repoUrl(repo) {
    return 'https://github.com/' + repo;
  }

  function releaseUrl(repo) {
    return 'https://github.com/' + repo + '/releases/latest';
  }

  function allocateCells(weights) {
    var result = [];
    var i = 0;
    while (i < weights.length) {
      var w0 = weights[i];
      i++;
      if (i < weights.length) {
        var w1 = weights[i];
        i++;
        var total = w0 + w1;
        var c0 = Math.max(1, Math.min(5, Math.round((6 * w0) / total)));
        var c1 = 6 - c0;
        if (c1 < 1) {
          c1 = 1;
          c0 = 5;
        }
        result.push(c0, c1);
      } else {
        result.push(6);
      }
    }
    return result;
  }

  function fixBarOverflow(container) {
    var cards = container.querySelectorAll('.app-card');

    for (var i = 0; i < cards.length; i += 2) {
      var c0 = cards[i];
      var c1 = cards[i + 1];
      if (!c1) {
        c0.style.gridColumn = 'span 6';
        continue;
      }

      var a = parseInt(c0.dataset.cells, 10) || 3;
      var b = parseInt(c1.dataset.cells, 10) || 3;

      function apply(a, b) {
        c0.style.gridColumn = 'span ' + a;
        c1.style.gridColumn = 'span ' + b;
      }

      function measure() {
        var info0 = c0.querySelector('.app-info');
        var info1 = c1.querySelector('.app-info');
        var h0 = c0.querySelector('h3');
        var h1 = c1.querySelector('h3');
        if (!info0 || !info1 || !h0 || !h1) return [false, false];

        var s0 = getComputedStyle(info0);
        var s1 = getComputedStyle(info1);
        var avail0 =
          info0.clientWidth -
          parseFloat(s0.paddingLeft) -
          parseFloat(s0.paddingRight);
        var avail1 =
          info1.clientWidth -
          parseFloat(s1.paddingLeft) -
          parseFloat(s1.paddingRight);

        var icon0 = c0.querySelector('.app-icon');
        var icon1 = c1.querySelector('.app-icon');
        var iconW0 = icon0 ? icon0.offsetWidth + 12 : 0;
        var iconW1 = icon1 ? icon1.offsetWidth + 12 : 0;

        var old0 = h0.style.whiteSpace;
        var old1 = h1.style.whiteSpace;
        h0.style.whiteSpace = 'nowrap';
        h1.style.whiteSpace = 'nowrap';
        var need0 = iconW0 + h0.scrollWidth;
        var need1 = iconW1 + h1.scrollWidth;
        var overflow0 = need0 > avail0;
        var overflow1 = need1 > avail1;
        h0.style.whiteSpace = old0;
        h1.style.whiteSpace = old1;

        return [overflow0, overflow1];
      }

      apply(a, b);
      var overflow = measure();

      while (overflow[0] || overflow[1]) {
        if (overflow[0] && !overflow[1] && b > 1) {
          a++;
          b--;
        } else if (!overflow[0] && overflow[1] && a > 1) {
          a--;
          b++;
        } else {
          a = 3;
          b = 3;
          apply(a, b);
          break;
        }
        apply(a, b);
        overflow = measure();
      }
    }
  }

  function renderApps(apps, container) {
    var dict = I18N[Common.getLang()] || I18N[Common.DEFAULT_LANG];
    var weights = [];
    for (var i = 0; i < apps.length; i++) {
      weights.push(apps[i].weight || 1);
    }
    var cells = allocateCells(weights);
    var html = '';
    for (var i = 0; i < apps.length; i++) {
      var p = apps[i];
      var displayName = capitalizeName(p.name);
      var flairText = dict[p.flair] || '';
      var hasPromo = !!p.promo;
      var cellSpan = cells[i];
      var spanStyle =
        cellSpan > 1 ? ' style="grid-column: span ' + cellSpan + '"' : '';
      html +=
        '<div class="app-card app-card--bar" data-project="' +
        p.name +
        '" data-cells="' +
        cellSpan +
        '"' +
        spanStyle +
        '>';
      html += '<div class="app-gfx">';
      if (hasPromo) {
        html +=
          '<video src="' +
          Common.escapeHtml(p.promo) +
          '" poster="' +
          Common.escapeHtml(p.gfx) +
          '" loop muted playsinline preload="metadata" aria-label="' +
          Common.escapeHtml(displayName) +
          ' promo video"></video>';
      } else {
        html +=
          '<img src="' +
          Common.escapeHtml(p.gfx) +
          '" alt="' +
          Common.escapeHtml(displayName) +
          '" />';
      }
      html += '</div>';
      html +=
        '<a href="' +
        repoUrl(p.repo) +
        '" class="app-info" target="_blank" rel="noopener">';
      html += '<div class="app-header">';
      html += '<div class="app-icon">';
      if (p.iconType === 'img') {
        html +=
          '<img src="' +
          Common.escapeHtml(p.icon) +
          '" alt="' +
          Common.escapeHtml(displayName) +
          '" width="24" height="24" />';
      } else {
        html += Common.escapeHtml(p.icon);
      }
      html += '</div>';
      html +=
        '<h3>' +
        Common.escapeHtml(displayName) +
        '<span class="badge-version">' +
        Common.escapeHtml(p.version || '') +
        '</span></h3>';
      html += '</div>';
      html +=
        '<span class="card-flair" data-i18n="' +
        p.flair +
        '">' +
        flairText +
        '</span>';
      html += '</a>';
      html += '</div>';
    }
    container.innerHTML = html;
    requestAnimationFrame(function () {
      fixBarOverflow(container);
    });
  }

  // ── Promo video: initialize on load at 90%, then play on hover and loop ──
  function setupPromoPlayOnHover() {
    var videos = document.querySelectorAll('.app-gfx video');
    videos.forEach(function (video) {
      var card = video.closest('.app-card');
      if (!card) return;
      var hovering = false;
      // started separates first activation (seek 90 %, play) from any later
      // re-engagement (resume from currentTime). All input systems share this
      // rule -- previous "mouse re-hover always rewinds to 90 %" was a bug.
      var started = false;
      // focusEngaged captures whether the most recent focusin was from a
      // :focus-visible source (keyboard / programmatic). Without this flag,
      // :focus-visible cannot be checked on focusout (the target is no
      // longer focused), so we record the focusin decision and act on it
      // on focusout.
      var focusEngaged = false;

      function seekTo90() {
        if (video.duration && isFinite(video.duration)) {
          video.currentTime = video.duration * 0.9;
        }
      }

      function startPlayback() {
        function go() {
          if (!started) {
            started = true;
            seekTo90();
          }
          var p = video.play();
          if (p && typeof p.catch === 'function') p.catch(function () {});
        }
        if (video.readyState >= 1) {
          go();
        } else {
          video.addEventListener('loadedmetadata', function once() {
            video.removeEventListener('loadedmetadata', once);
            go();
          });
        }
      }

      function stopPlayback() {
        video.pause();
      }

      function onEnter() {
        // Idempotent -- a re-emitted mouseenter or duplicate focusin shouldn't
        // restart playback after the card is already engaged.
        if (hovering) return;
        hovering = true;
        startPlayback();
      }
      function onLeave() {
        if (!hovering) return;
        hovering = false;
        stopPlayback();
      }

      // ── Initialize on load: paint the frame at 90%, paused. ──
      function initPosterFrame() {
        function go() {
          seekTo90();
          requestAnimationFrame(function () {
            video.pause();
          });
        }
        if (video.readyState >= 1) {
          go();
        } else {
          video.addEventListener('loadedmetadata', function once() {
            video.removeEventListener('loadedmetadata', once);
            go();
          });
        }
      }

      // Reduced motion: the <video poster="..."> already paints the
      // curated 90 % frame as a static image; skip initPosterFrame (which
      // would fetch .webm metadata just to seek to 90 %) and skip
      // registering any play triggers.
      var reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      if (reduceMotion) return;

      initPosterFrame();

      // Mouse / trackpad: hover drives start/stop. Use mouseover/mouseout
      // on the card and check relatedTarget so moving between children
      // (gfx → info) doesn't toggle playback.
      var finePointer = window.matchMedia('(pointer: fine)').matches;
      if (finePointer) {
        card.addEventListener('mouseover', function (e) {
          if (!card.contains(e.relatedTarget)) onEnter();
        });
        card.addEventListener('mouseout', function (e) {
          if (!card.contains(e.relatedTarget)) onLeave();
        });
      }

      // Keyboard: focus is the keyboard equivalent of hover. The
      // :focus-visible filter ensures touch taps (which move focus but
      // are not "keyboard-style" focus) do not double-fire onEnter.
      card.setAttribute('tabindex', '0');
      card.addEventListener('focusin', function (e) {
        if (e.target.matches(':focus-visible')) {
          focusEngaged = true;
          onEnter();
        }
      });
      card.addEventListener('focusout', function () {
        if (focusEngaged) {
          focusEngaged = false;
          onLeave();
        }
      });

      // Click: on touch this is a toggle (tap to play/pause/resume). On
      // mouse systems the hover listeners are already in charge, so a click
      // during hover is a no-op. Prevent the browser's default video click
      // so it doesn't fight our play/pause calls.
      card.addEventListener('click', function (e) {
        if (e.target.closest('a, button')) return;
        if (e.target.tagName === 'VIDEO') {
          e.preventDefault();
        }
        if (finePointer && hovering) return;
        if (hovering) onLeave();
        else onEnter();
      });

      // Loop while active, stop when inactive. Reads the hovering flag shared
      // with mouse / focus / click handlers above.
      video.addEventListener('ended', function () {
        if (!hovering) {
          stopPlayback();
          return;
        }
        // Loop back to the beginning on each repeat (not 90 %).
        function go() {
          video.currentTime = 0;
          var p = video.play();
          if (p && typeof p.catch === 'function') p.catch(function () {});
        }
        if (video.readyState >= 1) {
          go();
        } else if (!video.dataset.loopBound) {
          video.dataset.loopBound = '1';
          video.addEventListener('loadedmetadata', function once() {
            video.removeEventListener('loadedmetadata', once);
            go();
          });
        }
      });
    });
  }

  function renderLibs(libs, container) {
    var dict = I18N[Common.getLang()] || I18N[Common.DEFAULT_LANG];
    var html = '';
    for (var i = 0; i < libs.length; i++) {
      var p = libs[i];
      var displayName = capitalizeName(p.name);
      var flairText = dict[p.flair] || '';
      var descText = dict[p.description] || '';
      html +=
        '<a href="' +
        repoUrl(p.repo) +
        '" class="card" target="_blank" rel="noopener" data-project="' +
        p.name +
        '">';
      html += '<div class="card-icon">' + Common.escapeHtml(p.icon) + '</div>';
      html += '<h3>';
      html += Common.escapeHtml(displayName);
      if (p.version) {
        html +=
          '<span class="badge-version">' +
          Common.escapeHtml(p.version) +
          '</span>';
      }
      html +=
        '<span class="card-flair" data-i18n="' +
        p.flair +
        '">' +
        flairText +
        '</span>';
      html += '</h3>';
      html += '<p data-i18n="' + p.description + '">' + descText + '</p>';
      html += '</a>';
    }
    container.innerHTML = html;
  }

  if (appsGrid || libsGrid) {
    fetch('projects.json')
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        if (appsGrid && data.apps) {
          renderApps(data.apps, appsGrid);
          setupPromoPlayOnHover();
          window.addEventListener('resize', function () {
            fixBarOverflow(appsGrid);
          });
        }
        if (libsGrid && data.libs) {
          renderLibs(data.libs, libsGrid);
        }
        Common.applyLang(Common.getLang());
        fetchLatestReleases(data);
      })
      .catch(function () {});
  }

  function fetchLatestReleases(data) {
    var allProjects = (data.apps || []).concat(data.libs || []);
    var seen = {};
    var unique = [];
    for (var i = 0; i < allProjects.length; i++) {
      var p = allProjects[i];
      if (!seen[p.repo]) {
        seen[p.repo] = true;
        unique.push(p);
      }
    }
    unique.forEach(function (p) {
      fetch('https://api.github.com/repos/' + p.repo + '/releases/latest')
        .then(function (r) {
          return r.ok ? r.json() : null;
        })
        .then(function (release) {
          if (!release || !release.tag_name) return;
          var cards = document.querySelectorAll(
            '[data-project="' + p.name + '"]',
          );
          cards.forEach(function (card) {
            var badge = card.querySelector('.badge-version');
            if (badge) badge.textContent = release.tag_name;
          });
        })
        .catch(function () {});
    });
  }

  // ── Community Section ──
  var communityGrid = document.getElementById('community-grid');
  if (communityGrid) {
    fetch('users.json')
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (users) {
        renderCommunity(users, communityGrid);
      })
      .catch(function () {
        communityGrid.innerHTML = '';
      });
  }

  function renderCommunity(users, container) {
    var dict = I18N[Common.getLang()] || I18N[Common.DEFAULT_LANG];
    var html = '';

    for (var i = 0; i < users.length; i++) {
      var u = users[i];
      var url = u.username + '/';
      var initials = Common.getInitials(u.displayName || u.username);

      var avatarSrc = u.avatar;
      if (!avatarSrc && u.avatarHash) {
        avatarSrc = Common.libravatarUrl(u.avatarHash, 56);
      }
      html +=
        '<a href="' + Common.escapeHtml(url) + '" class="community-card">';
      if (avatarSrc) {
        html +=
          '<img src="' +
          Common.escapeHtml(avatarSrc) +
          '" alt="' +
          Common.escapeHtml(u.displayName || u.username) +
          '" class="community-avatar" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'" />' +
          '<div class="community-avatar-placeholder" style="display:none">' +
          Common.escapeHtml(initials) +
          '</div>';
      } else {
        html +=
          '<div class="community-avatar-placeholder">' +
          Common.escapeHtml(initials) +
          '</div>';
      }
      html += '<h3>' + Common.escapeHtml(u.displayName || u.username) + '</h3>';
      if (u.tagline) {
        html +=
          '<p class="community-card-tagline">' +
          Common.escapeHtml(u.tagline) +
          '</p>';
      }
      var countLabel = (u.projectCount || 0) + ' ';
      countLabel +=
        u.projectCount === 1
          ? dict['community.project'] || 'project'
          : dict['community.projects'] || 'projects';
      html +=
        '<p class="community-card-count">' +
        Common.escapeHtml(countLabel) +
        '</p>';
      html +=
        '<span class="btn btn-small btn-primary">' +
        Common.escapeHtml(dict['community.view'] || 'View') +
        '</span>';
      html += '</a>';
    }

    // "Get your own page" card
    html +=
      '<a href="https://github.com/chestso/chest-so-site" class="community-card community-card-yours" target="_blank" rel="noopener">';
    html += '<div class="yours-icon">+</div>';
    html +=
      '<div class="yours-text">' +
      Common.escapeHtml(dict['community.yours'] || 'Get your own page') +
      '</div>';
    html += '</a>';

    container.innerHTML = html;
  }
})();
