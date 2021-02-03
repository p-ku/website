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
  @property({ attribute: false }) scene2 = new THREE.Scene();

  @property({ attribute: false }) camera = new THREE.PerspectiveCamera(
    33,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  @property({ attribute: false }) renderer = new WebGLRenderer({
    antialias: true,
  });
  @property({ attribute: false }) renderer2 = new WebGLRenderer({
    antialias: true,
  });
  @property({ attribute: false }) controls = new OrbitControls(
    this.camera,
    (this.renderer.domElement as unknown) as HTMLElement
  );
  @property({ attribute: false }) controls2 = new OrbitControls(
    this.camera,
    (this.renderer2.domElement as unknown) as HTMLElement
  );

  constructor() {
    super();
  }
  firstUpdated() {
    window.addEventListener('resize', this.handleResize);
    this.controls.enablePan = false;
    this.controls.enableZoom = false;
    this.controls.minAzimuthAngle = -Math.PI / 4;
    this.controls.maxAzimuthAngle = Math.PI / 4;
    this.controls.minPolarAngle = Math.PI / 3;
    this.controls.maxPolarAngle = (2 * Math.PI) / 3;
    this.controls2.enablePan = false;
    this.controls2.enableZoom = false;
    this.controls2.minAzimuthAngle = -Math.PI / 4;
    this.controls2.maxAzimuthAngle = Math.PI / 4;
    this.controls2.minPolarAngle = Math.PI / 3;
    this.controls2.maxPolarAngle = (2 * Math.PI) / 3;
    if (location.pathname.includes('jp')) {
      this.english = false;
      this.lang = '/jp';
    } else {
      this.english = true;
      this.lang = '';
    }
    const geo = new THREE.PlaneGeometry(2, 2, 1);
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('rgb(0, 255, 0)'),
      opacity: 0.1,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(geo, mat);
    const planeEdge = new THREE.EdgesGeometry(geo);
    const planemesh = new THREE.LineSegments(
      planeEdge,
      new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    plane.rotateY(-Math.PI / 2);
    planeEdge.rotateY(-Math.PI / 2);

    this.scene2.add(plane);
    this.scene2.add(planemesh);
    this.init();
    this.camera.position.set(0, 3, 4.5); // Set position like this
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.animator();
  }

  handleResize = () => {
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(
      Math.min(window.innerWidth / 2, window.innerHeight / 2),
      Math.min(window.innerWidth / 3, window.innerHeight / 3)
    );
    this.renderer2.setSize(
      Math.min(window.innerWidth / 2, window.innerHeight / 2),
      Math.min(window.innerWidth / 2, window.innerHeight / 2)
    );
  };

  init() {
    this.scene.background = new THREE.Color(0xfffde8);
    this.scene2.background = new THREE.Color(0xfffde8);

    /*    this.controls.target.set(0, 0, 0);
    this.controls.update(); */

    this.camera.aspect = 3 / 2;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(
      Math.min(window.innerWidth / 2, window.innerHeight / 2),
      Math.min(window.innerWidth / 3, window.innerHeight / 3)
    );
    this.renderer2.setSize(
      Math.min(window.innerWidth / 2, window.innerHeight / 2),
      Math.min(window.innerWidth / 3, window.innerHeight / 3)
    );
    this.shadowRoot
      .getElementById('main')
      .appendChild(this.renderer.domElement);
    this.shadowRoot
      .getElementById('main')
      .appendChild(this.renderer2.domElement);

    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer2.outputEncoding = THREE.sRGBEncoding;

    //

    const h = 1,
      b = 1,
      tf = 0.1,
      tw = 0.1;
    if (this.angle != 0) {
      const graphTopGeo = new THREE.PlaneGeometry(1, this.angle / 60, 1);

      if (this.angle > 0) {
        const mat2 = new THREE.MeshBasicMaterial({
          color: new THREE.Color('rgb(255, 100, 255)'),
          side: THREE.DoubleSide,
        });
        const plane3 = new THREE.Mesh(graphTopGeo, mat2);
        const planeEdge3 = new THREE.EdgesGeometry(graphTopGeo);
        const planeMesh3 = new THREE.LineSegments(
          planeEdge3,
          new THREE.LineBasicMaterial({ color: 0x000000 })
        );
        planeEdge3.rotateY(-Math.PI / 2);
        planeEdge3.rotateZ(-Math.PI / 2);
        planeEdge3.translate(this.angle / 120, h / 2, 0);
        plane3.rotateY(-Math.PI / 2);
        plane3.rotateX(-Math.PI / 2);
        plane3.translateY(this.angle / 120);
        plane3.translateZ(h / 2);

        this.scene2.add(plane3);
        this.scene2.add(planeMesh3);
      } else {
        const mat2 = new THREE.MeshBasicMaterial({
          color: new THREE.Color('rgb(100, 255, 255)'),
          side: THREE.DoubleSide,
        });
        const plane3 = new THREE.Mesh(graphTopGeo, mat2);
        const planeEdge3 = new THREE.EdgesGeometry(graphTopGeo);
        const planeMesh3 = new THREE.LineSegments(
          planeEdge3,
          new THREE.LineBasicMaterial({ color: 0x000000 })
        );
        planeEdge3.rotateY(-Math.PI / 2);
        planeEdge3.rotateZ(-Math.PI / 2);
        planeEdge3.translate(this.angle / 120, h / 2, 0);
        plane3.rotateY(-Math.PI / 2);
        plane3.rotateX(-Math.PI / 2);
        plane3.translateY(this.angle / 120);
        plane3.translateZ(h / 2);

        this.scene2.add(plane3, planeMesh3);
      }
    }

    const shape = new THREE.Shape();
    shape.moveTo(-b / 2, -h / 2);
    shape.lineTo(b / 2, -h / 2);
    shape.lineTo(b / 2, tf - h / 2);
    shape.lineTo(tw / 2, tf - h / 2);
    shape.lineTo(tw / 2, h / 2 - tf);
    shape.lineTo(b / 2, h / 2 - tf);
    shape.lineTo(b / 2, h / 2);
    shape.lineTo(-b / 2, h / 2);
    shape.lineTo(-b / 2, h / 2 - tf);
    shape.lineTo(-tw / 2, h / 2 - tf);
    shape.lineTo(-tw / 2, tf - h / 2);
    shape.lineTo(-b / 2, tf - h / 2);
    shape.lineTo(-b / 2, -h / 2);
    const midcurve = new THREE.Vector3(
      0,
      -1.5 * Math.tan((this.angle * Math.PI) / 360),
      0
    );
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-1.5, 0, 0),
      midcurve,
      new THREE.Vector3(1.5, 0, 0)
    );
    const uvtest = THREE.ExtrudeGeometry.WorldUVGenerator;

    const extrudeSettings = {
      steps: 20,
      bevelEnabled: false,
      extrudePath: curve,
      UVGenerator: uvtest,
    };

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
      polygonOffsetFactor: -1, // positive value pushes polygon further away
      polygonOffsetUnits: 1,
    });

    const mesh = new THREE.Mesh(geometry, material1);
    this.scene.add(mesh);
    const color = 0xfffde8;
    const intensity = 0.5;
    const amintensity = 1;

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
    this.renderer.render(this.scene, this.camera);
    this.renderer2.render(this.scene2, this.camera);

    requestAnimationFrame(() => {
      this.animator();
    });
  }

  onChange() {
    for (let i = this.scene.children.length - 1; i >= 0; i--) {
      const obj = this.scene.children[i];
      this.scene.remove(obj);
    }
    for (let i = this.scene2.children.length; i > 1; i--) {
      const obj2 = this.scene2.children[i];
      this.scene2.remove(obj2);
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
    /* 
    h2 {
      line-height: 1em;
      text-align: left;
      margin-left: 1rem;
    } */
    h1,
    h2,
    p {
      display: flex;
      margin: 0;
      padding: 0;
      line-height: 150%;
      margin-top: 0.3em;
      text-align: left;
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
        <p>${this.english ? 'give it a moment' : 'ベンダー'}</p>

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
      <div id="graph"></div>
    `;
  }
}
customElements.define('bender-demo', BenderDemo);
