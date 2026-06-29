(function () {
    "use strict";

    // ── Typewriter Effect ──
    var phrases = [
        "Open your Chest.",
        "The terminal, reimagined.",
        "C so, therefore Lisp.",
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

    // ── Subtle Gaussian Noise (WebGL) ──
    var noiseContainer = document.getElementById("noise");
    if (noiseContainer && document.createElement("canvas").getContext("webgl")) {
        var canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        noiseContainer.appendChild(canvas);

        var gl = canvas.getContext("webgl");
        if (gl) {
            var vsSource =
                "attribute vec2 a_pos;void main(){gl_Position=vec4(a_pos,0,1);}";
            var fsSource =
                "precision mediump float;uniform float u_time;uniform vec2 u_res;" +
                "float rand(vec2 co){return fract(sin(dot(co,vec2(12.9898,78.233)))*43758.5453);}" +
                "void main(){vec2 uv=gl_FragCoord.xy/u_res;" +
                "float n=rand(uv+fract(u_time*0.01));" +
                "n=clamp(n*0.08+0.5,0.0,1.0);" +
                "gl_FragColor=vec4(n,n,n,1.0);}";

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
                gl.STATIC_DRAW
            );

            var aPos = gl.getAttribLocation(prog, "a_pos");
            gl.enableVertexAttribArray(aPos);
            gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

            var uTime = gl.getUniformLocation(prog, "u_time");
            var uRes = gl.getUniformLocation(prog, "u_res");

            function resize() {
                canvas.width = canvas.clientWidth / 2;
                canvas.height = canvas.clientHeight / 2;
                gl.viewport(0, 0, canvas.width, canvas.height);
            }

            window.addEventListener("resize", resize);
            resize();

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

            render();
        }
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
