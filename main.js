;
(
    function() {
        window.onload = () => initialize()
        
        let gl; // webglのContext
        let prog; // コンパイル・リンクされたプログラム
        
        const initialize = () => {
            // WebGLのコンテキストを取得
            const canvas = document.getElementById("canvas");
            gl = canvas.getContext('webgl');

            // VSのコンパイル
            const vs = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vs, document.getElementById("vs").text);
            gl.compileShader(vs);

            // FSのコンパイル
            const fs = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fs, document.getElementById('fs').text);
            gl.compileShader(fs);

            // Shaderのリンク
            prog = gl.createProgram();
            gl.attachShader(prog, vs);
            gl.attachShader(prog, fs);
            gl.linkProgram(prog);
        }
    }    
)();
