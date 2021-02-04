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
  @property({ attribute: false }) section = new THREE.Shape();

  @property({ attribute: false }) tensMat = new THREE.MeshPhongMaterial({
    color: new THREE.Color(0.5, 0.2, 0.5),
    polygonOffset: true,
    polygonOffsetFactor: -1, // positive value pushes polygon further away
    polygonOffsetUnits: 1,
    side: THREE.DoubleSide,
  });
  @property({ attribute: false }) compMat = new THREE.MeshPhongMaterial({
    color: new THREE.Color(0.2, 0.5, 0.5),
    polygonOffset: true,
    polygonOffsetFactor: -1, // positive value pushes polygon further away
    polygonOffsetUnits: 1,
    side: THREE.DoubleSide,
  });
  /* @property({ attribute: false }) compMat = new THREE.MeshBasicMaterial({color: new THREE.Color(0.4,1,1), side: THREE.DoubleSide});
  @property({ attribute: false }) tensMat = new THREE.MeshBasicMaterial({color: new THREE.Color(1,0.4,1), side: THREE.DoubleSide}); */
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
    this.controls.enableDamping = true;
    this.controls.minAzimuthAngle = -Math.PI / 4;
    this.controls.maxAzimuthAngle = Math.PI / 4;
    this.controls.minPolarAngle = Math.PI / 3;
    this.controls.maxPolarAngle = (2 * Math.PI) / 3;
    this.controls2.enablePan = false;
    this.controls2.enableZoom = false;
    this.controls2.enableDamping = true;
    this.controls2.minAzimuthAngle = -Math.PI / 4;
    this.controls2.maxAzimuthAngle = Math.PI / 4;
    this.controls2.minPolarAngle = Math.PI / 3;
    this.controls2.maxPolarAngle = (2 * Math.PI) / 3;
    /*     this.controls.target.set(-0.5,0,0)
    this.controls2.target.set(-0.5,0,0) */
    if (location.pathname.includes('jp')) {
      this.english = false;
      this.lang = '/jp';
    } else {
      this.english = true;
      this.lang = '';
    }
    const geo = new THREE.PlaneGeometry(1.7, 1.7, 1);
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('rgb(0, 255, 0)'),
      opacity: 0.1,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const sectionMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0.2, 0.2, 0.2),
      polygonOffset: true,
      polygonOffsetFactor: -1, // positive value pushes polygon further away
      polygonOffsetUnits: 1,
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

    this.section.moveTo(-0.5, -0.5);
    this.section.lineTo(0.5, -0.5);
    this.section.lineTo(0.5, -0.4);
    this.section.lineTo(0.05, -0.4);
    this.section.lineTo(0.05, 0.4);
    this.section.lineTo(0.5, 0.4);
    this.section.lineTo(0.5, 0.5);
    this.section.lineTo(-0.5, 0.5);
    this.section.lineTo(-0.5, 0.4);
    this.section.lineTo(-0.05, 0.4);
    this.section.lineTo(-0.05, -0.4);
    this.section.lineTo(-0.5, -0.4);
    this.section.lineTo(-0.5, -0.5);
    const sectionGeo = new THREE.ShapeGeometry(this.section);
    const sectionEdge = new THREE.EdgesGeometry(sectionGeo);
    const sectionLine = new THREE.LineSegments(
      sectionEdge,
      new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    sectionLine.rotateY(-Math.PI / 2);
    sectionGeo.rotateY(-Math.PI / 2);
    const sectionMesh = new THREE.Mesh(sectionGeo, sectionMat);

    this.scene2.add(plane, sectionLine, planemesh, sectionMesh);
    this.init();
    this.camera.position.set(2, 2, 3.2); // Set position like this
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.animator();
  }

  handleResize = () => {
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(
      /*       Math.min(window.innerWidth / 1.4, window.innerHeight / 1.4),
      Math.min(window.innerWidth / 2.1, window.innerHeight / 2.1) */
      window.innerHeight / 2.55,
      window.innerHeight / 3.06
    );
    this.renderer2.setSize(
      window.innerHeight / 2.55,
      window.innerHeight / 3.06
    );
  };

  init() {
    this.scene.background = new THREE.Color(0xfffde8);
    this.scene2.background = new THREE.Color(0xfffde8);

    this.camera.aspect = 3 / 2.5;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerHeight / 2.55, window.innerHeight / 3.06);
    this.renderer2.setSize(
      window.innerHeight / 2.55,
      window.innerHeight / 3.06
    );
    this.shadowRoot
      .getElementById('beam')
      .appendChild(this.renderer.domElement);
    this.shadowRoot
      .getElementById('graph')
      .appendChild(this.renderer2.domElement);

    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer2.outputEncoding = THREE.sRGBEncoding;

    /*       if (this.angle != 0) {
const graphTopGeo = new THREE.PlaneGeometry(1,this.angle/60,1);
const graphSideFlangeShape = new THREE.Shape();
graphSideFlangeShape.moveTo(0.5, 0);
graphSideFlangeShape.lineTo(0.5, this.angle/60);
graphSideFlangeShape.lineTo(0.4, (this.angle/60)*(0.4)/(0.5));
graphSideFlangeShape.lineTo(0.5, 0);


const graphSideFlangeGeo = new THREE.ShapeGeometry(graphSideFlangeShape);
const graphSideWebGeo = new THREE.PlaneGeometry(1,this.angle/60,1);
const graphSlopeGeo = new THREE.PlaneGeometry(1,this.angle/60,1);


if (this.angle > 0) {
      const graphTopMat = new THREE.MeshBasicMaterial({ color: new THREE.Color("rgb(255, 100, 255)"),side: THREE.DoubleSide});
    const graphTopMesh = new THREE.Mesh(graphTopGeo, graphTopMat);
    const graphTopEdge = new THREE.EdgesGeometry(graphTopGeo);
    const planeMesh3 = new THREE.LineSegments(
      graphTopEdge,
      new THREE.LineBasicMaterial({ color: 0x000000 })
    );
      graphTopEdge.rotateY( - Math.PI / 2);
      graphTopEdge.rotateZ( - Math.PI / 2);
      graphTopEdge.translate(this.angle/120, 0.5, 0);
      graphTopMesh.rotateY( - Math.PI / 2);
      graphTopMesh.rotateX( - Math.PI / 2);
      graphTopMesh.translateY(this.angle/120);
      graphTopMesh.translateZ(0.5);

    this.scene2.add(graphTopMesh);
    this.scene2.add(planeMesh3);} 
    else {
  const graphTopMat = new THREE.MeshBasicMaterial({ color: new THREE.Color("rgb(100, 255, 255)"),side: THREE.DoubleSide});
  const graphTopMesh = new THREE.Mesh(graphTopGeo, graphTopMat);
  const graphTopEdge = new THREE.EdgesGeometry(graphTopGeo);
  const planeMesh3 = new THREE.LineSegments(
    graphTopEdge,
    new THREE.LineBasicMaterial({ color: 0x000000 })
  );
    graphTopEdge.rotateY( - Math.PI / 2);
    graphTopEdge.rotateZ( - Math.PI / 2);
    graphTopEdge.translate(this.angle/120, 0.5, 0);
    graphTopMesh.rotateY( - Math.PI / 2);
    graphTopMesh.rotateX( - Math.PI / 2);
    graphTopMesh.translateY(this.angle/120);
    graphTopMesh.translateZ(0.5);

  this.scene2.add(graphTopMesh,planeMesh3);
}

      } */

    if (this.angle != 0) {
      const top = this.angle / 60;
      const inTop = top - (0.1 / 0.5) * top;
      const centAng = Math.atan(2 * top);
      const hyp = Math.sqrt(Math.pow(Math.abs(top), 2) + 0.25);
      const hyp2 = Math.sqrt(Math.pow(Math.abs(inTop), 2) + 0.16);

      this.graphPlanes(top / 2, 0.5);
      this.graphShapes(
        0,
        0,
        0.5,
        Math.PI,
        0,
        0,
        top,
        -0.5,
        0,
        -0.5,
        0,
        -0.4,
        inTop,
        -0.4,
        top,
        -0.5
      );
      this.graphShapes(
        0,
        0,
        -0.5,
        Math.PI,
        0,
        0,
        top,
        -0.5,
        0,
        -0.5,
        0,
        -0.4,
        inTop,
        -0.4,
        top,
        -0.5
      );
      this.graphShapes(
        0,
        0.4,
        0,
        -Math.PI / 2,
        -Math.PI,
        Math.PI,
        inTop,
        0.05,
        inTop,
        0.5,
        0,
        0.5,
        0,
        0.05,
        inTop,
        0.05
      );
      this.graphShapes(
        0,
        0.4,
        0,
        Math.PI / 2,
        Math.PI,
        Math.PI,
        inTop,
        0.05,
        inTop,
        0.5,
        0,
        0.5,
        0,
        0.05,
        inTop,
        0.05
      );
      this.graphShapes(
        0,
        0,
        0,
        -Math.PI / 2,
        Math.PI,
        Math.PI / 2 - centAng,
        -hyp,
        0.5,
        -hyp2,
        0.5,
        -hyp2,
        0.05,
        0,
        0.05,
        0,
        -0.05,
        -hyp2,
        -0.05,
        -hyp2,
        -0.5,
        -hyp,
        -0.5,
        -hyp,
        0.5
      );
      this.graphShapes(
        0,
        0,
        0.05,
        Math.PI,
        0,
        0,
        0,
        -0.4,
        0,
        0,
        inTop,
        -0.4,
        inTop,
        0
      );
      this.graphShapes(
        0,
        0,
        -0.05,
        Math.PI,
        0,
        0,
        0,
        -0.4,
        0,
        0,
        inTop,
        -0.4,
        inTop,
        0
      );
      /*         this.graphShapes(0.2,0,0,0,Math.PI/2,0,-0.05,0,-0.05,0.4,-0.5,0.4,-0.5,0.5,0.5,0.5,0.5,0.4,0.05,0.4,0.05,0,-0.05,0);
       */
    }

    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, -1 * Math.tan((this.angle * Math.PI) / 360), 0),
      new THREE.Vector3(1, 0, 0)
    );
    const uvtest = THREE.ExtrudeGeometry.WorldUVGenerator;

    const extrudeSettings = {
      steps: 20,
      bevelEnabled: false,
      extrudePath: curve,
      UVGenerator: uvtest,
    };

    const geometry = new THREE.ExtrudeGeometry(this.section, extrudeSettings);

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

    const light1 = new THREE.DirectionalLight(color, intensity);
    const amlight1 = new THREE.AmbientLight(color, amintensity);
    const hemlight1 = new THREE.HemisphereLight(0xffffff, color, intensity);

    light1.position.set(0, 0, 5);
    light1.target.position.set(0, 0, 0);

    const light2 = light1.clone();
    const amlight2 = amlight1.clone();
    const hemlight2 = hemlight1.clone();

    this.scene.add(light1, amlight1, hemlight1);
    this.scene2.add(light2, amlight2, hemlight2);

    const edges = new THREE.EdgesGeometry(geometry);
    const mesh2 = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0x000000 })
    );

    this.scene.add(mesh2);
  }

  animator() {
    requestAnimationFrame(() => {
      this.animator();
    });
    this.controls.update();
    this.controls2.update();
    this.renderer.render(this.scene, this.camera);
    this.renderer2.render(this.scene2, this.camera);
  }

  onChange() {
    for (let i = this.scene.children.length - 1; i >= 0; i--) {
      const obj = this.scene.children[i];
      this.scene.remove(obj);
    }
    for (let i = this.scene2.children.length; i > 3; i--) {
      const obj2 = this.scene2.children[i];
      this.scene2.remove(obj2);
    }
    this.angle = Number((this.sliderValue as HTMLInputElement).value);
    this.init();
  }

  graphPlanes(trans1: number, trans2: number) {
    const planeGeo1 = new THREE.PlaneGeometry(1, this.angle / 60, 1, 1);

    const planeEdge1 = new THREE.EdgesGeometry(planeGeo1);
    const planeLine1 = new THREE.LineSegments(
      planeEdge1,
      new THREE.LineBasicMaterial({ color: 0x000000 })
    );

    const planeMesh1 = new THREE.Mesh(planeGeo1);

    planeEdge1.rotateY(Math.PI / 2);
    planeEdge1.rotateZ(Math.PI / 2);
    planeEdge1.translate(trans1, trans2, 0);
    planeGeo1.rotateY(Math.PI / 2);
    planeGeo1.rotateZ(Math.PI / 2);
    planeGeo1.translate(trans1, trans2, 0);
    const planeGeo2 = planeGeo1.clone().rotateZ(Math.PI);
    const planeLine2 = planeLine1.clone().rotateZ(Math.PI);
    const planeMesh2 = new THREE.Mesh(planeGeo2);
    if (this.angle > 0 && trans1 > 0) {
      planeMesh1.material = this.tensMat;
      planeMesh2.material = this.compMat;
    } else {
      planeMesh1.material = this.compMat;
      planeMesh2.material = this.tensMat;
    }
    this.scene2.add(planeMesh1, planeMesh2, planeLine1, planeLine2);
  }
  graphShapes(
    trans1: number,
    trans2: number,
    trans3: number,
    rot1: number,
    rot2: number,
    rot3: number,
    ...args: number[]
  ) {
    const shape = new THREE.Shape();

    shape.moveTo(args[0], args[1]);
    for (let i = 2; i < args.length - 2; i += 2) {
      shape.lineTo(args[i], args[i + 1]);
    }
    const shapeGeo1 = new THREE.ShapeGeometry(shape);
    const shapeEdge1 = new THREE.EdgesGeometry(shapeGeo1);

    const shapeLine1 = new THREE.LineSegments(
      shapeEdge1,
      new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    const shapeMesh1 = new THREE.Mesh(shapeGeo1);

    shapeEdge1.rotateX(rot1);
    shapeEdge1.rotateY(rot2);
    shapeEdge1.rotateZ(rot3);

    shapeGeo1.rotateX(rot1);
    shapeGeo1.rotateY(rot2);
    shapeGeo1.rotateZ(rot3);

    shapeEdge1.translate(trans1, trans2, trans3);
    shapeGeo1.translate(trans1, trans2, trans3);
    const shapeGeo2 = shapeGeo1.clone().rotateZ(Math.PI);
    const shapeLine2 = shapeLine1.clone().rotateZ(Math.PI);

    const shapeMesh2 = new THREE.Mesh(shapeGeo2);

    /*   if ((this.angle > 0 && -args[0]>0) || (this.angle < 0 && -args[0]>0)) {
    shapeMesh1.material = this.tensMat; shapeMesh2.material = this.compMat;
 } else {
  shapeMesh1.material = this.compMat; shapeMesh2.material = this.tensMat;

  } */

    if (this.angle > 0) {
      shapeMesh1.material = this.tensMat;
      shapeMesh2.material = this.compMat;
    } else {
      shapeMesh1.material = this.compMat;
      shapeMesh2.material = this.tensMat;
    }
    this.scene2.add(shapeMesh1, shapeMesh2, shapeLine1, shapeLine2);
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      max-width: 100%;
      max-height: 100%;
      color: #321e00;
      margin: 0 auto;
    }

    h1,
    h2,
    h3 p {
      display: flex;
      margin: 0;
      padding: 0;
      line-height: 150%;
      justify-content: center;
      margin-top: 0;
    }

    h2 {
      margin-top: 0.3em;
    }
    h3 {
      margin-top: 0;
      margin-bottom: 0;
      min-width: 4em;
      margin-left: 0.5em;
      text-align: center;
      writing-mode: vertical-lr;
    }
    #main {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      max-width: 100%;
      max-height: 100%;
      color: #321e00;
      margin: 0;
    }
    .colleft {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      align-content: center;
      flex: 0.5, 0.5, 0.5;
    }
    .colright {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      align-content: center;
      flex: 0.5;
    }
    p {
      max-width: 80vw;
      align-self: center;
    }
    /*     .cols {
      flex: 0.5;
    } */

    /*     #slidertext {
      width: 20%;
      height: 100%;
      flex-direction: row;
    } */

    svg {
      display: flex;
    }

    .slider-wrapper {
      width: 32px;
      height: 50vh;
      padding: 0;
    }

    .slider {
      display: flex;
      -webkit-appearance: none;
      width: 50vh;
      height: 32px;
      border-radius: 14px;
      background: #ffc342;
      outline: none;
      -webkit-transition: 0.2s;
      transition: opacity 0.2s;
      transform-origin: 25vh 25vh;
      transform: rotate(-90deg);
      align-items: center;
      align-content: center;
      justify-content: center;
    }

    .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #321e00;
      cursor: pointer;
      align-items: center;
      align-content: center;
      justify-content: center;
    }

    .slider::-moz-range-thumb {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #321e00;
      cursor: pointer;
      align-items: center;
      align-content: center;
      justify-content: center;
    }
  `;

  get sliderValue() {
    return this.shadowRoot?.getElementById('myRange');
  }

  render() {
    return html`
      <h2>${this.english ? 'bender' : 'ベンダー'}</h2>
      <div id="main">
        <div class="colleft">
          <div id="beam"></div>
          <div id="graph"></div>
        </div>
        <div class="colright">
          <label for="myRange">${this.english ? 'bend' : '曲げる'}</label>

          <div class="slider-wrapper">
            <input
              type="range"
              min="-60"
              max="60"
              value="0"
              step="1"
              class="slider"
              id="myRange"
              @input=${this.onChange}
            />
          </div>
        </div>
      </div>
      <p>
        ${this.english
          ? 'The plot shows internal forces: tension to the right in pink, and compression to the left in blue.'
          : 'プロットは内力を示しています。右側の張力はピンク色で、左側の圧縮は青色で示されています。'}
      </p>
    `;
  }
}
customElements.define('bender-demo', BenderDemo);
