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
  @property({ attribute: false }) color = new THREE.Color(
    1,
    this.camera.position.z,
    0
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
    this.camera.position.z = 13;

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
    shape.moveTo(-b / 2, 0 - h / 2);
    shape.lineTo(b / 2, 0 - h / 2);
    shape.lineTo(b / 2, tf - h / 2);
    shape.lineTo(tw / 2, tf - h / 2);
    shape.lineTo(tw / 2, h - tf - h / 2);
    shape.lineTo(b / 2, h - tf - h / 2);
    shape.lineTo(b / 2, h - h / 2);
    shape.lineTo(-b / 2, h - h / 2);
    shape.lineTo(-b / 2, h - tf - h / 2);
    shape.lineTo(-tw / 2, h - tf - h / 2);
    shape.lineTo(-tw / 2, tf - h / 2);
    shape.lineTo(-b / 2, tf - h / 2);
    shape.lineTo(-b / 2, 0 - h / 2);
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-3, 0, 0),
      new THREE.Vector3(0, -3 * Math.tan((this.angle * Math.PI) / 360), 0),
      new THREE.Vector3(3, 0, 0)
    );
    const uvtest = THREE.ExtrudeGeometry.WorldUVGenerator;

    const extrudeSettings = {
      steps: 20,
      bevelEnabled: false,
      extrudePath: curve,
      UVGenerator: uvtest,
    };

    const phongmat = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      polygonOffset: true,
      polygonOffsetFactor: 1, // positive value pushes polygon further away
      polygonOffsetUnits: 1,
    });
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.MeshBasicMaterial({
      color: 'red',
    });

    /*     for (let i = 0; i < geometry.faces.length; i++) {
      const face = geometry.faces[i];
      face.color.setRGB(i / 1024, 0, 0);
    } */
    const maxvec = new THREE.Vector3(0, this.angle / 70, 1);
    const minvec = new THREE.Vector3(0, -this.angle / 70, -1);

    for (let i = 0; i < geometry.faces.length; i++) {
      const face = geometry.faces[i];
      face.color.setRGB(
        geometry.vertices[face.a].x,
        geometry.vertices[face.b].y,
        geometry.vertices[face.c].z
      );
    }
    const material2 = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 'black',
    });
    const material3 = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      vertexColors: true,
    });
    const edges = new THREE.EdgesGeometry(geometry);
    const linmaterial = new THREE.LineBasicMaterial({
      color: 0x000000,
      linewidth: 4,
    });

    const wireframe = new THREE.LineSegments(edges, linmaterial);
    geometry.computeBoundingBox();

    const trymaterial = new THREE.ShaderMaterial({
      uniforms: {
        color1: {
          value: new THREE.Color('red'),
        },
        color2: {
          value: new THREE.Color('purple'),
        },
        bboxMin: {
          value: minvec,
        },
        bboxMax: {
          value: maxvec,
        },
      },
      vertexShader: `
    uniform vec3 bboxMin;
    uniform vec3 bboxMax;
  
    varying vec2 vUv;

    void main() {
      vUv.y = (position.y - bboxMin.y) / (bboxMax.y - bboxMin.y);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
      fragmentShader: `
    uniform vec3 color1;
    uniform vec3 color2;
  
    varying vec2 vUv;
    
    void main() {
      
      gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
    }
  `,
    });
    const mesh = new THREE.Mesh(geometry, trymaterial);
    this.scene.add(mesh);
    const color = 0xffffff;
    const intensity = 1;
    const amintensity = 0.2;

    const light = new THREE.DirectionalLight(color, intensity);
    const amlight = new THREE.AmbientLight(color, amintensity);

    light.position.set(10, 10, 0);
    light.target.position.set(-5, 0, 0);
    this.scene.add(light, amlight);
    this.scene.add(light.target);
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
