var glsl = require('glslify')

var uniforms = {
  time: { value: 0.0 }, //give Shader access to time
  resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
}

var vertexShader = glsl.file('./shaders/colorful/vertex.glsl')
var fragmentShader = glsl.file('./shaders/colorful/fragment.glsl')
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
