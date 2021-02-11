import { LitElement, html, css, property } from 'lit-element';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class BenderDemo extends LitElement {
  @property({ type: String }) lang = '';
  @property({ type: Boolean }) english = true;
  @property({ attribute: false }) angle = 0;
  @property({ attribute: false }) bendGroup = new THREE.Group();
  @property({ attribute: false }) graphGroup = new THREE.Group();
  @property({ attribute: false }) sectionMat = new THREE.MeshPhongMaterial({
    color: new THREE.Color(0.2, 0.2, 0.2),
    polygonOffset: true,
    polygonOffsetFactor: -1, // positive value pushes polygon further away
    polygonOffsetUnits: 1,
    side: THREE.DoubleSide,
  });
  @property({ attribute: false }) baseMat = new THREE.MeshBasicMaterial({
    depthWrite: false,
    depthTest: false,
    colorWrite: false,
    stencilWrite: true,
    stencilFunc: THREE.AlwaysStencilFunc,
  });
  @property({ attribute: false }) planeGeoms = [
    new THREE.PlaneGeometry(4, 4),
    new THREE.PlaneGeometry(4, 4),
  ];
  @property({ attribute: false }) pos = [new THREE.Mesh(), new THREE.Mesh()];

  @property({ attribute: false }) planeObjects = [
    new THREE.Mesh(),
    new THREE.Mesh(),
  ];
  @property({ attribute: false }) stencilGroup = [
    new THREE.Group(),
    new THREE.Group(),
  ];

  // back faces
  @property({ attribute: false }) mat0 = [
    this.baseMat.clone(),
    this.baseMat.clone(),
  ];

  // front faces
  @property({ attribute: false }) mat1 = [
    this.baseMat.clone(),
    this.baseMat.clone(),
  ];
  @property({ attribute: false }) mesh0 = [new THREE.Mesh(), new THREE.Mesh()];
  @property({ attribute: false }) mesh1 = [new THREE.Mesh(), new THREE.Mesh()];

  @property({ attribute: false }) clipObjects = [
    new THREE.Group(),
    new THREE.Group(),
  ];

  @property({ attribute: false }) compClip = [
    new THREE.Plane(new THREE.Vector3(-1, this.angle / 30, 0)),
    new THREE.Plane(new THREE.Vector3(1, 0, 0)),
  ];
  @property({ attribute: false }) tensClip = [
    new THREE.Plane(new THREE.Vector3(1, -this.angle / 30, 0)),
    new THREE.Plane(new THREE.Vector3(-1, 0, 0)),
  ];
  @property({ attribute: false }) clipPlanes = [this.compClip, this.tensClip];

  @property({ attribute: false }) beamLength = 2;
  @property({ attribute: false }) graphMat = [
    new THREE.MeshStandardMaterial(),
    new THREE.MeshStandardMaterial(),
  ];

  @property({ attribute: false }) compFrontMat = new THREE.MeshBasicMaterial();
  @property({ attribute: false }) compBackMat = new THREE.MeshBasicMaterial();
  @property({ attribute: false }) compPlaneMat = new THREE.MeshNormalMaterial();
  @property({ attribute: false }) tensFrontMat = new THREE.MeshBasicMaterial();
  @property({ attribute: false }) tensBackMat = new THREE.MeshBasicMaterial();
  @property({ attribute: false }) tensPlaneMat = new THREE.MeshNormalMaterial();
  @property({ attribute: false }) compPlaneMesh = new THREE.Mesh();
  @property({ attribute: false }) tensPlaneMesh = new THREE.Mesh();

  @property({ attribute: false }) section = new THREE.Shape([
    new THREE.Vector2(-0.5, -0.5),
    new THREE.Vector2(0.5, -0.5),
    new THREE.Vector2(0.5, -0.4),
    new THREE.Vector2(0.05, -0.4),
    new THREE.Vector2(0.05, 0.4),
    new THREE.Vector2(0.5, 0.4),
    new THREE.Vector2(0.5, 0.5),
    new THREE.Vector2(-0.5, 0.5),
    new THREE.Vector2(-0.5, 0.4),
    new THREE.Vector2(-0.05, 0.4),
    new THREE.Vector2(-0.05, -0.4),
    new THREE.Vector2(-0.5, -0.4),
    new THREE.Vector2(-0.5, -0.5),
  ]);

  @property({ attribute: false }) sectionGeo = new THREE.ShapeGeometry(
    this.section
  );
  @property({ attribute: false }) straightBeamGeo = new THREE.ExtrudeGeometry(
    this.section,
    {
      depth: 2,
      bevelEnabled: false,
    }
  );
  /*   @property({ attribute: false }) compGeo = new THREE.ExtrudeGeometry(this.section, {
    depth: 1,
    bevelEnabled: false,
  });
  @property({ attribute: false }) tensGeo = new THREE.ExtrudeGeometry(this.section, {
    depth: 1,
    bevelEnabled: false,
  }); */
  @property({ attribute: false }) beamLine = new THREE.LineSegments();

  /*   @property({ attribute: false }) compMesh = new THREE.Mesh();
  @property({ attribute: false }) tensMesh = new THREE.Mesh(); */

  @property({ attribute: false }) graphBeamLine = new THREE.LineSegments();

  @property({ attribute: false }) graphBeamMesh = new THREE.Mesh();

  /* @property({ attribute: false }) compMat = new THREE.MeshBasicMaterial({color: new THREE.Color(0.4,1,1), side: THREE.DoubleSide});
  @property({ attribute: false }) tensMat = new THREE.MeshBasicMaterial({color: new THREE.Color(1,0.4,1), side: THREE.DoubleSide}); */
  @property({ attribute: false }) beamMesh = new THREE.Mesh();
  /*   @property({ attribute: false }) tensMesh = new THREE.Mesh(this.straightBeamGeo,this.tensMat);
  @property({ attribute: false }) compMesh = new THREE.Mesh(this.straightBeamGeo,this.compMat); */

  @property({ attribute: false }) bendScene = new THREE.Scene();

  @property({ attribute: false }) graphScene = new THREE.Scene();

  @property({ attribute: false }) camera = new THREE.PerspectiveCamera(
    33,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  @property({ attribute: false }) renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  @property({ attribute: false }) renderer2 = new THREE.WebGLRenderer({
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
    if (location.pathname.includes('jp')) {
      this.english = false;
      this.lang = '/jp';
    } else {
      this.english = true;
      this.lang = '';
    }

    this.init();
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
    this.renderer2.localClippingEnabled = true;
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
    this.bendScene.background = new THREE.Color(0xfffde8);
    this.graphScene.background = new THREE.Color(0xfffde8);
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

    this.bendScene.add(light1, amlight1, hemlight1);
    this.graphScene.add(light2, amlight2, hemlight2);

    const plotPlaneGeo = new THREE.PlaneGeometry(1.7, 1.7, 1);
    const plotPlaneMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('rgb(255, 255, 255)'),
      opacity: 0.4,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const plotPlaneMesh = new THREE.Mesh(plotPlaneGeo, plotPlaneMat);
    const plotPlaneEdge = new THREE.EdgesGeometry(plotPlaneGeo);
    const plotPlaneLines = new THREE.LineSegments(
      plotPlaneEdge,
      new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    plotPlaneMesh.rotateY(Math.PI / 2);
    plotPlaneEdge.rotateY(Math.PI / 2);

    const sectionEdge = new THREE.EdgesGeometry(this.sectionGeo);
    const sectionLine = new THREE.LineSegments(
      sectionEdge,
      new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    sectionLine.rotateY(-Math.PI / 2);
    this.sectionGeo.rotateY(-Math.PI / 2);
    const sectionMesh = new THREE.Mesh(this.sectionGeo, this.sectionMat);

    const beamMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color(0.2, 0.2, 0.2),
      polygonOffset: true,
      polygonOffsetFactor: -1, // positive value pushes polygon further away
      polygonOffsetUnits: 1,
    });
    /*      const beamGeo = new THREE.ExtrudeGeometry(this.section, {
      depth: 2,
      bevelEnabled: false,
    }); */
    /*         this.compGeo.rotateY(Math.PI / 2);
        this.tensGeo.rotateY(Math.PI / 2);     */

    /* this.tensMesh = new THREE.Mesh(this.straightBeamGeo,this.compMat);
this.compMesh = new THREE.Mesh(this.straightBeamGeo,this.compMat); */
    /* this.compGeo.translate(0.0001,0,0);
this.tensGeo.translate(-1.0001,0,0); */

    this.straightBeamGeo.rotateY(Math.PI / 2);
    this.straightBeamGeo.translate(-1, 0, 0);

    /* this.straightBeamGeo.addGroup( 0, Infinity, 0 );
this.straightBeamGeo.addGroup( 0, Infinity, 1 ); */

    /* const graphBeamMat = [tensMat, compMat];
const compMesh = new THREE.Mesh(this.straightBeamGeo,compMat);
const tensMesh = new THREE.Mesh(this.straightBeamGeo,tensMat); */
    const beamEdge = new THREE.EdgesGeometry(this.straightBeamGeo);

    this.beamLine.geometry = beamEdge;
    beamEdge.dispose();

    this.beamLine.material = new THREE.LineBasicMaterial({ color: 0x000000 });

    /* this.tensMesh.renderOrder = 3;
this.compMesh.renderOrder = 4; */

    this.beamMesh = new THREE.Mesh(this.straightBeamGeo, beamMat);
    const graphMesh = [];
    const planeMats = [];
    const poGroups = [new THREE.Group(), new THREE.Group()];

    const compGeo = new THREE.ExtrudeGeometry(this.section, {
      depth: 1,
      bevelEnabled: false,
    });
    const tensGeo = new THREE.ExtrudeGeometry(this.section, {
      depth: 1,
      bevelEnabled: false,
    });
    compGeo.rotateY(Math.PI / 2);
    tensGeo.rotateY(Math.PI / 2);
    tensGeo.translate(-1, 0, 0);
    const graphGeos = [compGeo, tensGeo];
    const planeObjects = [];

    /*   planeGeoms[0].rotateY(Math.PI / 2);
     */
    /*  planeGeoms[0].translate(0,0,1);
 
planeGeoms[1].translate(0,0,1); */
    this.graphScene.add(this.clipObjects[0], this.clipObjects[1]);

    for (let i = 0; i < 2; i++) {
      const plane = this.clipPlanes[i];
      this.stencilGroup[i] = this.createPlaneStencilGroup(
        graphGeos[i],
        [plane],
        1 + i,
        i
      ); // plane is clipped by the other clipping planes
      /* this.stencilGroup[0].renderOrder = 0.1;
       */ planeMats[i] = new THREE.MeshStandardMaterial({
        metalness: 0.1,
        roughness: 0.75,
        /*       clippingPlanes: clipPlanes[i].filter( p => p !== plane ),
         */ stencilWrite: true,
        stencilRef: 0,
        stencilFunc: THREE.NotEqualStencilFunc,
        stencilFail: THREE.ReplaceStencilOp,
        stencilZFail: THREE.ReplaceStencilOp,
        stencilZPass: THREE.ReplaceStencilOp,
      });
      /*     if (i==0) {
      planeMats[i].color = new THREE.Color(0.5, 1, 1);
     } else {
      planeMats[i].color = new THREE.Color(1, 0.5, 1);
     } */
      this.pos[i] = new THREE.Mesh(this.planeGeoms[i], planeMats[i]);

      this.pos[i].onAfterRender = function (renderer) {
        renderer.clearStencil();
        /*       renderer.clearDepth();
         */
      };

      this.pos[i].renderOrder = 1.1 + i;

      /*   this.clipObjects[i].add( this.stencilGroup[i] );
       */ poGroups[i].add(this.pos[i]);
      planeObjects[i] = this.pos[i];
      /*   this.graphScene.add( poGroups[i] ); */

      this.graphMat[i] = new THREE.MeshStandardMaterial({
        color: 0xffc107,
        metalness: 0.1,
        roughness: 0.75,
        clippingPlanes: [this.clipPlanes[i][0]],
        clipShadows: true,
        /*          polygonOffset: true,
  polygonOffsetFactor: -1, // positive value pushes polygon further away
  polygonOffsetUnits: 1,
  side: THREE.DoubleSide, */
      });
      if (i == 0) {
        this.graphMat[i].color = new THREE.Color(0.3, 0.67, 0.67);
        planeMats[i].color = new THREE.Color(0.25, 0.5575, 0.5575);
      } else {
        this.graphMat[i].color = new THREE.Color(0.67, 0.3, 0.67);
        planeMats[i].color = new THREE.Color(0.5575, 0.25, 0.5575);
      }
      graphMesh[i] = new THREE.Mesh(graphGeos[i], this.graphMat[i]);
      graphMesh[i].renderOrder = 6 + i;
    }
    this.pos[0].rotateY(Math.PI / 2);
    this.pos[1].rotateY(-Math.PI / 2);

    graphMesh[0].translateX(0.001);
    graphMesh[1].translateX(-0.001);
    this.pos[0].translateX(0.001);
    this.pos[1].translateX(-0.001);

    this.clipObjects[0].add(this.stencilGroup[0]);
    this.clipObjects[1].add(this.stencilGroup[1]);

    this.graphScene.add(this.pos[0], this.pos[1]);
    this.clipObjects[0].add(graphMesh[0]);
    this.clipObjects[1].add(graphMesh[1]);

    this.bendGroup.add(this.beamMesh, this.beamLine);
    this.bendScene.add(this.bendGroup);
    /*  this.graphGroup.add(this.graphBeamLine)
     */

    this.camera.position.set(2, 2, 3.2); // Set position like this
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.graphScene.add(
      /*       plotPlaneMesh,
       */ sectionLine,
      plotPlaneLines /* , sectionMesh */
    );
  }

  animator() {
    requestAnimationFrame(() => {
      this.animator();
    });

    const plane = this.clipPlanes[0][0];
    plane.coplanarPoint(this.planeObjects[0].position);
    this.planeObjects[0].lookAt(
      this.planeObjects[0].position.x - plane.normal.x,
      this.planeObjects[0].position.y - plane.normal.y,
      this.planeObjects[0].position.z - plane.normal.z
    );

    this.controls.update();
    this.controls2.update();
    this.renderer.render(this.bendScene, this.camera);
    this.renderer2.render(this.graphScene, this.camera);
  }

  createPlaneStencilGroup(
    geometry: THREE.BufferGeometry,
    plane: THREE.Plane[][],
    renderOrder: number,
    index: number
  ) {
    const group = new THREE.Group();

    // back faces
    this.mat0[index].side = THREE.BackSide;
    this.mat0[index].clippingPlanes = [plane];
    this.mat0[index].stencilFail = THREE.IncrementWrapStencilOp;
    this.mat0[index].stencilZFail = THREE.IncrementWrapStencilOp;
    this.mat0[index].stencilZPass = THREE.IncrementWrapStencilOp;

    this.mesh0[index] = new THREE.Mesh(geometry, this.mat0[index]);
    this.mesh0[index].renderOrder = renderOrder;
    group.add(this.mesh0[index]);

    // front faces
    this.mat1[index].side = THREE.FrontSide;
    this.mat1[index].clippingPlanes = [plane];
    this.mat1[index].stencilFail = THREE.DecrementWrapStencilOp;
    this.mat1[index].stencilZFail = THREE.DecrementWrapStencilOp;
    this.mat1[index].stencilZPass = THREE.DecrementWrapStencilOp;

    this.mesh1[index] = new THREE.Mesh(geometry, this.mat1[index]);
    this.mesh1[index].renderOrder = renderOrder;

    group.add(this.mesh1[index]);

    return group;
  }

  newBend() {
    this.angle = Number((this.sliderValue as HTMLInputElement).value);

    if (this.angle == 0) {
      this.graphMat[0].visible = false;
      this.pos[0].visible = false;
      this.graphMat[1].visible = false;
      this.pos[1].visible = false;
    } else {
      this.graphMat[0].visible = true;
      this.pos[0].visible = true;
      this.graphMat[1].visible = true;
      this.pos[1].visible = true;

      this.graphMat[0].clippingPlanes = [
        new THREE.Plane(new THREE.Vector3(-1, this.angle / 30, 0), 0.001),
        new THREE.Plane(new THREE.Vector3(1, 0, 0)),
      ];
      this.graphMat[1].clippingPlanes = [
        new THREE.Plane(new THREE.Vector3(1, -this.angle / 30, 0), 0.001),
        new THREE.Plane(new THREE.Vector3(-1, 0, 0)),
      ];
    }

    this.mat0[0].clippingPlanes = [
      new THREE.Plane(new THREE.Vector3(1, -this.angle / 30, 0)),
    ];
    this.mat1[0].clippingPlanes = [
      new THREE.Plane(new THREE.Vector3(1, -this.angle / 30, 0)),
    ];
    this.pos[0].quaternion.setFromAxisAngle(
      new THREE.Vector3(0, 0, 1),
      Math.atan(-this.angle / 30)
    );
    this.mat0[1].clippingPlanes = [
      new THREE.Plane(new THREE.Vector3(1, -this.angle / 30, 0)),
    ];
    this.mat1[1].clippingPlanes = [
      new THREE.Plane(new THREE.Vector3(1, -this.angle / 30, 0)),
    ];
    this.pos[1].quaternion.setFromAxisAngle(
      new THREE.Vector3(0, 0, 1),
      Math.atan(-this.angle / 30)
    );
    /*     this.tensPlaneMesh.quaternion.setFromUnitVectors(new THREE.Vector3(1,0, 0), new THREE.Vector3(1,-this.angle/60,0));
     */

    /* this.pos[0].quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),new THREE.Vector3(-1,this.angle/30,0));
     */ this.pos[0].rotateY(Math.PI / 2);
    this.pos[1].rotateY(-Math.PI / 2);
    /*      this.pos[0].translateX(0.0001);
     */ const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-this.beamLength / 2, 0, 0),
      new THREE.Vector3(
        0,
        (-this.beamLength / 2) * Math.tan((this.angle * Math.PI) / 360),
        0
      ),
      new THREE.Vector3(this.beamLength / 2, 0, 0)
    );
    const bentGeo = new THREE.ExtrudeGeometry(this.section, {
      steps: 20,
      bevelEnabled: false,
      extrudePath: curve,
    });
    const count = bentGeo.attributes.position.count;
    bentGeo.setAttribute(
      'color',
      new THREE.BufferAttribute(new Float32Array(count * 3), 3)
    );
    /*      const positionAttribute = bentGeo.getAttribute( 'position' );
     */ const colorAttribute = bentGeo.getAttribute('color');
    const positions = bentGeo.attributes.position;

    const vertex = new THREE.Vector3();

    for (let i = 0; i < count; i++) {
      if (this.angle > 0) {
        if (positions.getY(i) < curve.getPoint((vertex.x + 1) / 2).y) {
          colorAttribute.setXYZ(
            i,
            this.angle / 240 + 0.2,
            0.2,
            this.angle / 240 + 0.2
          );
        } else {
          colorAttribute.setXYZ(
            i,
            0.2,
            this.angle / 240 + 0.2,
            this.angle / 240 + 0.2
          );
        }
      } else {
        if (positions.getY(i) > curve.getPoint((vertex.x + 1) / 2).y) {
          colorAttribute.setXYZ(
            i,
            -this.angle / 240 + 0.2,
            0.2,
            -this.angle / 240 + 0.2
          );
        } else {
          colorAttribute.setXYZ(
            i,
            0.2,
            -this.angle / 240 + 0.2,
            -this.angle / 240 + 0.2
          );
        }
      }
    }

    this.bendGroup.remove(this.beamMesh, this.beamLine);
    this.beamMesh.geometry.dispose();

    const bentMat = new THREE.MeshPhongMaterial({
      vertexColors: true,
      polygonOffset: true,
      polygonOffsetFactor: -1, // positive value pushes polygon further away
      polygonOffsetUnits: 1,
    });

    /* this.graphBeamMesh = new THREE.Mesh(this.straightBeamGeo,graphBeamMat);
     */ const beamEdge = new THREE.EdgesGeometry(bentGeo);
    this.beamLine.geometry = beamEdge;
    beamEdge.dispose();
    this.beamLine.material = new THREE.LineBasicMaterial({ color: 0x000000 });

    this.beamMesh = new THREE.Mesh(bentGeo, bentMat);
    this.bendGroup.add(this.beamMesh, this.beamLine);
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
              min="-59"
              max="59"
              value="0"
              step="1"
              class="slider"
              id="myRange"
              @input=${this.newBend}
            />
          </div>
        </div>
      </div>
      <p>
        ${this.english
          ? 'The plot shows internal forces: compression to the right in blue, and tension to the left in pink.'
          : 'プロットは内力を示しています。右への圧縮は青で、左への張力はピンクで示されています。'}
      </p>
    `;
  }
}
customElements.define('bender-demo', BenderDemo);
