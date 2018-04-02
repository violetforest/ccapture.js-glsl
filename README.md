Read the CCapture.js readme [here](https://github.com/spite/ccapture.js/)

# CCapture.js-Glsl

This combines the basic example from [CCapture.js](https://github.com/spite/ccapture.js/) and the [shader example](threejs.org/examples/?q=shader#webgl_shader) from Three.js to create a sandbox for recording your shaders. It uses Glslify to neatly separate the GLSL files from the three.js scene, and uses Browserify for the require.

#### Using the code ####

Download the packages (browserify, glslify)
```bash
npm i
```
Keep your shaders under the shaders folder & update the uniforms & folder name in shader-scene.js. Compile your changes with:

```bash
browserify -t glslify path/to/shader-scene.js -o build/bundle.js
```
