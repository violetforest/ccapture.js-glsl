(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var glsl = require('glslify')

var uniforms = {
  time: { value: 0.0 }, //give Shader access to time
  resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
}

var vertexShader = glsl(["#define GLSLIFY 1\n#define GLSLIFY 1\nvarying vec2 vUv;\nvoid main()\t{\n  vUv = uv;\n  gl_Position = vec4( position, 1.0 );\n}\n"])
var fragmentShader = glsl(["#define GLSLIFY 1\n#define GLSLIFY 1\nvarying vec2 vUv;\nuniform float time;\nuniform vec2 resolution;\n\nvoid main() {\n    vec2 pos = gl_FragCoord.xy/resolution;\n    float r = sin(pos.y * time);\n    float g = 0.572 * cos(pos.x * time);\n    float b = 0.164 + sin(pos.x * 3.252) + sin(pos.y + 5.348) * r;\n    g = fract(500.0 - sin(b));\n\tgl_FragColor = vec4(r, g, b, 3.976);\n}\n"])
var capturer;
var container;
var camera, scene, renderer, controls;

if(!Detector.webgl){
  Detector.addGetWebGLMessage();
} else {
  window.addEventListener( 'load', init, false );
}

var title = document.getElementById( 'title' );

function init() {

container = document.getElementById( 'container' );

camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
scene = new THREE.Scene();

var geometry = new THREE.PlaneBufferGeometry( 2, 2 );

var material = new THREE.ShaderMaterial( {
  uniforms: uniforms,
  vertexShader,
  fragmentShader
});

var mesh = new THREE.Mesh( geometry, material );

scene.add( mesh );

renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true });
renderer.sortObjects = false;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0,0);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap

container.appendChild( renderer.domElement );

controls = new THREE.OrbitControls( camera, renderer.domElement );

window.addEventListener( 'resize', onWindowResize, false );

onWindowResize();

lastTime = Date.now();

capturer = null;

var sCB = document.getElementById( 'start-capturing-button' ),
  dVB = document.getElementById( 'download-video-button' ),
  progress = document.getElementById( 'progress' );

sCB.addEventListener( 'click', function( e ) {

var framerate = document.querySelector('input[name="framerate"]:checked').value;

capturer = new CCapture( {
  verbose: false,
  display: true,
  framerate: framerate,
  motionBlurFrames: ( 960 / framerate ) * ( document.querySelector('input[name="motion-blur"]').checked ? 1 : 0 ),
  quality: 99,
  format: document.querySelector('input[name="encoder"]:checked').value,
  workersPath: '../../src/',
  frameLimit: 0,
  autoSaveTime: 0,
  onProgress: function( p ) { progress.style.width = ( p * 100 ) + '%' }
} );

  capturer.start();
  this.style.display = 'none';
  dVB.style.display = 'block';
  e.preventDefault();
}, false );

dVB.addEventListener( 'click', function( e ) {
  capturer.stop();
  this.style.display = 'none';
  //this.setAttribute( 'href',  );
  capturer.save();
}, false );

  animate();
}

function onWindowResize( event ) {
  if( renderer ) {
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
}

function animate(timestamp) {
  requestAnimationFrame( animate );
  uniforms.time.value = timestamp / 1000;
  render();
}

function render() {
  controls.update();

  var currentTime = Date.now();
  currentTime = performance.now();;
  ellapsedTime = currentTime - lastTime;

  renderer.render( scene, camera );
  if( capturer ) capturer.capture( renderer.domElement );

  lastTime = currentTime;
}

},{"glslify":2}],2:[function(require,module,exports){
module.exports = function(strings) {
  if (typeof strings === 'string') strings = [strings]
  var exprs = [].slice.call(arguments,1)
  var parts = []
  for (var i = 0; i < strings.length-1; i++) {
    parts.push(strings[i], exprs[i] || '')
  }
  parts.push(strings[i])
  return parts.join('')
}

},{}]},{},[1]);
