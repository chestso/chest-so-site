(function () {
  'use strict';

  var SUPPORTED = ['en', 'zh', 'fa', 'ar', 'th', 'ru'];
  var DEFAULT_LANG = 'en';

  function getLang() {
    var stored = null;
    try {
      stored = localStorage.getItem('chest-lang');
    } catch (e) {}
    if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
    var nav = (navigator.language || '').toLowerCase();
    for (var i = 0; i < SUPPORTED.length; i++) {
      if (nav.indexOf(SUPPORTED[i]) === 0) return SUPPORTED[i];
    }
    return DEFAULT_LANG;
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT_LANG;
    try {
      localStorage.setItem('chest-lang', lang);
    } catch (e) {}
    applyLang(lang);
  }

  function applyLang(lang) {
    var dict = I18N[lang] || I18N[DEFAULT_LANG];

    document.documentElement.lang = lang;

    var isRTL = RTL_LANGS.indexOf(lang) !== -1;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.body.classList.toggle('rtl', isRTL);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      var pairs = el.getAttribute('data-i18n-attr').split(',');
      pairs.forEach(function (pair) {
        var parts = pair.split(':');
        var attr = parts[0].trim();
        var key = parts[1].trim();
        if (dict[key] !== undefined) el.setAttribute(attr, dict[key]);
      });
    });

    var btn = document.getElementById('lang-btn');
    if (btn) btn.textContent = lang.toUpperCase();

    var menu = document.getElementById('lang-menu');
    if (menu) {
      menu.querySelectorAll('[data-lang]').forEach(function (item) {
        if (item.getAttribute('data-lang') === lang) {
          item.classList.add('lang-active');
        } else {
          item.classList.remove('lang-active');
        }
      });
    }

    updateProjectLabels(dict);
  }

  function updateProjectLabels(dict) {
    var titleEl = document.getElementById('user-projects-title');
    if (titleEl && dict['user.projects.title']) {
      var username = titleEl.getAttribute('data-username') || '';
      titleEl.innerHTML =
        '<span class="tilde">~</span> ' +
        escapeHtml(username) +
        '<span class="tilde">\'s ' +
        dict['user.projects.title'] +
        '</span> <span class="tilde">~</span>';
    }

    var subEl = document.getElementById('user-projects-sub');
    if (subEl && dict['user.projects.sub']) {
      subEl.textContent = dict['user.projects.sub'];
    }

    document.querySelectorAll('[data-action-source]').forEach(function (el) {
      el.textContent = dict['user.project.source'] || 'Source';
    });

    document.querySelectorAll('[data-action-visit]').forEach(function (el) {
      el.textContent = dict['user.project.visit'] || 'Visit';
    });

    document.querySelectorAll('[data-action-download]').forEach(function (el) {
      el.textContent = dict['user.project.download'] || 'Download';
    });

    document.querySelectorAll('[data-status-key]').forEach(function (el) {
      var key = el.getAttribute('data-status-key');
      var label = dict['user.status.' + key] || key;
      el.textContent = label;
    });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function getInitials(name) {
    var parts = (name || '?').trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  function libravatarUrl(hash, size) {
    var s = size || 80;
    return (
      'https://seccdn.libravatar.org/avatar/' + hash + '?s=' + s + '&d=404'
    );
  }

  function isSourceUrl(url) {
    return (
      url &&
      (url.indexOf('github.com') !== -1 || url.indexOf('codeberg.org') !== -1)
    );
  }

  function renderUser(data) {
    var container = document.getElementById('user-content');
    if (!container) return;

    var html = '';

    // ── Profile header ──
    html += '<section class="user-header">';
    html += '<div class="container">';
    var avatarSrc = data.avatar;
    if (!avatarSrc && data.avatarHash) {
      avatarSrc = libravatarUrl(data.avatarHash, 80);
    }
    var initials = getInitials(data.displayName || data.username);
    if (avatarSrc) {
      html +=
        '<img src="' +
        escapeHtml(avatarSrc) +
        '" alt="' +
        escapeHtml(data.displayName || data.username) +
        '" class="user-avatar" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'" />' +
        '<div class="user-avatar-placeholder" style="display:none">' +
        escapeHtml(initials) +
        '</div>';
    } else {
      var initials = getInitials(data.displayName || data.username);
      html +=
        '<div class="user-avatar-placeholder">' +
        escapeHtml(initials) +
        '</div>';
    }
    html +=
      '<h1 class="user-name">' +
      escapeHtml(data.displayName || data.username) +
      '</h1>';
    if (data.tagline) {
      html += '<p class="user-tagline">' + escapeHtml(data.tagline) + '</p>';
    }
    if (data.links) {
      html += '<div class="user-links">';
      if (data.links.github) {
        html +=
          '<a href="' +
          escapeHtml(data.links.github) +
          '" class="btn btn-outline" target="_blank" rel="noopener">' +
          (typeof Icons !== 'undefined' ? Icons.githubSvg() : '') +
          '<span>GitHub</span></a>';
      }
      if (data.links.codeberg) {
        html +=
          '<a href="' +
          escapeHtml(data.links.codeberg) +
          '" class="btn btn-outline" target="_blank" rel="noopener">' +
          (typeof Icons !== 'undefined' ? Icons.codebergSvg() : '') +
          '<span>Codeberg</span></a>';
      }
      if (data.links.website) {
        html +=
          '<a href="' +
          escapeHtml(data.links.website) +
          '" class="btn btn-outline" target="_blank" rel="noopener">Website</a>';
      }
      html += '</div>';
    }
    html += '</div></section>';

    // ── Projects section ──
    var projects = data.projects || [];
    html +=
      '<section class="user-projects' +
      (projects.length ? '' : ' section-alt') +
      '">';
    html += '<div class="container">';
    html +=
      '<h2 class="user-projects-title" id="user-projects-title" data-username="' +
      escapeHtml(data.username || '') +
      '"></h2>';
    html += '<p class="user-projects-sub" id="user-projects-sub"></p>';

    if (projects.length === 0) {
      html +=
        '<p style="text-align:center;color:var(--text-muted);padding:2rem 0;">No projects yet.</p>';
    } else {
      html += '<div class="project-grid">';
      for (var i = 0; i < projects.length; i++) {
        var p = projects[i];
        html += '<div class="project-card">';

        // Icon
        html +=
          '<div class="project-icon">' + escapeHtml(p.icon || '◆') + '</div>';

        // Header (name + status)
        html += '<div class="project-header">';
        html += '<div class="project-name">' + escapeHtml(p.name);
        if (p.version) {
          html +=
            '<span class="badge-version">' + escapeHtml(p.version) + '</span>';
        }
        html += '</div>';
        if (p.status) {
          html +=
            '<span class="project-status status-' +
            escapeHtml(p.status) +
            '" data-status-key="' +
            escapeHtml(p.status) +
            '">' +
            escapeHtml(p.status) +
            '</span>';
        }
        html += '</div>';

        // Tagline
        if (p.tagline) {
          html +=
            '<p class="project-tagline">' + escapeHtml(p.tagline) + '</p>';
        }

        // Description
        if (p.description) {
          html +=
            '<p class="project-description">' +
            escapeHtml(p.description) +
            '</p>';
        }

        // Tags
        if (p.tags && p.tags.length) {
          html += '<div class="project-tags">';
          for (var t = 0; t < p.tags.length; t++) {
            html +=
              '<span class="project-tag">#' + escapeHtml(p.tags[t]) + '</span>';
          }
          html += '</div>';
        }

        // Action buttons
        if (p.url || p.download) {
          html += '<div class="project-actions">';
          if (p.download) {
            html +=
              '<a href="' +
              escapeHtml(p.download) +
              '" class="btn btn-small btn-primary" target="_blank" rel="noopener" ' +
              'data-action-download></a>';
          }
          if (p.url) {
            var isSource = isSourceUrl(p.url);
            html +=
              '<a href="' +
              escapeHtml(p.url) +
              '" class="btn btn-small" target="_blank" rel="noopener" ' +
              (isSource ? 'data-action-source' : 'data-action-visit') +
              '></a>';
          }
          html += '</div>';
        }

        html += '</div>';
      }
      html += '</div>';
    }

    html += '</div></section>';

    container.innerHTML = html;

    // Apply i18n labels now that DOM is built
    var lang = getLang();
    updateProjectLabels(I18N[lang] || I18N[DEFAULT_LANG]);
  }

  function renderNotFound(username) {
    var container = document.getElementById('user-content');
    if (!container) return;
    container.innerHTML =
      '<section class="user-notfound"><div class="container">' +
      '<h2>404</h2>' +
      '<p>User <strong>' +
      escapeHtml(username || 'unknown') +
      "</strong> doesn't have a page here yet.</p>" +
      '<a href="/" class="btn btn-primary">Back to chest.so</a>' +
      '</div></section>';
  }

  // ── Language Switcher ──
  var langBtn = document.getElementById('lang-btn');
  var langMenu = document.getElementById('lang-menu');

  if (langBtn && langMenu) {
    langBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var isOpen = langMenu.classList.toggle('lang-menu-open');
      langBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    langMenu.addEventListener('click', function (e) {
      var item = e.target.closest('[data-lang]');
      if (item) {
        setLang(item.getAttribute('data-lang'));
        langMenu.classList.remove('lang-menu-open');
        langBtn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('click', function () {
      langMenu.classList.remove('lang-menu-open');
      langBtn.setAttribute('aria-expanded', 'false');
    });
  }

  function renderNavIcons(userInfo) {
    var navIcons = document.getElementById('nav-icons');
    if (!navIcons || typeof Icons === 'undefined' || !userInfo.links) return;
    var html = '';
    if (userInfo.links.github) html += Icons.github(userInfo.links.github);
    if (userInfo.links.codeberg)
      html += Icons.codeberg(userInfo.links.codeberg);
    navIcons.innerHTML = html;
  }

  // ── Load user data ──
  var meta = document.querySelector('meta[name="user"]');
  var username = meta ? meta.getAttribute('content') : null;

  if (username) {
    Promise.all([
      fetch('../users.json').then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      }),
      fetch('projects.json').then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      }),
    ])
      .then(function (results) {
        var users = results[0];
        var projectsData = results[1];
        var userInfo = null;
        for (var i = 0; i < users.length; i++) {
          if (users[i].username === username) {
            userInfo = users[i];
            break;
          }
        }
        if (!userInfo) throw new Error('User not found in users.json');
        userInfo.projects = projectsData.projects || [];
        renderUser(userInfo);
        renderNavIcons(userInfo);
      })
      .catch(function () {
        renderNotFound(username);
      });
  } else {
    renderNotFound(null);
  }

  // Apply initial language
  applyLang(getLang());
})();
