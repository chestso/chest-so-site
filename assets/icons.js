/*
 * Official brand icons for GitHub and Codeberg.
 * Sources:
 *   GitHub:  https://primer.style/foundations/icons (mark-github-16)
 *   Codeberg: https://codeberg.org/Codeberg/Design (icon, CC0)
 *
 * Usage: include this file before main.js / users.js, then call
 *   Icons.github(href)  -> returns HTML string with <a><svg> GitHub </a>
 *   Icons.codeberg(href) -> returns HTML string with <a><svg> Codeberg </a>
 *   Icons.githubSvg()   -> returns bare <svg> string
 *   Icons.codebergSvg() -> returns bare <svg> string
 */
var Icons = (function () {
  'use strict';

  var GITHUB_SVG =
    '<svg viewBox="0 0 16 16" width="32" height="32" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>';

  var CODEBERG_SVG =
    '<svg viewBox="0 0 4.2333332 4.2333335" width="32" height="32" aria-hidden="true">' +
    '<defs><linearGradient id="cb-grad" x1="42519.285" y1="-7078.7891" x2="42575.336" y2="-6966.9307" gradientUnits="userSpaceOnUse">' +
    '<stop style="stop-color:#2185d0;stop-opacity:0" offset="0"/>' +
    '<stop style="stop-color:#2185d0;stop-opacity:.3" offset=".495"/>' +
    '<stop style="stop-color:#2185d0;stop-opacity:.3" offset="1"/>' +
    '</linearGradient></defs>' +
    '<g transform="matrix(.06551 0 0 .06551 -2.232 -1.432)">' +
    '<path style="fill:url(#cb-grad)" d="m 42519.285,-7078.7891 a .761 .568 0 0 0 -.738 .674 l 33.586 125.889 a 87.182 87.182 0 0 0 39.381 -33.764 l -71.565 -92.52 a .761 .568 0 0 0 -.664 -.279 z" transform="matrix(.37058 0 0 .37058 -15690.065 2662.053)"/>' +
    '<path style="fill:#2185d0" d="m 11249.461 -1883.696 c -12.74 0 -23.067 10.327 -23.067 23.067 0 4.334 1.22 8.58 3.522 12.252 l 19.232 -24.864 c .138 -.18 .486 -.18 .624 0 l 19.233 24.865 c 2.302 -3.672 3.523 -7.919 3.523 -12.253 0 -12.74 -10.327 -23.067 -23.067 -23.067 z" transform="matrix(1.40064 0 0 1.40064 -15690.065 2662.053)"/>' +
    '</g></svg>';

  function link(href, svg, label, extraClass) {
    var cls = extraClass ? ' ' + extraClass : '';
    return (
      '<a href="' +
      href +
      '" target="_blank" rel="noopener" class="nav-icon-link' +
      cls +
      '">' +
      svg +
      '<span>' +
      label +
      '</span></a>'
    );
  }

  return {
    githubSvg: function () {
      return GITHUB_SVG;
    },
    codebergSvg: function () {
      return CODEBERG_SVG;
    },
    github: function (href) {
      return link(href, GITHUB_SVG, 'GitHub');
    },
    codeberg: function (href) {
      return link(href, CODEBERG_SVG, 'Codeberg');
    },
  };
})();
