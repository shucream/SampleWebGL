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

            // リンクしたプログラムの利用
            gl.useProgram(prog);
            loadBuffer();
            drawFrame();
        }

        // バッファ（GPUメモリ）にデータをロードする
        let vbuf; // 頂点座標バッファ
        let nbuf; // 法線ベクトルバッファ
        const loadBuffer = () => {
            // 頂点データ
            const vertexs = [
                [-0.5, -0.5, 0],
                [0.5, -0.5, 0],
                [0.5, 0.5, 0],
            ]

            // 法線ベクトルデータ
            const normals = [
                [0, 0, 1],
                [0, 0, 1],
                [0, 0, 1],
            ]

            // 頂点座標用バッファを生成してデータを入れる
            vbuf = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexs.flat()), gl.STATIC_DRAW);

            // 法線ベクトル用バッファを生成してデータを入れる
            nbuf = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, nbuf);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals.flat()), gl.STATIC_DRAW);
        };

        // フレームごとの処理
        let frame = 0;
        const drawFrame = () => {
            frame++;
            // frustum行列の生成
            const proj_mat = mat4.create();
            mat4.frustum(proj_mat, -1, 1, -1, 1, 3, 10);
            // 移動回転行列の生成
            const mv_mat = mat4.create();
            mat4.translate(mv_mat, mv_mat, [0, 0, -6]);
            mat4.rotate(mv_mat, mv_mat, frame * 0.01, [0, 1, 0]);



            // uniformでShaderに送信。4fvはfloat4つの配列（vector）という意味
            gl.uniformMatrix4fv(gl.getUniformLocation(prog, "projectionMatrix"), false, proj_mat);
            gl.uniformMatrix4fv(gl.getUniformLocation(prog, "modelviewMatrix"), false, mv_mat);
            // Canvasの内容をクリア（色は RGB(0, 0, 0, 1): 黒）
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.enable(gl.DEPTH_TEST);

            // attributeのindex(position)を取得
            var vpos = gl.getAttribLocation(prog, "vertex");
            var npos = gl.getAttribLocation(prog, "normal");

            // 取得したattribute positionにバッファを送信
            gl.bindBuffer(gl.ARRAY_BUFFER, vbuf); // 頂点座標
            gl.vertexAttribPointer(vpos, 3, gl.FLOAT, false, 0, 0); // float型を1頂点につき3つ、と指定
            gl.enableVertexAttribArray(vpos);

            gl.bindBuffer(gl.ARRAY_BUFFER, nbuf); // 法線ベクトル
            gl.vertexAttribPointer(npos, 3, gl.FLOAT, true, 0, 0); // float型を1頂点につき3つ、と指定
            gl.enableVertexAttribArray(npos);

            // 今まで設定した内容でWebGLに送信
            gl.drawArrays(gl.TRIANGLES, 0, 3);
            setTimeout(drawFrame, 16);
        }
    }
)();
