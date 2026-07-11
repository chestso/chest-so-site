(function () {
  'use strict';

  // ── Page-specific i18n hook: project labels ──
  Common.onApplyLang = function (dict) {
    updateProjectLabels(dict);
  };

  function updateProjectLabels(dict) {
    var titleEl = document.getElementById('user-projects-title');
    if (titleEl && dict['user.projects.title']) {
      var username = titleEl.getAttribute('data-username') || '';
      titleEl.innerHTML =
        '<span class="tilde">~</span> ' +
        Common.escapeHtml(username) +
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
      avatarSrc = Common.libravatarUrl(data.avatarHash, 80);
    }
    var initials = Common.getInitials(data.displayName || data.username);
    if (avatarSrc) {
      html +=
        '<img src="' +
        Common.escapeHtml(avatarSrc) +
        '" alt="' +
        Common.escapeHtml(data.displayName || data.username) +
        '" class="user-avatar" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'" />' +
        '<div class="user-avatar-placeholder" style="display:none">' +
        Common.escapeHtml(initials) +
        '</div>';
    } else {
      html +=
        '<div class="user-avatar-placeholder">' +
        Common.escapeHtml(initials) +
        '</div>';
    }
    html +=
      '<h1 class="user-name">' +
      Common.escapeHtml(data.displayName || data.username) +
      '</h1>';
    if (data.tagline) {
      html +=
        '<p class="user-tagline">' + Common.escapeHtml(data.tagline) + '</p>';
    }
    if (data.links) {
      html += '<div class="user-links">';
      if (data.links.github) {
        html +=
          '<a href="' +
          Common.escapeHtml(data.links.github) +
          '" class="btn btn-outline" target="_blank" rel="noopener">' +
          (typeof Icons !== 'undefined' ? Icons.githubSvg() : '') +
          '<span>GitHub</span></a>';
      }
      if (data.links.codeberg) {
        html +=
          '<a href="' +
          Common.escapeHtml(data.links.codeberg) +
          '" class="btn btn-outline" target="_blank" rel="noopener">' +
          (typeof Icons !== 'undefined' ? Icons.codebergSvg() : '') +
          '<span>Codeberg</span></a>';
      }
      if (data.links.website) {
        html +=
          '<a href="' +
          Common.escapeHtml(data.links.website) +
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
      Common.escapeHtml(data.username || '') +
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
          '<div class="project-icon">' +
          Common.escapeHtml(p.icon || '◆') +
          '</div>';

        // Header (name + status)
        html += '<div class="project-header">';
        html += '<div class="project-name">' + Common.escapeHtml(p.name);
        if (p.version) {
          html +=
            '<span class="badge-version">' +
            Common.escapeHtml(p.version) +
            '</span>';
        }
        html += '</div>';
        if (p.status) {
          html +=
            '<span class="project-status status-' +
            Common.escapeHtml(p.status) +
            '" data-status-key="' +
            Common.escapeHtml(p.status) +
            '">' +
            Common.escapeHtml(p.status) +
            '</span>';
        }
        html += '</div>';

        // Tagline
        if (p.tagline) {
          html +=
            '<p class="project-tagline">' +
            Common.escapeHtml(p.tagline) +
            '</p>';
        }

        // Description
        if (p.description) {
          html +=
            '<p class="project-description">' +
            Common.escapeHtml(p.description) +
            '</p>';
        }

        // Tags
        if (p.tags && p.tags.length) {
          html += '<div class="project-tags">';
          for (var t = 0; t < p.tags.length; t++) {
            html +=
              '<span class="project-tag">#' +
              Common.escapeHtml(p.tags[t]) +
              '</span>';
          }
          html += '</div>';
        }

        // Action buttons
        if (p.url || p.download) {
          html += '<div class="project-actions">';
          if (p.download) {
            html +=
              '<a href="' +
              Common.escapeHtml(p.download) +
              '" class="btn btn-small btn-primary" target="_blank" rel="noopener" ' +
              'data-action-download></a>';
          }
          if (p.url) {
            var isSource = isSourceUrl(p.url);
            html +=
              '<a href="' +
              Common.escapeHtml(p.url) +
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
    var lang = Common.getLang();
    updateProjectLabels(I18N[lang] || I18N[Common.DEFAULT_LANG]);
  }

  function renderNotFound(username) {
    var container = document.getElementById('user-content');
    if (!container) return;
    container.innerHTML =
      '<section class="user-notfound"><div class="container">' +
      '<h2>404</h2>' +
      '<p>User <strong>' +
      Common.escapeHtml(username || 'unknown') +
      "</strong> doesn't have a page here yet.</p>" +
      '<a href="/" class="btn btn-primary">Back to chest.so</a>' +
      '</div></section>';
  }

  // ── Language Switcher & Nav Icons ──
  Common.initLangSwitcher();
  Common.renderNavIcons();

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
      })
      .catch(function () {
        renderNotFound(username);
      });
  } else {
    renderNotFound(null);
  }

  // Apply initial language
  Common.applyLang(Common.getLang());
})();
