    //precision mediump float;

    uniform vec3 uColor;

    uniform sampler2D uTexture;

    varying vec2 vUv;
    varying float vElevation;

    //varying float vRandom;
    //highp can have performance hit and might not work of some devices
    //lowp can create bugs be the lack of precision

        void main(){
            //  vec4(r,g,b, alpha(transparencies))
           // gl_FragColor = vec4(0.5, vRandom, 1.0, 1.0);

            vec4 textureColor = texture2D(uTexture, vUv);
            textureColor.rgb *= vElevation * 2.0 + .5;
           // gl_FragColor = vec4(uColor, 1.0)
           gl_FragColor = textureColor;

        }