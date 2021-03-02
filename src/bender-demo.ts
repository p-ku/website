import { LitElement, html, css, property } from 'lit-element';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import {
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
} from 'three';

export class BenderDemo extends LitElement {
  @property({ type: Boolean }) english: boolean;

  @property({ attribute: false }) loading = true;
  @property({ attribute: false }) steps = 20;
  @property({ attribute: false }) angle = this.steps / 2;
  @property({ attribute: false }) previous = 0;
  @property({ attribute: false }) meshLoaded: boolean[] = [];
  @property({ attribute: false }) bh = 1;
  @property({ attribute: false }) t = 0.2;

  @property({ attribute: false }) beamLines: LineSegments[] = [];
  @property({ attribute: false }) beamMeshes: Mesh[] = [];
  @property({ attribute: false }) sectionLines: LineSegments[] = [];
  @property({ attribute: false }) compMeshes: Mesh[] = [];
  @property({ attribute: false }) compPoss: Mesh[] = [];
  @property({ attribute: false }) compStencils1: Mesh[] = [];
  @property({ attribute: false }) compStencils2: Mesh[] = [];
  @property({ attribute: false }) tensMeshes: Mesh[] = [];
  @property({ attribute: false }) tensPoss: Mesh[] = [];
  @property({ attribute: false }) tensStencils1: Mesh[] = [];
  @property({ attribute: false }) tensStencils2: Mesh[] = [];

  @property({ attribute: false }) bendGroup: any[] = [];
  @property({ attribute: false }) graphGroup: any[] = [];

  @property({ attribute: false }) graphBeamLine = new LineSegments();
  @property({ attribute: false }) bendScene = new Scene();
  @property({ attribute: false }) graphScene = new Scene();
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

  firstUpdated() {
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

    this.camera.lookAt(new Vector3(0, 0, 0));
    this.renderer2.localClippingEnabled = true;
    this.renderer.setSize(window.innerHeight / 2.55, window.innerHeight / 3.06);
    this.renderer2.setSize(
      window.innerHeight / 2.55,
      window.innerHeight / 3.06
    );
    const color = 0xfffde8;
    const intensity = 0.5;
    const amintensity = 1;
    const light1 = new DirectionalLight(color, intensity);
    const amlight1 = new AmbientLight(color, amintensity);
    const hemlight1 = new HemisphereLight(0xffffff, color, intensity);

    light1.position.set(0, 0, 5);
    light1.target.position.set(0, 0, 0);

    const light2 = light1.clone();
    const amlight2 = amlight1.clone();
    const hemlight2 = hemlight1.clone();

    this.bendScene.add(light1, amlight1, hemlight1);
    this.graphScene.add(light2, amlight2, hemlight2);

    const plotPlaneGeo = new PlaneGeometry(1.7, 1.7, 1);
    const plotPlaneEdge = new EdgesGeometry(plotPlaneGeo);
    const plotPlaneLines = new LineSegments(
      plotPlaneEdge,
      new LineBasicMaterial({ color: 0x000000 })
    );
    plotPlaneEdge.rotateY(Math.PI / 2);

    this.graphScene.add(plotPlaneLines);

    this.loading = false;

    window.addEventListener('resize', this.handleResize);

    this.shadowRoot
      .getElementById('beam')
      .appendChild(this.renderer.domElement);
    this.shadowRoot
      .getElementById('graph')
      .appendChild(this.renderer2.domElement);
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
    geometry: BufferGeometry,
    plane: Plane[],
    renderOrder: number
  ) {
    const group = new Group();
    const mat0 = new MeshBasicMaterial();
    mat0.depthWrite = false;
    mat0.depthTest = false;
    mat0.colorWrite = false;
    mat0.stencilWrite = true;
    mat0.stencilFunc = AlwaysStencilFunc;
    mat0.visible = true;

    const mat1 = mat0.clone();

    // back faces
    mat0.side = BackSide;
    mat0.clippingPlanes = plane;
    mat0.stencilFail = IncrementWrapStencilOp;
    mat0.stencilZFail = IncrementWrapStencilOp;
    mat0.stencilZPass = IncrementWrapStencilOp;

    const mesh0 = new Mesh(geometry, mat0);
    mesh0.renderOrder = renderOrder;
    group.add(mesh0);

    // front faces
    mat1.side = FrontSide;
    mat1.clippingPlanes = plane;
    mat1.stencilFail = DecrementWrapStencilOp;
    mat1.stencilZFail = DecrementWrapStencilOp;
    mat1.stencilZPass = DecrementWrapStencilOp;

    const mesh1 = new Mesh(geometry, mat1);
    mesh1.renderOrder = renderOrder;
    group.add(mesh1);

    return [mesh0, mesh1];
  }

  newBend() {
    this.angle = Number((this.sliderValue as HTMLInputElement).value);
    if (this.meshLoaded[this.angle] == true) {
      /*       for (let index = 0; index < this.meshes.length; index++) {
        this.meshes[index][this.angle].material.visible = true;
        this.meshes[index][this.previous].material.visible = false;
      } */
      this.bendGroup[this.angle].visible = true;
      this.bendGroup[this.previous].visible = false;
      this.graphGroup[this.angle].visible = true;
      this.graphGroup[this.previous].visible = false;
    } else {
      this.bendGroup[this.angle] = new Group();
      this.graphGroup[this.angle] = new Group();
      const beamLength = 2;
      let sign = 1;

      if (this.angle == this.steps / 2) {
        const section = new Shape([
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
        ]);
        const sectionGeo = new ShapeGeometry(section);
        const sectionEdge = new EdgesGeometry(sectionGeo);
        const sectionLine = new LineSegments(
          sectionEdge,
          new LineBasicMaterial({ color: 0x000000, visible: true })
        );
        sectionEdge.dispose();
        sectionLine.rotateY(-Math.PI / 2);
        sectionGeo.rotateY(-Math.PI / 2);
        const straightGeo = new ExtrudeGeometry(section, {
          depth: 2,
          bevelEnabled: false,
        });
        const straightMat = new MeshPhongMaterial({
          color: new Color(0.2, 0.2, 0.2),
          polygonOffset: true,
          polygonOffsetFactor: -1, // positive value pushes polygon further away
          polygonOffsetUnits: 1,
          visible: true,
        });
        const beamMesh = new Mesh(straightGeo, straightMat);
        const beamEdge = new EdgesGeometry(straightGeo);
        const beamLine = new LineSegments(
          beamEdge,
          new LineBasicMaterial({ color: 0x000000, visible: true })
        );
        this.bendGroup[this.angle].add(
          beamMesh.rotateY(Math.PI / 2).translateZ(-1),
          beamLine.rotateY(Math.PI / 2).translateZ(-1)
        );
        this.graphGroup[this.angle].add(sectionLine);
        /*         this.graphGroup[this.angle] = null;
         */ this.bendScene.add(this.bendGroup[this.angle]);
        this.graphScene.add(this.graphGroup[this.angle]);

        beamEdge.dispose();
      } else {
        const angle = (this.angle - this.steps / 2) / this.steps;
        const sigmaMax = -Math.atan(angle);
        const poisson = sigmaMax / 4;
        const anticlast = sigmaMax / 8;
        if (angle > 0) {
          sign = 1;
        } else {
          sign = -1;
        }

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
        const btop2 =
          this.bh - (this.bh * poisson * (this.bh - this.t)) / this.bh; //width at more middle part of flange
        const bbot2 =
          this.bh + (this.bh * poisson * (this.bh - this.t)) / this.bh;
        const ttop = this.t - (this.t * poisson * (this.bh - this.t)) / this.bh; //thickness of web
        const tbot = this.t + (this.t * poisson * (this.bh - this.t)) / this.bh;

        const anticGuideBot = new QuadraticBezierCurve(
          new Vector2(-bbot / 2, -this.bh / 2 + anticlast),
          new Vector2(0, -this.bh / 2 - anticlast),
          new Vector2(bbot / 2, -this.bh / 2 + anticlast)
        );
        const anticGuideTop = new QuadraticBezierCurve(
          new Vector2(-btop / 2, this.bh / 2 + anticlast),
          new Vector2(0, this.bh / 2 - anticlast),
          new Vector2(btop / 2, this.bh / 2 + anticlast)
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

        const rayDirBot = new Vector3(anticTanBot.x, anticTanBot.y, 0);
        const rayDirTop = new Vector3(anticTanTop.x, anticTanTop.y, 0);

        let rayGuideTop = new Vector3();
        let rayGuideBot = new Vector3();

        const rayTestBot = new Ray(
          new Vector3(transTestBL.x, transTestBL.y, 0),
          rayDirBot
        );
        rayTestBot.intersectPlane(
          new Plane(
            new Vector3((tbot - ttop) / 2, thtop - thbot, 0).normalize(),
            -thbot
          ),
          rayGuideBot
        );
        const rayTestTop = new Ray(
          new Vector3(transTestTL.x, transTestTL.y, 0),
          rayDirTop
        );
        rayTestTop.intersectPlane(
          new Plane(
            new Vector3((tbot - ttop) / 2, thtop - thbot, 0).normalize(),
            -thtop
          ),
          rayGuideTop
        );
        rayGuideTop = new Vector3(thtop, thtop, 0);
        rayGuideBot = new Vector3(thbot, thbot, 0);

        const section = new Shape()
          .moveTo(-bbot / 2, -this.bh / 2 + anticlast) //bot
          .quadraticCurveTo(
            0,
            -this.bh / 2 - anticlast,
            bbot / 2,
            -this.bh / 2 + anticlast
          ) //bot
          .lineTo(transTestBR.x, transTestBR.y); //bot half
        section.quadraticCurveTo(
          -rayGuideBot.x,
          rayGuideBot.y,
          tbot / 2,
          thbot
        );
        section.lineTo(ttop / 2, thtop); //top half
        section.lineTo(transTestTR.x, transTestTR.y);
        section.quadraticCurveTo(
          -rayGuideTop.x,
          rayGuideTop.y,
          transTestTR.x,
          transTestTR.y
        );
        section.lineTo(btop / 2, this.bh / 2 + anticlast); //top
        section.quadraticCurveTo(
          0,
          this.bh / 2 - anticlast,
          -btop / 2,
          this.bh / 2 + anticlast
        ); //top
        section.lineTo(transTestTL.x, transTestTL.y); //top half
        section.lineTo(-ttop / 2, thtop); //bot half
        section.quadraticCurveTo(
          rayGuideTop.x,
          rayGuideTop.y,
          -ttop / 2,
          thtop
        ); //bot half
        section.lineTo(-tbot / 2, thbot); //bot half
        section.lineTo(transTestBL.x, transTestBL.y);
        section.quadraticCurveTo(
          rayGuideBot.x,
          rayGuideBot.y,
          transTestBL.x,
          transTestBL.y
        );
        //bot half
        section.lineTo(-bbot / 2, -this.bh / 2 + anticlast); //bot

        const curve = new QuadraticBezierCurve3(
          new Vector3(-beamLength / 2, 0, 0),
          new Vector3(0, sigmaMax, 0),
          new Vector3(beamLength / 2, 0, 0)
        );

        const sectionGeo = new ShapeGeometry(section);
        const sectionEdge = new EdgesGeometry(sectionGeo);
        const sectionLine = new LineSegments(
          sectionEdge,
          new LineBasicMaterial({ color: 0x000000, visible: true })
        );
        sectionEdge.dispose();
        sectionLine.rotateY(-Math.PI / 2);
        sectionGeo.rotateY(-Math.PI / 2);
        const extrudeSteps = Math.max(Math.abs(this.angle - this.steps / 2), 7);
        const bentGeo = new ExtrudeGeometry(section, {
          steps: extrudeSteps,
          curveSegments: extrudeSteps,
          bevelEnabled: false,
          extrudePath: curve,
        });

        const count = bentGeo.attributes.position.count;
        bentGeo.setAttribute(
          'color',
          new BufferAttribute(new Float32Array(count * 3), 3)
        );

        const colorAttribute = bentGeo.getAttribute('color');
        const positions = bentGeo.attributes.position;

        const vertex = new Vector3();

        const baseGray = 0.2;
        const colorCalc = angle / 3 + baseGray;
        const negColorCalc = -angle / 3 + baseGray;

        for (let j = 0; j < count; j++) {
          if (angle > 0) {
            if (positions.getY(j) < curve.getPoint((vertex.x + 1) / 2).y) {
              colorAttribute.setXYZ(j, colorCalc, 0.2, colorCalc);
            } else {
              colorAttribute.setXYZ(j, 0.2, colorCalc, colorCalc);
            }
          } else {
            if (positions.getY(j) > curve.getPoint((vertex.x + 1) / 2).y) {
              colorAttribute.setXYZ(j, negColorCalc, 0.2, negColorCalc);
            } else {
              colorAttribute.setXYZ(j, 0.2, negColorCalc, negColorCalc);
            }
          }
        }

        const bentMat = new MeshPhongMaterial({
          vertexColors: true,
          polygonOffset: true,
          polygonOffsetFactor: -1, // positive value pushes polygon further away
          polygonOffsetUnits: 1,
          wireframe: false,
          visible: true,
        });
        const beamEdge = new EdgesGeometry(bentGeo);
        const beamLine = new LineSegments(
          beamEdge,
          new LineBasicMaterial({ color: 0x000000, visible: true })
        );
        beamEdge.dispose();
        const beamMesh = new Mesh(bentGeo, bentMat);
        beamLine.geometry.translate(0, -anticlast * 3, 0);
        beamMesh.translateY(-anticlast * 3);

        const compGeo = new ExtrudeGeometry(section, {
          depth: 1,
          bevelEnabled: false,
        });
        const tensGeo = new ExtrudeGeometry(section, {
          depth: 1,
          bevelEnabled: false,
        });
        compGeo.rotateY(Math.PI / 2);
        tensGeo.rotateY(Math.PI / 2);
        tensGeo.translate(-1, 0, 0);

        const compClip = [new Plane(new Vector3(1, sigmaMax * 3.5, 0), 0.001)];
        const tensClip = [
          new Plane(new Vector3(-1, -sigmaMax * 3.5, 0), 0.001),
        ];

        const compMat = new MeshStandardMaterial({
          color: new Color(0.3, 0.67, 0.67),
          metalness: 0.1,
          roughness: 0.75,
          visible: true,
          clippingPlanes: tensClip,
        });
        const tensMat = new MeshStandardMaterial({
          color: new Color(0.67, 0.3, 0.67),
          metalness: 0.1,
          roughness: 0.75,
          visible: true,
          clippingPlanes: compClip,
        });

        const compStencils = this.createPlaneStencilGroup(compGeo, compClip, 1);
        const tensStencils = this.createPlaneStencilGroup(tensGeo, tensClip, 2);

        const compPlaneMat = new MeshStandardMaterial({
          metalness: 0.1,
          roughness: 0.75,
          stencilWrite: true,
          stencilRef: 0,
          stencilFunc: NotEqualStencilFunc,
          stencilFail: ReplaceStencilOp,
          stencilZFail: ReplaceStencilOp,
          stencilZPass: ReplaceStencilOp,
          color: new Color(0.25, 0.5575, 0.5575),
          visible: true,
        });

        const tensPlaneMat = new MeshStandardMaterial({
          metalness: 0.1,
          roughness: 0.75,
          stencilWrite: true,
          stencilRef: 0,
          stencilFunc: NotEqualStencilFunc,
          stencilFail: ReplaceStencilOp,
          stencilZFail: ReplaceStencilOp,
          stencilZPass: ReplaceStencilOp,
          color: new Color(0.5575, 0.25, 0.5575),
          visible: true,
        });

        let compPos = new Mesh();
        let tensPos = new Mesh();

        let compMesh = new Mesh();
        let tensMesh = new Mesh();

        compMesh = new Mesh(compGeo, compMat);
        compMesh.renderOrder = 6;
        tensMesh = new Mesh(tensGeo, tensMat);
        tensMesh.renderOrder = 7;
        compPos = new Mesh(new PlaneGeometry(4, 4), compPlaneMat);
        tensPos = new Mesh(new PlaneGeometry(4, 4), tensPlaneMat);

        compPos.onAfterRender = function (renderer) {
          renderer.clearStencil();
        };
        tensPos.onAfterRender = function (renderer) {
          renderer.clearStencil();
        };

        compPos.renderOrder = 1.1;
        tensPos.renderOrder = 2.1;

        compPos.quaternion.setFromAxisAngle(
          new Vector3(0, 0, 1),
          Math.atan(sigmaMax * 3.5)
        );
        compPos.rotateY(Math.PI / 2);
        tensPos.quaternion.setFromAxisAngle(
          new Vector3(0, 0, 1),
          Math.atan(sigmaMax * 3.5)
        );
        tensPos.rotateY(-Math.PI / 2);

        this.bendGroup[this.angle].add(beamLine, beamMesh);
        this.graphGroup[this.angle].add(
          compMesh,
          tensMesh,
          tensStencils[0],
          compStencils[1],
          compStencils[0],
          tensStencils[1],
          sectionLine,
          compPos,
          tensPos
        );

        this.graphGroup[this.steps - this.angle] = new Group();

        const compClip2 = [
          new Plane(new Vector3(-1, sigmaMax * 3.5, 0), 0.001),
        ];
        const tensClip2 = [
          new Plane(new Vector3(1, -sigmaMax * 3.5, 0), 0.001),
        ];

        const compMat2 = new MeshStandardMaterial({
          color: new Color(0.3, 0.67, 0.67),
          metalness: 0.1,
          roughness: 0.75,
          visible: true,
          clippingPlanes: compClip2,
        });
        const tensMat2 = new MeshStandardMaterial({
          color: new Color(0.67, 0.3, 0.67),
          metalness: 0.1,
          roughness: 0.75,
          visible: true,
          clippingPlanes: tensClip2,
        });

        const compGeo2 = compGeo.clone().rotateX(Math.PI);
        const tensGeo2 = tensGeo.clone().rotateX(Math.PI);

        const compMesh2 = new Mesh(compGeo2, compMat2);
        const tensMesh2 = new Mesh(tensGeo2, tensMat2);
        compMesh2.renderOrder = 6;
        tensMesh2.renderOrder = 7;
        /*         const compStencils2 = this.createPlaneStencilGroup(
          compGeo2,
          compClip2,
          1
        );
        const tensStencils2 = this.createPlaneStencilGroup(
          tensGeo2,
          tensClip2,
          2
        ); */
        /*         const compStencils2 = compStencils.map(el => el.clone());
        const tensStencils2 = tensStencils.map(el => el.clone()); */
        const compStencils2 = this.createPlaneStencilGroup(
          compGeo2,
          compClip2,
          1
        );
        const tensStencils2 = this.createPlaneStencilGroup(
          tensGeo2,
          tensClip2,
          2
        );
        /*         const compPlaneMat2 = compPlaneMat.clone();
        const tensPlaneMat2 = tensPlaneMat.clone(); */

        const compPlaneMat2 = compPlaneMat.clone();
        const tensPlaneMat2 = tensPlaneMat.clone();

        const compPos2 = new Mesh(new PlaneGeometry(4, 4), compPlaneMat2);
        const tensPos2 = new Mesh(new PlaneGeometry(4, 4), tensPlaneMat2);

        compPos2.onAfterRender = function (renderer) {
          renderer.clearStencil();
        };
        tensPos2.onAfterRender = function (renderer) {
          renderer.clearStencil();
        };

        compPos2.renderOrder = 1.1;
        tensPos2.renderOrder = 2.1;
        /*         compPos.quaternion.setFromAxisAngle(
          new Vector3(0, 0, 1),
          Math.atan(sigmaMax * 3.5)
        );
        compPos.rotateY(Math.PI / 2);
        tensPos.quaternion.setFromAxisAngle(
          new Vector3(0, 0, 1),
          Math.atan(sigmaMax * 3.5)
        );       tensPos.rotateY(-Math.PI / 2);
*/
        compPos2.quaternion.setFromAxisAngle(
          new Vector3(0, 0, 1),
          Math.atan(-sigmaMax * 3.5)
        );
        compPos2.rotateY(Math.PI / 2);
        tensPos2.quaternion.setFromAxisAngle(
          new Vector3(0, 0, 1),
          Math.atan(-sigmaMax * 3.5)
        );
        tensPos2.rotateY(-Math.PI / 2);
        this.graphGroup[this.steps - this.angle].add(
          compMesh2,
          tensMesh2,
          tensStencils2[0],
          compStencils2[0],
          tensStencils2[1],
          compStencils2[1],
          sectionLine.clone().rotateX(Math.PI),
          compPos2,
          tensPos2
        );
        this.bendGroup[this.steps - this.angle] = this.bendGroup[this.angle]
          .clone()
          .rotateX(Math.PI);
        /*       beamMesh.geometry.dispose();
         */
        this.meshLoaded[this.steps - this.angle] = true;
        this.bendScene.add(
          this.bendGroup[this.angle],
          this.bendGroup[this.steps - this.angle]
        );
        this.graphScene.add(
          this.graphGroup[this.angle],
          this.graphGroup[this.steps - this.angle]
        );
      }
      this.meshLoaded[this.angle] = true;
      /* */
      this.bendGroup[this.steps - this.angle].visible = false;
      this.graphGroup[this.steps - this.angle].visible = false;

      this.bendGroup[this.angle].visible = true;
      this.graphGroup[this.angle].visible = true;
    }
    if (typeof this.bendGroup[this.previous] !== 'undefined') {
      this.bendGroup[this.previous].visible = false;
      this.graphGroup[this.previous].visible = false;
    }

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
              class=${this.loading ? 'slider disabled' : 'slider'}
              type="range"
              min="0"
              max="${this.steps}"
              value="${this.steps / 2}"
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
