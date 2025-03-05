import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import testVertexShader from './shaders/test/vertex.glsl';
import testFragmentShader from './shaders/test/fragment.glsl';

/**
 * Questions
 * 1. What is a shader?
 * A Shader is one of the main components of WebGL. It is a program written in GLSL & is sent
 * to the GPU: - Position each vertex of  a geometry (on the renderer)- & - colorize each visile pixel of that geometry
 * 'Pixel' is not accurate,  because each point in the render does not necessarily match each pixel of the screen
 * We send a lot of data to the Shader (- vertices coordinates, - mesh transformation, information about camera
 * - colors, - textures, - lights, -fog). This information(shader instruction)is processed by the GPU
 * There are two types of Shaders: 
 * A) VERTEX SHADER (Position each vertex of the geometry): - Creation vertex shader; - Sending the shaver to the GPU (vertices coordinates, 
 * mesh transformations,  camera informations,etc); - the GPU follows the instructions and positions the vertices on the render
 * Once the vertices are placed by the vertex shader, the GPU knows what  pixels of the geometry are visible and can proceed to the 
 *  fragment shader. 
 * B) FRAGMENT SHADER. Color each visible pixel of the geometry. It will be used for every visible fragment of the geometry:
 *  -Creation fragment shader, - Sending the fragment shader to the GPU with data, - The GPU follows the instructios and color the fragments
 * 2. Create our own simple shader
 * We can use ShaderMaterial or a RawShaderMaterial
 * - ShaderMaterial will have some code automatically added to the shader codes
 * - RawShaderMaterial will have nothing
 * 3. Learn the sintax
 * The shader language is called GLSL(OpenGL Shading Language)- Close to the C Language
 * - no console.log
 * - semicolor is required to end any instruction
 * - glsl is a typed language
 * 4. Exercises
 
 */
/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const flagTexture = textureLoader.load('/textures/spanish-flag.jpg');

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
console.log(geometry);
// position => we can add out own attributes to the Geometry
// calculate how much we need to add it => const count
const count = geometry.attributes.position.count;
const randoms = new Float32Array(count);

for(let i = 0; i < count; i++){
    randoms[i] = Math.random();
}
geometry.setAttribute('aRandom',  new THREE.BufferAttribute(randoms, 1))

// Material
// replace de MeshBasicMaterial by RawShaderMaterial()
//onst material = new THREE.MeshBasicMaterial()
const material = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    side: THREE.DoubleSide,
    //transparent: true
    uniforms: {
        uFrecuency: { value: new THREE.Vector2(7,3)},
        uTime: { value: 0.0},
        uColor: { value: new THREE.Color('purple')},
        uTexture: {value: flagTexture}
    }

   // wireframe: true
});

gui.add(material.uniforms.uFrecuency.value, 'x')
    .min(0)
    .max(20)
    .step(0.01)
    .name('frecuencyX')

gui.add(material.uniforms.uFrecuency.value, 'y')
    .min(0)
    .max(20)
    .step(0.01)
    .name('frecuencyY')
// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.scale.y = 2/3;
scene.add(mesh);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})




/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0.25, - 0.25, 1);
scene.add(camera);


/**
 * Audio
 */
// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add( listener );

// create a global audio source
const sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load( '/audio/freedom-song.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume(audioControls.volume);
	sound.play();
});

/**
 * GUI para controlar el audio
 */

const songFolder = gui.addFolder('Song'); 

const audioControls = {
    play: () => {
        if (!sound.isPlaying) {
            sound.play();
        }
    },
    pause: () => {
        if (sound.isPlaying) {
            sound.pause();
        }
    },
    volume: 1
};

// Agregar botones y controles a la GUI

songFolder.add(audioControls, 'play').name('▶ Play');
songFolder.add(audioControls, 'pause').name('⏸ Pause');
songFolder.add(audioControls, 'volume', 0, 5, 1)
    .name('🔊 Volumen')
    .onChange(value => sound.setVolume(value));


// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));



/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    // Update material
    if(material.uniforms.uTime) material.uniforms.uTime.value = elapsedTime;

   

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();