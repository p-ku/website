import { LitElement, html, css, property } from 'lit-element'; // https://lit-element.polymer-project.org/
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'; // https://threejs.org/
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js'; // https://threejs.org/
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // https://threejs.org/
import {
  ObjectLoader,
  Mesh,
  Plane,
  Vector2,
  Vector3,
  MeshBasicMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
  AlwaysStencilFunc,
  Group,
  ExtrudeGeometry,
  LineSegments,
  Scene,
  PerspectiveCamera,
  Shape,
  WebGLRenderer,
  Color,
  DirectionalLight,
  AmbientLight,
  HemisphereLight,
  QuadraticBezierCurve,
  QuadraticBezierCurve3,
  EdgesGeometry,
  ShapeGeometry,
  LineBasicMaterial,
  PlaneGeometry,
  NotEqualStencilFunc,
  ReplaceStencilOp,
  BufferGeometry,
  FrontSide,
  BackSide,
  IncrementWrapStencilOp,
  DecrementWrapStencilOp,
  Ray,
  BufferAttribute,
  Object3D,
} from 'three'; // https://threejs.org/
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

class BenderDemo extends LitElement {
  @property({ type: String }) lang = '';
  @property({ type: Boolean }) english = true;
  @property({ attribute: false }) steps = 100;

  @property({ attribute: false }) graphFileNames = [
    'compMesh',
    'compPos',
    'compStencil1',
    'compStencil2',
    'tensMesh',
    'tensPos',
    'tensStencil1',
    'tensStencil2',
  ];
  @property({ attribute: false }) vertexPos: any[] = [];

  @property({ attribute: false }) curvePos: any = [];
  @property({ attribute: false }) beamLength = 2;

  @property({ attribute: false }) beamFileNames = ['beamMesh', 'beamLine'];

  @property({ attribute: false }) angle = 0;
  @property({ attribute: false }) previous = 0;
  /*   @property({ attribute: false }) compClip: any = [];
   */ @property({ attribute: false }) jsonGraph: any = [];
  @property({ attribute: false }) jsonBeam: any = [];

  @property({ attribute: false }) bh = 1;
  @property({ attribute: false }) t = 0.2;

  @property({ attribute: false }) section = new Shape([
    new Vector2(-this.bh / 2, -this.bh / 2),
    new Vector2(this.bh / 2, -this.bh / 2),
    new Vector2(this.bh / 2, (2 * this.t) / 2 - this.bh / 2),
    new Vector2(this.t / 2, (2 * this.t) / 2 - this.bh / 2),
    new Vector2(this.t / 2, this.bh / 2 - (2 * this.t) / 2),
    new Vector2(this.bh / 2, this.bh / 2 - (2 * this.t) / 2),
    new Vector2(this.bh / 2, this.bh / 2),
    new Vector2(-this.bh / 2, this.bh / 2),
    new Vector2(-this.bh / 2, this.bh / 2 - (2 * this.t) / 2),
    new Vector2(-this.t / 2, this.bh / 2 - (2 * this.t) / 2),
    new Vector2(-this.t / 2, (2 * this.t) / 2 - this.bh / 2),
    new Vector2(-this.bh / 2, (2 * this.t) / 2 - this.bh / 2),
    new Vector2(-this.bh / 2, -this.bh / 2),
  ]);

  @property({ attribute: false }) graphBeamLine = new LineSegments();
  @property({ attribute: false }) graphBeamMesh = new Mesh();
  @property({ attribute: false }) bendScene = new Scene();
  @property({ attribute: false }) graphScene = new Scene();
  @property({ attribute: false }) testScene = new Scene();

  @property({ attribute: false }) camera = new PerspectiveCamera(
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

  /*   createScene(elementId: string): void {
    let loadScene = new Scene;
    const me = this.testScene;
        const loader = new ObjectLoader();
    loader.load('graphScene.json', ( obj ) => {loadScene = obj;

    });

  } */
  connectedCallback() {
    super.connectedCallback();
  }
  firstUpdated() {
    if (location.pathname.includes('jp')) {
      this.english = false;
      this.lang = '/jp';
    } else {
      this.english = true;
      this.lang = '';
    }
    this.loadData2();
    this.init();

    /*     this.init();*/
    this.animator();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    console.log('disconenectd');
    for (let index = 0; index < this.jsonGraph.length; index++) {
      for (
        let jindex = 0;
        jindex < this.jsonGraph[index].children.length;
        jindex++
      ) {
        this.testScene.remove(this.jsonGraph[index].children[jindex]);

        this.jsonGraph[index].children[jindex].geometry.dispose();
        this.jsonGraph[index].children[jindex].material.dispose();
      }
      this.jsonGraph[index] = null;
    }
  }

  handleResize = () => {
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerHeight / 2.55, window.innerHeight / 3.06);
    this.renderer2.setSize(
      window.innerHeight / 2.55,
      window.innerHeight / 3.06
    );
  };

  async loadData1() {
    const loader = new ObjectLoader();

    /*     loader.load('graphScene.json', jsonScene => {
      for (let index = 0; index < jsonScene.children.length; index++) {
        this.testScene.add(jsonScene.children[index]);
      }
    }); */

    /*     const jsonGroups = readdirSync('bendData');

    for (let index = 0; index < jsonGroups.length; index++) {
      console.log(jsonGroups[index]);
      loader.load(jsonGroups[index], jsonScene => {
        this.jsonGraph[0] = jsonScene;
        this.testScene.add(this.jsonGraph[0]);
      });
    } */

    /*  const dir = './bentData/';
    console.dir(dir);
    const files = readdirSync(dir);
 */
    // files object contains all files names
    // log them on console
    /*     files.forEach(file => {
      console.log(file);
    }); */

    for (let index = 0; index < this.graphFileNames.length; index++) {
      loader.load(
        './bentData/' + this.graphFileNames[index] + '.json',
        jsonScene => {
          this.jsonGraph[index] = jsonScene;
          this.testScene.add(this.jsonGraph[index]);
        }
      );
    }
    /*     let vertexPos = [];
    let curvePos = []; */

    /*     this.vertexPos = await fetch('./bentData/vertexPos.json').then(response => {
      return response.json();
    }); */
    /*       .then(data => {
        vertexPos = data;
      }); */
    /*     this.curvePos = await fetch('./bentData/curvePos.json').then(response => {
      return response.json();
    }); */
    /*      .then(data => {
        curvePos = data;
        console.log(data);
      }); */

    /*     loader.load('./bentData/compMesh.json', jsonScene => {
      this.jsonGraph[0] = jsonScene;
      this.testScene.add(this.jsonGraph[0]);
    });
    loader.load('./bentData/compPos.json', jsonScene => {
      this.jsonGraph[1] = jsonScene;
      this.testScene.add(this.jsonGraph[1]);
    });
    loader.load('./bentData/compStencil1.json', jsonScene => {
      this.jsonGraph[2] = jsonScene;
      this.testScene.add(this.jsonGraph[2]);
    });
    loader.load('./bentData/compStencil2.json', jsonScene => {
      this.jsonGraph[3] = jsonScene;
      this.testScene.add(this.jsonGraph[3]);
    }); */
  }
  async loadData2() {
    const loader = new ObjectLoader();
    await this.loadData1().then(() => {
      loader.load('./bentData/beamMesh.json', jsonScene => {
        this.jsonBeam[0] = jsonScene;

        /* 
        for (let index = 0; index < jsonScene.children.length; index++) {
          const clipAngle = ((index - 100 / 2) * 1) / 100;
          const sigmaMax = -Math.atan(clipAngle);

          const count = this.vertexPos[0].length;

          (<THREE.Mesh>this.jsonBeam[0].children[index]).geometry.setAttribute(
            'color',
            this.vertexPos[index]
          );
        } */
        this.bendScene.add(this.jsonBeam[0]);
      });
    });
  }
  async init() {
    await this.loadData2().then(() => {
      /*     this.controls.addEventListener('change', this.render);
       */ window.addEventListener('resize', this.handleResize);
      this.controls.enablePan = false;
      this.controls.enableZoom = false;
      this.controls.enableDamping = true;
      this.controls.minAzimuthAngle = -Math.PI / 2;
      this.controls.maxAzimuthAngle = Math.PI / 2;
      this.controls.minPolarAngle = Math.PI / 3;
      this.controls.maxPolarAngle = (2 * Math.PI) / 3;
      this.controls2.enablePan = false;
      this.controls2.enableZoom = false;
      this.controls2.enableDamping = true;
      this.controls2.minAzimuthAngle = -Math.PI / 2;
      this.controls2.maxAzimuthAngle = Math.PI / 2;
      this.controls2.minPolarAngle = Math.PI / 3;
      this.controls2.maxPolarAngle = (2 * Math.PI) / 3;
      this.bendScene.background = new Color(0xfffde8);
      this.graphScene.background = new Color(0xfffde8);

      this.camera.aspect = 3 / 2.5;
      this.camera.updateProjectionMatrix();
      this.camera.position.set(2, 2, 3.2);
      /*     this.camera.position.set(3, 0, 0);
       */
      this.camera.lookAt(new Vector3(0, 0, 0));
      this.renderer2.localClippingEnabled = true;
      this.renderer.setSize(
        window.innerHeight / 2.55,
        window.innerHeight / 3.06
      );
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

      const color = 0xfffde8;
      const intensity = 0.5;
      const amintensity = 1;
      const light1 = new DirectionalLight(color, intensity);
      const amlight1 = new AmbientLight(color, amintensity);
      const hemlight1 = new HemisphereLight(0xffffff, color, intensity);

      light1.position.set(0, 0, 5);
      light1.target.position.set(0, 0, 0);

      const graphGroup = new Group();

      const light2 = light1.clone();
      const amlight2 = amlight1.clone();
      const hemlight2 = hemlight1.clone();
      /*     graphGroup.add(light2, amlight2, hemlight2);
       */

      this.testScene.add(light2, amlight2, hemlight2);
      this.bendScene.add(light1, amlight1, hemlight1);
      /*      this.graphScene.add(light2, amlight2, hemlight2);
       */
      const plotPlaneGeo = new PlaneGeometry(1.7, 1.7, 1);
      const plotPlaneEdge = new EdgesGeometry(plotPlaneGeo);
      const plotPlaneLines = new LineSegments(
        plotPlaneEdge,
        new LineBasicMaterial({ color: 0x000000 })
      );
      plotPlaneEdge.rotateY(Math.PI / 2);

      this.testScene.background = new Color(0xfffde8);

      /*         this.testScene.add(light3, amlight3, hemlight3);
       */
    });
  }

  animator() {
    requestAnimationFrame(() => {
      this.animator();
    });

    this.controls.update();
    this.controls2.update();
    this.renderer.render(this.bendScene, this.camera);
    this.renderer2.render(this.testScene, this.camera);
  }

  newBend() {
    this.angle = Number((this.sliderValue as HTMLInputElement).value);

    /*     if (this.angle == 50) {
      for (let index = 0; index < this.jsonGraph.length; index++) {
        this.jsonGraph[index].children[this.angle].material.visible = false;
        this.jsonGraph[index].children[this.previous].material.visible = false;
      }
    } else { */
    const clipAngle = ((this.angle - this.steps / 2) * 1) / this.steps;
    const sigmaMax = -Math.atan(clipAngle);
    const compClip1 = new Plane(new Vector3(-1, -sigmaMax * 3.5, 0)).translate(
      new Vector3(0.001, 0, 0)
    );
    const tensClip1 = new Plane(new Vector3(1, sigmaMax * 3.5, 0)).translate(
      new Vector3(-0.001, 0, 0)
    );
    const compClip2 = new Plane(new Vector3(1, 0, 0), -0.001);
    const tensClip2 = new Plane(new Vector3(-1, 0, 0), -0.001);
    for (let index = 0; index < this.jsonBeam.length; index++) {
      this.jsonBeam[index].children[this.angle].material.visible = true;
      this.jsonBeam[index].children[this.previous].material.visible = false;
    }
    for (let index = 0; index < this.jsonGraph.length / 2; index++) {
      this.jsonGraph[index].children[this.angle].material.visible = true;
      this.jsonGraph[index].children[this.previous].material.visible = false;
      this.jsonGraph[index].children[this.angle].material.clippingPlanes = [
        compClip1,
      ];
    }
    for (
      let index = this.jsonGraph.length / 2;
      index < this.jsonGraph.length;
      index++
    ) {
      this.jsonGraph[index].children[this.angle].material.visible = true;
      this.jsonGraph[index].children[this.previous].material.visible = false;
      this.jsonGraph[index].children[this.angle].material.clippingPlanes = [
        tensClip1,
      ];
    }
    this.jsonGraph[1].children[this.angle].material.clippingPlanes = [
      compClip2,
    ];
    this.jsonGraph[5].children[this.angle].material.clippingPlanes = [
      tensClip2,
    ];

    /*     for (let index = 0; index < this.meshes.length; index++) {
      this.meshes[index][this.angle].material.visible = true;
      this.meshes[index][this.previous].material.visible = false;
    } */
    /*     const clipAngle = ((this.angle - 100 / 2) * 1) / 100;
    const sigmaMax = -Math.atan(clipAngle);
    const compClip = [
      new Plane(new Vector3(-1, -sigmaMax * 3.5, 0), 0.001),
      new Plane(new Vector3(1, 0, 0)),
    ];
    const tensClip = [
      new Plane(new Vector3(1, sigmaMax * 3.5, 0), 0.001),
      new Plane(new Vector3(-1, 0, 0)),
    ]; */

    /*     this.jsonGraph[0].children[this.angle].material.clippingPlanes = [
      compClip[1],
    ];

    this.jsonGraph[2].children[this.angle].material.clippingPlanes = [
      compClip[1],
    ];
    this.jsonGraph[3].children[this.angle].material.clippingPlanes = [
      compClip[1],
    ]; */

    this.previous = this.angle;
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

    .disabled {
      opacity: 0.5;
      pointer-events: none;
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
              id="myRange"
              class="slider"
              type="range"
              min="0"
              max="${this.steps}"
              value="50"
              @input=${this.newBend}
            />
          </div>
        </div>
      </div>
      <p>
        ${this.english
          ? 'The plot shows stress in a vertical slice: compression to the right in blue, and tension to the left in pink.'
          : 'プロットは、垂直方向のスライスでの応力を示しています。青色で右に圧縮、ピンク色で左に引張られた状態を示しています。'}
      </p>
    `;
  }
}
customElements.define('bender-demo', BenderDemo);
