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
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M6.766 11.328c-2.063-.25-3.516-1.734-3.516-3.656 0-.781.281-1.625.75-2.188-.203-.515-.172-1.609.063-2.062.625-.078 1.468.25 1.968.703.594-.187 1.219-.281 1.985-.281.765 0 1.39.094 1.953.265.484-.437 1.344-.765 1.969-.687.218.422.25 1.515.046 2.047.5.593.766 1.39.766 2.203 0 1.922-1.453 3.375-3.547 3.64.531.344.89 1.094.89 1.954v1.625c0 .468.391.734.86.547C13.781 14.359 16 11.53 16 8.03 16 3.61 12.406 0 7.984 0 3.563 0 0 3.61 0 8.031a7.88 7.88 0 0 0 5.172 7.422c.422.156.828-.125.828-.547v-1.25c-.219.094-.5.156-.75.156-1.031 0-1.64-.562-2.078-1.609-.172-.422-.36-.672-.719-.719-.187-.015-.25-.093-.25-.187 0-.188.313-.328.625-.328.453 0 .844.281 1.25.86.313.452.64.655 1.031.655s.641-.14 1-.5c.266-.265.47-.5.657-.656"/></svg>';

  var CODEBERG_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 4.2333332 4.2333335" aria-hidden="true">' +
    '<defs><linearGradient id="cb-grad" x1="42519.285" y1="-7078.7891" x2="42575.336" y2="-6966.9307" gradientUnits="userSpaceOnUse">' +
    '<stop style="stop-color:#2185d0;stop-opacity:0" offset="0"/>' +
    '<stop style="stop-color:#2185d0;stop-opacity:0.48923996" offset="0.49517274"/>' +
    '<stop style="stop-color:#2185d0;stop-opacity:0.63279623" offset="1"/>' +
    '</linearGradient></defs>' +
    '<g transform="matrix(0.06551432,0,0,0.06551432,-2.232417,-1.431776)">' +
    '<path style="font-variation-settings:normal;vector-effect:none;fill:url(#cb-grad);fill-opacity:1;stroke:none;stroke-width:3.67846;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:2;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;paint-order:stroke markers fill;stop-color:#000000;stop-opacity:1" d="m 42519.285,-7078.7891 a 0.76086879,0.56791688 0 0 0 -0.738,0.6739 l 33.586,125.8886 a 87.182358,87.182358 0 0 0 39.381,-33.7636 l -71.565,-92.5196 a 0.76086879,0.56791688 0 0 0 -0.664,-0.2793 z" transform="matrix(0.37058478,0,0,0.37058478,-15690.065,2662.0533)"/>' +
    '<path style="opacity:1;fill:#2185d0;fill-opacity:1;stroke:none;stroke-width:17.0055;paint-order:markers fill stroke;stop-color:#000000" d="m 11249.461,-1883.6961 c -12.74,0 -23.067,10.3275 -23.067,23.0671 0,4.3335 1.22,8.5795 3.522,12.2514 l 19.232,-24.8636 c 0.138,-0.1796 0.486,-0.1796 0.624,0 l 19.233,24.8646 c 2.302,-3.6721 3.523,-7.9185 3.523,-12.2524 0,-12.7396 -10.327,-23.0671 -23.067,-23.0671 z" transform="matrix(1.4006354,0,0,1.4006354,-15690.065,2662.0533)"/>' +
    '</g></svg>';

  function link(href, svg, label, extraClass) {
    var cls = extraClass ? ' ' + extraClass : '';
    return (
      '<a href="' +
      href +
      '" target="_blank" rel="noopener" class="nav-link' +
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
