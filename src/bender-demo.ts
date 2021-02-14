import { LitElement, html, css, property } from 'lit-element';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { threadId } from 'worker_threads';
import { Plane, Vector2, Vector3 } from 'three';

class BenderDemo extends LitElement {
  @property({ type: String }) lang = '';
  @property({ type: Boolean }) english = true;

  @property({ attribute: false }) angle = 0;
  @property({ attribute: false }) bendGroup = new THREE.Group();
  @property({ attribute: false }) graphGroup = new THREE.Group();

  @property({ attribute: false }) pos = [new THREE.Mesh(), new THREE.Mesh()];
  @property({ attribute: false }) flangeTopMesh = new THREE.Mesh();
  @property({ attribute: false }) flangeBotMesh = new THREE.Mesh();

  @property({ attribute: false }) baseMat = new THREE.MeshBasicMaterial({
    depthWrite: false,
    depthTest: false,
    colorWrite: false,
    stencilWrite: true,
    stencilFunc: THREE.AlwaysStencilFunc,
  });
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
    new THREE.Plane(new THREE.Vector3(-1, this.angle, 0)),
    new THREE.Plane(new THREE.Vector3(1, 0, 0)),
  ];
  @property({ attribute: false }) tensClip = [
    new THREE.Plane(new THREE.Vector3(1, -this.angle, 0)),
    new THREE.Plane(new THREE.Vector3(-1, 0, 0)),
  ];
  @property({ attribute: false }) clipPlanes = [this.compClip, this.tensClip];

  @property({ attribute: false }) beamLength = 2;
  @property({ attribute: false }) graphMat = [
    new THREE.MeshStandardMaterial(),
    new THREE.MeshStandardMaterial(),
  ];

  /*   @property({ attribute: false }) section = new THREE.Shape([
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
  ]); */
  @property({ attribute: false }) bh = 1;
  @property({ attribute: false }) t = 0.2;

  @property({ attribute: false }) section = new THREE.Shape([
    new THREE.Vector2(-this.bh / 2, -this.bh / 2),
    new THREE.Vector2(this.bh / 2, -this.bh / 2),
    new THREE.Vector2(this.bh / 2, (2 * this.t) / 2 - this.bh / 2),
    new THREE.Vector2(this.t / 2, (2 * this.t) / 2 - this.bh / 2),
    new THREE.Vector2(this.t / 2, this.bh / 2 - (2 * this.t) / 2),
    new THREE.Vector2(this.bh / 2, this.bh / 2 - (2 * this.t) / 2),
    new THREE.Vector2(this.bh / 2, this.bh / 2),
    new THREE.Vector2(-this.bh / 2, this.bh / 2),
    new THREE.Vector2(-this.bh / 2, this.bh / 2 - (2 * this.t) / 2),
    new THREE.Vector2(-this.t / 2, this.bh / 2 - (2 * this.t) / 2),
    new THREE.Vector2(-this.t / 2, (2 * this.t) / 2 - this.bh / 2),
    new THREE.Vector2(-this.bh / 2, (2 * this.t) / 2 - this.bh / 2),
    new THREE.Vector2(-this.bh / 2, -this.bh / 2),
  ]);

  @property({ attribute: false }) straightBeamGeo = new THREE.ExtrudeGeometry(
    this.section,
    {
      depth: 2,
      bevelEnabled: false,
    }
  );

  @property({ attribute: false }) beamLine = new THREE.LineSegments();
  @property({ attribute: false }) graphBeamLine = new THREE.LineSegments();
  @property({ attribute: false }) graphBeamMesh = new THREE.Mesh();
  @property({ attribute: false }) beamMesh = new THREE.Mesh();
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
    this.renderer.setSize(window.innerHeight / 2.55, window.innerHeight / 3.06);
    this.renderer2.setSize(
      window.innerHeight / 2.55,
      window.innerHeight / 3.06
    );
  };

  init() {
    window.addEventListener('resize', this.handleResize);
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
    this.bendScene.background = new THREE.Color(0xfffde8);
    this.graphScene.background = new THREE.Color(0xfffde8);
    this.camera.aspect = 3 / 2.5;
    this.camera.updateProjectionMatrix();
    this.renderer2.localClippingEnabled = true;
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
    /*     const plotPlaneMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('rgb(255, 255, 255)'),
      opacity: 0.4,
      transparent: true,
      side: THREE.DoubleSide,
    }); */
    /*     const plotPlaneMesh = new THREE.Mesh(plotPlaneGeo, plotPlaneMat);
     */ const plotPlaneEdge = new THREE.EdgesGeometry(plotPlaneGeo);
    const plotPlaneLines = new THREE.LineSegments(
      plotPlaneEdge,
      new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    /*     plotPlaneMesh.rotateY(Math.PI / 2);
     */ plotPlaneEdge.rotateY(Math.PI / 2);
    const sectionGeo = new THREE.ShapeGeometry(this.section);
    const sectionEdge = new THREE.EdgesGeometry(sectionGeo);
    const sectionLine = new THREE.LineSegments(
      sectionEdge,
      new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    sectionLine.rotateY(-Math.PI / 2);
    sectionGeo.rotateY(-Math.PI / 2);

    const beamMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color(0.2, 0.2, 0.2),
      polygonOffset: true,
      polygonOffsetFactor: -1, // positive value pushes polygon further away
      polygonOffsetUnits: 1,
    });

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

    this.graphScene.add(this.clipObjects[0], this.clipObjects[1]);
    const stencilGroup = [];
    for (let i = 0; i < 2; i++) {
      const plane = this.clipPlanes[i];
      stencilGroup[i] = this.createPlaneStencilGroup(
        graphGeos[i],
        [plane],
        1 + i,
        i
      ); // plane is clipped by the other clipping planes
      planeMats[i] = new THREE.MeshStandardMaterial({
        metalness: 0.1,
        roughness: 0.75,
        stencilWrite: true,
        stencilRef: 0,
        stencilFunc: THREE.NotEqualStencilFunc,
        stencilFail: THREE.ReplaceStencilOp,
        stencilZFail: THREE.ReplaceStencilOp,
        stencilZPass: THREE.ReplaceStencilOp,
      });

      this.pos[i] = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), planeMats[i]);

      this.pos[i].onAfterRender = function (renderer) {
        renderer.clearStencil();
      };

      this.pos[i].renderOrder = 1.1 + i;

      poGroups[i].add(this.pos[i]);
      planeObjects[i] = this.pos[i];

      this.graphMat[i] = new THREE.MeshStandardMaterial({
        color: 0xffc107,
        metalness: 0.1,
        roughness: 0.75,
        clippingPlanes: [this.clipPlanes[i][0]],
        clipShadows: true,
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

    this.clipObjects[0].add(stencilGroup[0]);
    this.clipObjects[1].add(stencilGroup[1]);

    this.graphScene.add(this.pos[0], this.pos[1]);
    this.clipObjects[0].add(graphMesh[0]);
    this.clipObjects[1].add(graphMesh[1]);

    this.bendScene.add(this.bendGroup);

    this.camera.position.set(2, 2, 3.2);
    /*     this.camera.position.set(3, 0, 0);
     */
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.graphScene.add(sectionLine, plotPlaneLines);
    this.newBend();
  }

  animator() {
    requestAnimationFrame(() => {
      this.animator();
    });

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
    const sigmaMax = Math.atan(this.angle);

    const poisson = sigmaMax / 4;
    const anticlast = sigmaMax / 8;

    const thtop =
      this.bh / 2 -
      this.t +
      poisson * (this.bh / 8 - (this.t * this.t) / (2 * this.bh)); //thickness of topflange
    const thbot =
      -this.bh / 2 +
      this.t +
      poisson * (this.bh / 8 - (this.t * this.t) / (2 * this.bh)); //thickness of bottomflange
    const btop = this.bh - this.bh * poisson; //width
    const bbot = this.bh + this.bh * poisson; //width
    const btop2 = this.bh - (this.bh * poisson * (this.bh - this.t)) / this.bh; //width at more middle part of flange
    const bbot2 = this.bh + (this.bh * poisson * (this.bh - this.t)) / this.bh;
    const ttop = this.t - (this.t * poisson * (this.bh - this.t)) / this.bh; //thickness of web
    const tbot = this.t + (this.t * poisson * (this.bh - this.t)) / this.bh;

    const anticGuideBot = new THREE.QuadraticBezierCurve(
      new THREE.Vector2(-bbot / 2, -this.bh / 2 + anticlast),
      new THREE.Vector2(0, -this.bh / 2 - anticlast),
      new THREE.Vector2(bbot / 2, -this.bh / 2 + anticlast)
    );
    const anticGuideTop = new THREE.QuadraticBezierCurve(
      new THREE.Vector2(-btop / 2, this.bh / 2 + anticlast),
      new THREE.Vector2(0, this.bh / 2 - anticlast),
      new THREE.Vector2(btop / 2, this.bh / 2 + anticlast)
    );

    const anticTanBot = anticGuideBot.getTangent(0);
    const anticTanTop = anticGuideTop.getTangent(0);

    const transTestBL = anticGuideBot
      .clone()
      .getTangent(0)
      .rotateAround(new Vector2(0, 0), Math.PI / 2 + anticlast * 3)
      .multiplyScalar(thbot + this.bh / 2);
    const transTestTL = anticGuideTop
      .clone()
      .getTangent(0)
      .rotateAround(new Vector2(0, 0), Math.PI / 2 + anticlast * 3)
      .multiplyScalar(thtop - this.bh / 2);
    const transTestBR = anticGuideBot
      .clone()
      .getTangent(1)
      .rotateAround(new Vector2(0, 0), Math.PI / 2 - anticlast * 3)
      .multiplyScalar(thbot + this.bh / 2);
    const transTestTR = anticGuideTop
      .clone()
      .getTangent(1)
      .rotateAround(new Vector2(0, 0), Math.PI / 2 - anticlast * 3)
      .multiplyScalar(thtop - this.bh / 2);

    transTestBL.x -= bbot2 / 2;
    transTestTL.x -= btop2 / 2;
    transTestBR.x += bbot2 / 2;
    transTestTR.x += btop2 / 2;
    transTestBL.y -= this.bh / 2 - anticlast;
    transTestTL.y += this.bh / 2 + anticlast;
    transTestBR.y -= this.bh / 2 - anticlast;
    transTestTR.y += this.bh / 2 + anticlast;

    const rayDirBot = new THREE.Vector3(anticTanBot.x, anticTanBot.y, 0);
    const rayDirTop = new THREE.Vector3(anticTanTop.x, anticTanTop.y, 0);

    let rayGuideTop = new THREE.Vector3();
    let rayGuideBot = new THREE.Vector3();

    const rayTestBot = new THREE.Ray(
      new THREE.Vector3(transTestBL.x, transTestBL.y, 0),
      rayDirBot
    );
    rayTestBot.intersectPlane(
      new THREE.Plane(
        new THREE.Vector3((tbot - ttop) / 2, thtop - thbot, 0).normalize(),
        -thbot
      ),
      rayGuideBot
    );
    const rayTestTop = new THREE.Ray(
      new THREE.Vector3(transTestTL.x, transTestTL.y, 0),
      rayDirTop
    );
    rayTestTop.intersectPlane(
      new THREE.Plane(
        new THREE.Vector3((tbot - ttop) / 2, thtop - thbot, 0).normalize(),
        -thtop
      ),
      rayGuideTop
    );
    if (this.angle == 0) {
      rayGuideTop = new THREE.Vector3(thtop, thtop, 0);
      rayGuideBot = new THREE.Vector3(thbot, thbot, 0);
    }

    this.section = new THREE.Shape()
      .moveTo(-bbot / 2, -this.bh / 2 + anticlast) //bot
      .quadraticCurveTo(
        0,
        -this.bh / 2 - anticlast,
        bbot / 2,
        -this.bh / 2 + anticlast
      ) //bot
      .lineTo(transTestBR.x, transTestBR.y) //bot half
      .quadraticCurveTo(-rayGuideBot.x, rayGuideBot.y, tbot / 2, thbot)
      /* .lineTo((this.t-(this.t-tbot)/3)/2,-(thtop-thbot)/6)
.lineTo((this.t+(this.t-tbot)/3)/2,+(thtop-thbot)/6) */
      .lineTo(ttop / 2, thtop) //top half
      .quadraticCurveTo(
        -rayGuideTop.x,
        rayGuideTop.y,
        transTestTR.x,
        transTestTR.y
      )
      .lineTo(btop / 2, this.bh / 2 + anticlast) //top
      .quadraticCurveTo(
        0,
        this.bh / 2 - anticlast,
        -btop / 2,
        this.bh / 2 + anticlast
      ) //top
      .lineTo(transTestTL.x, transTestTL.y) //top half
      .quadraticCurveTo(rayGuideTop.x, rayGuideTop.y, -ttop / 2, thtop) //bot half
      /*        .lineTo((-this.t+(this.t-tbot)/3)/2,-(thtop-thbot)/6)
       .lineTo((-this.t-(this.t-tbot)/3)/2,+(thtop-thbot)/6) */
      .lineTo(-tbot / 2, thbot) //bot half
      .quadraticCurveTo(
        rayGuideBot.x,
        rayGuideBot.y,
        transTestBL.x,
        transTestBL.y
      ) //bot half
      .lineTo(-bbot / 2, -this.bh / 2 + anticlast); //bot
    const testy = new THREE.QuadraticBezierCurve(
      new THREE.Vector2(-tbot / 2, thbot),
      new THREE.Vector2(rayGuideBot.x, rayGuideBot.y),
      new THREE.Vector2(transTestBL.x, transTestBL.y)
    );
    /*       console.log('curve');
      console.log(testy.getLength());
      console.log('bbot2');
      console.log(bbot2/2-tbot/2);
      console.log(anticlast);
 */

    this.graphMat[0].clippingPlanes = [
      new THREE.Plane(new THREE.Vector3(-1, sigmaMax, 0), 0.001),
      new THREE.Plane(new THREE.Vector3(1, 0, 0)),
    ];
    this.graphMat[1].clippingPlanes = [
      new THREE.Plane(new THREE.Vector3(1, -sigmaMax, 0), 0.001),
      new THREE.Plane(new THREE.Vector3(-1, 0, 0)),
    ];

    for (let i = 0; i < 2; i++) {
      if (this.angle == 0) {
        this.graphMat[i].visible = false;
        this.pos[i].visible = false;
      } else {
        this.graphMat[i].visible = true;
        this.pos[i].visible = true;
      }

      this.mat0[i].clippingPlanes = [
        new THREE.Plane(new THREE.Vector3(1, -sigmaMax, 0)),
      ];
      this.mat1[i].clippingPlanes = [
        new THREE.Plane(new THREE.Vector3(1, -sigmaMax, 0)),
      ];

      this.pos[i].quaternion.setFromAxisAngle(
        new THREE.Vector3(0, 0, 1),
        Math.atan(-sigmaMax)
      );
      this.pos[i].rotateY(Math.PI / 2 + i * Math.PI);
    }

    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-this.beamLength / 2, 0, 0),
      new THREE.Vector3(0, sigmaMax, 0),
      new THREE.Vector3(this.beamLength / 2, 0, 0)
    );

    const curve2 = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.001 / 2, 0, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.001, 0, 0)
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

    const colorAttribute = bentGeo.getAttribute('color');
    const positions = bentGeo.attributes.position;

    const vertex = new THREE.Vector3();

    for (let i = 0; i < count; i++) {
      if (this.angle > 0) {
        if (positions.getY(i) < curve.getPoint((vertex.x + 1) / 2).y) {
          colorAttribute.setXYZ(
            i,
            this.angle / 3 + 0.2,
            0.2,
            this.angle / 3 + 0.2
          );
        } else {
          colorAttribute.setXYZ(
            i,
            0.2,
            this.angle / 3 + 0.2,
            this.angle / 3 + 0.2
          );
        }
      } else {
        if (positions.getY(i) > curve.getPoint((vertex.x + 1) / 2).y) {
          colorAttribute.setXYZ(
            i,
            -this.angle / 3 + 0.2,
            0.2,
            -this.angle / 3 + 0.2
          );
        } else {
          colorAttribute.setXYZ(
            i,
            0.2,
            -this.angle / 3 + 0.2,
            -this.angle / 3 + 0.2
          );
        }
      }
    }

    this.bendGroup.remove(
      this.beamMesh,
      this.beamLine,
      this.flangeBotMesh,
      this.flangeTopMesh
    );
    this.beamMesh.geometry.dispose();

    const bentMat = new THREE.MeshPhongMaterial({
      vertexColors: true,
      polygonOffset: true,
      polygonOffsetFactor: -1, // positive value pushes polygon further away
      polygonOffsetUnits: 1,
      wireframe: false,
    });
    const beamEdge = new THREE.EdgesGeometry(bentGeo);
    this.beamLine.geometry = beamEdge;
    beamEdge.dispose();
    this.beamLine.material = new THREE.LineBasicMaterial({ color: 0x000000 });

    this.beamMesh = new THREE.Mesh(bentGeo, bentMat);
    this.beamLine.geometry.translate(0, -anticlast * 3, 0);
    this.beamMesh.translateY(-anticlast * 3);
    this.bendGroup.add(this.beamMesh, this.beamLine, this.beamMesh);
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
              min="-0.5"
              max="0.5"
              value="0"
              step="0.01"
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
