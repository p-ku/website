import { LitElement, html, css, property } from 'lit-element';
import * as THREE from 'three';
import { SVGRenderer } from 'three/examples/jsm/renderers/SVGRenderer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { normalize } from 'path';
import { WebGLRenderer } from 'three';

class BenderDemo extends LitElement {
  @property({ type: String }) lang = '';
  @property({ type: Boolean }) english = true;
  @property({ attribute: false }) angle = 0;
  @property({ attribute: false }) scene = new THREE.Scene();
  @property({ attribute: false }) camera = new THREE.PerspectiveCamera(
    33,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  @property({ attribute: false }) renderer = new WebGLRenderer({
    antialias: true,
  });

  @property({ attribute: false }) controls = new OrbitControls(
    this.camera,
    (this.renderer.domElement as unknown) as HTMLElement
  );

  constructor() {
    super();
  }
  firstUpdated() {
    window.addEventListener('resize', this.handleResize);
    this.controls.enablePan = false;
    this.controls.enableZoom = false;
    if (location.pathname.includes('jp')) {
      this.english = false;
      this.lang = '/jp';
    } else {
      this.english = true;
      this.lang = '';
    }
    this.init();
    this.camera.position.set(0, 5, 13); // Set position like this
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.animator();
  }

  handleResize = () => {
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(
      Math.min(window.innerWidth / 2, window.innerHeight / 2),
      Math.min(window.innerWidth / 2, window.innerHeight / 2)
    );
  };

  init() {
    this.scene.background = new THREE.Color(0xfffde8);

    /*    this.controls.target.set(0, 0, 0);
    this.controls.update(); */

    this.camera.aspect = 1;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(
      Math.min(window.innerWidth / 2, window.innerHeight / 2),
      Math.min(window.innerWidth / 2, window.innerHeight / 2)
    );

    this.shadowRoot
      .getElementById('main')
      .appendChild(this.renderer.domElement);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    //

    const h = 2,
      b = 1,
      tf = 0.1,
      tw = 0.1;

    const shape = new THREE.Shape();
    shape.moveTo(-b / 2, -h / 2);
    shape.lineTo(b / 2, -h / 2);
    shape.lineTo(b / 2, tf - h / 2);
    shape.lineTo(tw / 2, tf - h / 2);
    /*     shape.lineTo(tw / 2, -0.1);
    shape.lineTo(tw / 2, 0.1); */
    shape.lineTo(tw / 2, h / 2 - tf);
    shape.lineTo(b / 2, h / 2 - tf);
    shape.lineTo(b / 2, h / 2);
    shape.lineTo(-b / 2, h / 2);
    shape.lineTo(-b / 2, h / 2 - tf);
    shape.lineTo(-tw / 2, h / 2 - tf);
    /*     shape.lineTo(-tw / 2, 0.1);
    shape.lineTo(-tw / 2, -0.1); */

    shape.lineTo(-tw / 2, tf - h / 2);
    shape.lineTo(-b / 2, tf - h / 2);
    shape.lineTo(-b / 2, -h / 2);
    const midcurve = new THREE.Vector3(
      0,
      -3 * Math.tan((this.angle * Math.PI) / 360),
      0
    );
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-3, 0, 0),
      midcurve,
      new THREE.Vector3(3, 0, 0)
    );
    const uvtest = THREE.ExtrudeGeometry.WorldUVGenerator;

    const extrudeSettings = {
      steps: 20,
      bevelEnabled: false,
      extrudePath: curve,
      UVGenerator: uvtest,
    };

    /*     const phongmat = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      polygonOffset: true,
      polygonOffsetFactor: 1, // positive value pushes polygon further away
      polygonOffsetUnits: 1,
    }); */
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    for (let i = 0; i < geometry.faces.length; i++) {
      const face = geometry.faces[i];
      if (this.angle > 0) {
        /*         for (let j = 0; j < 3; j++) { */
        if (
          geometry.vertices[face.a].y >
          curve.getPoint((geometry.vertices[face.a].x + 3) / 6).y
        ) {
          face.vertexColors[0] = new THREE.Color(
            this.angle / 240 + 0.1,
            0.1,
            this.angle / 240 + 0.1
          );
        } else {
          face.vertexColors[0] = new THREE.Color(
            0.1,
            this.angle / 240 + 0.1,
            this.angle / 240 + 0.1
          );
        }
        if (
          geometry.vertices[face.b].y >
          curve.getPoint((geometry.vertices[face.b].x + 3) / 6).y
        ) {
          face.vertexColors[1] = new THREE.Color(
            this.angle / 240 + 0.1,
            0.1,
            this.angle / 240 + 0.1
          );
        } else {
          face.vertexColors[1] = new THREE.Color(
            0.1,
            this.angle / 240 + 0.1,
            this.angle / 240 + 0.1
          );
        }
        if (
          geometry.vertices[face.c].y >
          curve.getPoint((geometry.vertices[face.c].x + 3) / 6).y
        ) {
          face.vertexColors[2] = new THREE.Color(
            this.angle / 240 + 0.1,
            0.1,
            this.angle / 240 + 0.1
          );
        } else {
          face.vertexColors[2] = new THREE.Color(
            0.1,
            this.angle / 240 + 0.1,
            this.angle / 240 + 0.1
          );
        }
      } else {
        if (
          geometry.vertices[face.a].y >
          curve.getPoint((geometry.vertices[face.a].x + 3) / 6).y
        ) {
          face.vertexColors[0] = new THREE.Color(
            0.1,
            -this.angle / 240 + 0.1,
            -this.angle / 240 + 0.1
          );
        } else {
          face.vertexColors[0] = new THREE.Color(
            -this.angle / 240 + 0.1,
            0.1,
            -this.angle / 240 + 0.1
          );
        }
        if (
          geometry.vertices[face.b].y >
          curve.getPoint((geometry.vertices[face.b].x + 3) / 6).y
        ) {
          face.vertexColors[1] = new THREE.Color(
            0.1,
            -this.angle / 240 + 0.1,
            -this.angle / 240 + 0.1
          );
        } else {
          face.vertexColors[1] = new THREE.Color(
            -this.angle / 240 + 0.1,
            0.1,
            -this.angle / 240 + 0.1
          );
        }
        if (
          geometry.vertices[face.c].y >
          curve.getPoint((geometry.vertices[face.c].x + 3) / 6).y
        ) {
          face.vertexColors[2] = new THREE.Color(
            0.1,
            -this.angle / 240 + 0.1,
            -this.angle / 240 + 0.1
          );
        } else {
          face.vertexColors[2] = new THREE.Color(
            -this.angle / 240 + 0.1,
            0.1,
            -this.angle / 240 + 0.1
          );
        }
      }
    }

    const material1 = new THREE.MeshPhongMaterial({
      vertexColors: true,
      polygonOffset: true,
      polygonOffsetFactor: -0.6, // positive value pushes polygon further away
      polygonOffsetUnits: 1,
    });

    const mesh = new THREE.Mesh(geometry, material1);
    this.scene.add(mesh);
    const color = 0xfffde8;
    const intensity = 0.5;
    const amintensity = 0.5;

    const light = new THREE.DirectionalLight(color, intensity);
    const light2 = new THREE.DirectionalLight(color, intensity);
    const amlight = new THREE.AmbientLight(color, amintensity);
    const hemlight = new THREE.HemisphereLight(0xffffff, color, intensity);

    light.position.set(0, 0, 5);
    light.target.position.set(0, 0, 0);
    light2.position.set(0, 0, -5);
    light2.target.position.set(0, 0, 0);

    this.scene.add(light, light2, amlight, hemlight);
    this.scene.add(light.target);
    this.scene.add(light2.target);

    const edges = new THREE.EdgesGeometry(geometry);
    const mesh2 = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    this.scene.add(mesh2);
  }

  animator() {
    /*     let count = 0;
    const time = performance.now() / 1000;

     this.scene.traverse(function (child) {
      child.rotation.x = count + time / 3;
      child.rotation.z = count + time / 4;

      count++;
    }); */
    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(() => {
      this.animator();
    });
    /*     this.controls.update();
     */
  }

  onChange() {
    for (let i = this.scene.children.length - 1; i >= 0; i--) {
      const obj = this.scene.children[i];
      this.scene.remove(obj);
    }
    this.angle = Number((this.sliderValue as HTMLInputElement).value);
    this.init();
    this.animator();
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      max-width: 100%;
      max-height: 100%;
      color: #321e00;
      margin: 0 auto;
    }

    .column {
      width: 50vw;
      height: calc(100vh - var(--navbar-height) - var(--demobar-height));
    }

    h2 {
      line-height: 1em;
      text-align: left;
      margin-left: 1rem;
    }
    #main {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      max-width: 100%;
      max-height: 100%;
      color: #321e00;
      margin: 0 auto;
    }
    svg {
      display: flex;
    }
    .slider {
      -webkit-appearance: none;
      width: 100%;
      height: 15px;
      border-radius: 5px;
      background: #ffc342;
      outline: none;
      -webkit-transition: 0.2s;
      transition: opacity 0.2s;
      margin-bottom: 15px;
    }

    .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background: #321e00;
      cursor: pointer;
    }

    .slider::-moz-range-thumb {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background: #321e00;
      cursor: pointer;
    }
  `;

  get sliderValue() {
    return this.shadowRoot?.getElementById('myRange');
  }

  render() {
    return html`
      <div id="main">
        <h2>${this.english ? 'bender' : 'ベンダー'}</h2>

        <input
          type="range"
          min="-60"
          max="60"
          value="0"
          class="slider"
          id="myRange"
          @input=${this.onChange}
        />
      </div>
    `;
  }
}
customElements.define('bender-demo', BenderDemo);
