/*
 * Shared utilities for chest.so — language switching, i18n application,
 * nav icons, and common helper functions used by both main.js and users.js.
 *
 * Must be loaded after i18n.js and assets/icons.js, but before main.js/users.js.
 */
var Common = (function () {
  'use strict';

  var SUPPORTED = ['en', 'zh', 'fa', 'ar', 'th', 'ru'];
  var DEFAULT_LANG = 'en';

  // Optional hook: pages can set Common.onApplyLang to run after applyLang
  var onApplyLang = null;

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

    if (onApplyLang) onApplyLang(dict);
  }

  function initLangSwitcher() {
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
  }

  function renderNavIcons() {
    var navIcons = document.getElementById('nav-icons');
    if (!navIcons || typeof Icons === 'undefined') return;
    navIcons.innerHTML =
      Icons.github('https://github.com/chestso') +
      Icons.codeberg('https://codeberg.org/chestso');
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str || '';
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

  return {
    SUPPORTED: SUPPORTED,
    DEFAULT_LANG: DEFAULT_LANG,
    getLang: getLang,
    setLang: setLang,
    applyLang: applyLang,
    initLangSwitcher: initLangSwitcher,
    renderNavIcons: renderNavIcons,
    escapeHtml: escapeHtml,
    getInitials: getInitials,
    libravatarUrl: libravatarUrl,
    set onApplyLang(fn) {
      onApplyLang = fn;
    },
  };
})();
