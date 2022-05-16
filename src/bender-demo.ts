import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
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
import { OrbitControls } from './OrbitControls.js';
import './contact-form.js';

export class BenderDemo extends LitElement {
  @property({ type: Boolean }) english!: boolean;

  @property({ type: Boolean }) loading = true;

  @property({ type: Number }) previous = 0;

  @property({ type: Boolean }) tester = BenderDemo.detectWebGLContext();

  @property({ attribute: false }) meshLoaded: boolean[] = [];

  @property({ attribute: false }) bendGroup: Group[] = [];

  @property({ attribute: false }) graphGroup: Group[] = [];

  @property({ attribute: false }) bendScene = new Scene();

  @property({ attribute: false }) graphScene = new Scene();

  @property({ attribute: false }) camera = new PerspectiveCamera(
    33,
    window.outerWidth / window.outerHeight,
    0.1,
    100
  );

  // @property({ attribute: false }) renderer = new WebGLRenderer({
  //   antialias: true,
  // });

  @property({ attribute: false }) renderer: any;

  // @property({ attribute: false }) renderer2 = new WebGLRenderer({
  //   antialias: true,
  // });

  @property({ attribute: false }) renderer2: any;

  // @property({ attribute: false }) controls = new OrbitControls(
  //   this.camera,
  //   this.renderer.domElement as unknown as HTMLElement
  // );
  //
  // @property({ attribute: false }) controls2 = new OrbitControls(
  //   this.camera,
  //   this.renderer2.domElement as unknown as HTMLElement
  // );

  @property({ attribute: false }) controls: any;

  @property({ attribute: false }) controls2: any;

  @property({ type: Object }) glMessage = html``;

  @property({ type: Object }) glTip = html`<p>NO WEBGL</p>`;

  static detectWebGLContext() {
    // Create canvas element. The canvas is not added to the
    // document itself, so it is never displayed in the
    // browser window.
    const canvas = document.createElement('canvas');
    // Get WebGLRenderingContext from canvas element.
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    // Report the result.
    if (gl && gl instanceof WebGLRenderingContext) return true;
    return false;
  }

  firstUpdated() {
    if (BenderDemo.detectWebGLContext()) {
      this.renderer = new WebGLRenderer({ antialias: true });
      this.renderer2 = new WebGLRenderer({ antialias: true });
      this.controls = new OrbitControls(
        this.camera,
        this.renderer.domElement as unknown as HTMLElement
      );
      this.controls2 = new OrbitControls(
        this.camera,
        this.renderer2.domElement as unknown as HTMLElement
      );
      this.init();
      this.animator();
    } else console.log('boo');
  }

  handleResize = () => {
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(
      window.outerHeight / 2.525,
      window.outerHeight / 3.03
    );
    this.renderer2.setSize(
      window.outerHeight / 2.525,
      window.outerHeight / 3.03
    );
  };

  init() {
    this.controls.enablePan = false;
    this.controls.enableDamping = true;
    this.controls.minAzimuthAngle = -Math.PI / 2;
    this.controls.maxAzimuthAngle = Math.PI / 2;
    this.controls.minPolarAngle = Math.PI / 3;
    this.controls.maxPolarAngle = (2 * Math.PI) / 3;
    this.controls2.enablePan = false;
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
    this.renderer.setSize(
      window.outerHeight / 2.525,
      window.outerHeight / 3.03
    );
    this.renderer2.setSize(
      window.outerHeight / 2.525,
      window.outerHeight / 3.03
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
    const sRoot = this.shadowRoot;
    if (sRoot != null) {
      const beamRoot = sRoot.getElementById('beam');
      const graphRoot = sRoot.getElementById('graph');
      if (beamRoot != null) beamRoot.appendChild(this.renderer.domElement);
      if (graphRoot != null) graphRoot.appendChild(this.renderer2.domElement);
    }
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

  static createPlaneStencilGroup(
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
    const angle = Number((this.sliderValue as HTMLInputElement).value);
    const steps = Number((this.sliderValue as HTMLInputElement).max);

    if (this.meshLoaded[angle] === true) {
      this.bendGroup[angle].visible = true;
      this.bendGroup[this.previous].visible = false;
      this.graphGroup[angle].visible = true;
      this.graphGroup[this.previous].visible = false;
    } else {
      this.bendGroup[angle] = new Group();
      this.graphGroup[angle] = new Group();
      const beamLength = 2;
      const bh = 1;
      const t = 0.2;

      if (angle === steps / 2) {
        const section = new Shape([
          new Vector2(-bh / 2, -bh / 2),
          new Vector2(bh / 2, -bh / 2),
          new Vector2(bh / 2, (2 * t) / 2 - bh / 2),
          new Vector2(t / 2, (2 * t) / 2 - bh / 2),
          new Vector2(t / 2, bh / 2 - (2 * t) / 2),
          new Vector2(bh / 2, bh / 2 - (2 * t) / 2),
          new Vector2(bh / 2, bh / 2),
          new Vector2(-bh / 2, bh / 2),
          new Vector2(-bh / 2, bh / 2 - (2 * t) / 2),
          new Vector2(-t / 2, bh / 2 - (2 * t) / 2),
          new Vector2(-t / 2, (2 * t) / 2 - bh / 2),
          new Vector2(-bh / 2, (2 * t) / 2 - bh / 2),
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
        const sectionEnd1 = sectionLine.clone();
        const sectionEnd2 = sectionLine.clone();
        sectionEnd1.translateZ(1.004);
        sectionEnd2.translateZ(-1.004);

        this.bendGroup[angle].add(
          sectionEnd1,
          sectionEnd2,
          beamMesh.rotateY(Math.PI / 2).translateZ(-1),
          beamLine.rotateY(Math.PI / 2).translateZ(-1)
        );
        this.graphGroup[angle].add(sectionLine);
        this.bendScene.add(this.bendGroup[angle]);
        this.graphScene.add(this.graphGroup[angle]);
        beamMesh.geometry.dispose();
        beamEdge.dispose();
      } else {
        const bendAngle = (angle - steps / 2) / steps;
        const sigmaMax = -Math.atan(bendAngle);
        const poisson = sigmaMax / 4;
        const anticlast = sigmaMax / 8;

        const thtop = bh / 2 - t + poisson * (bh / 8 - (t * t) / (2 * bh)); // thickness of top flange
        const thbot = -bh / 2 + t + poisson * (bh / 8 - (t * t) / (2 * bh)); // thickness of bottom flange
        const btop = bh - bh * poisson; // width
        const bbot = bh + bh * poisson; // width
        const btop2 = bh - (bh * poisson * (bh - t)) / bh; // width at more middle part of flange
        const bbot2 = bh + (bh * poisson * (bh - t)) / bh;
        const ttop = t - (t * poisson * (bh - t)) / bh; // thickness of web
        const tbot = t + (t * poisson * (bh - t)) / bh;

        const anticGuideBot = new QuadraticBezierCurve(
          new Vector2(-bbot / 2, -bh / 2 + anticlast),
          new Vector2(0, -bh / 2 - anticlast),
          new Vector2(bbot / 2, -bh / 2 + anticlast)
        );
        const anticGuideTop = new QuadraticBezierCurve(
          new Vector2(-btop / 2, bh / 2 + anticlast),
          new Vector2(0, bh / 2 - anticlast),
          new Vector2(btop / 2, bh / 2 + anticlast)
        );

        const anticTanBot = anticGuideBot.getTangent(0);
        const anticTanTop = anticGuideTop.getTangent(0);

        const transTestBL = anticGuideBot
          .clone()
          .getTangent(0)
          .rotateAround(new Vector2(0, 0), Math.PI / 2 + anticlast * 3)
          .multiplyScalar(thbot + bh / 2);
        const transTestTL = anticGuideTop
          .clone()
          .getTangent(0)
          .rotateAround(new Vector2(0, 0), Math.PI / 2 + anticlast * 3)
          .multiplyScalar(thtop - bh / 2);
        const transTestBR = anticGuideBot
          .clone()
          .getTangent(1)
          .rotateAround(new Vector2(0, 0), Math.PI / 2 - anticlast * 3)
          .multiplyScalar(thbot + bh / 2);
        const transTestTR = anticGuideTop
          .clone()
          .getTangent(1)
          .rotateAround(new Vector2(0, 0), Math.PI / 2 - anticlast * 3)
          .multiplyScalar(thtop - bh / 2);

        transTestBL.x -= bbot2 / 2;
        transTestTL.x -= btop2 / 2;
        transTestBR.x += bbot2 / 2;
        transTestTR.x += btop2 / 2;
        transTestBL.y -= bh / 2 - anticlast;
        transTestTL.y += bh / 2 + anticlast;
        transTestBR.y -= bh / 2 - anticlast;
        transTestTR.y += bh / 2 + anticlast;

        const rayDirBot = new Vector3(anticTanBot.x, anticTanBot.y, 0);
        const rayDirTop = new Vector3(anticTanTop.x, anticTanTop.y, 0);

        const rayGuideTop = new Vector3();
        const rayGuideBot = new Vector3();

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
        const secPoints = [
          [-bbot / 2, -bh / 2 + anticlast],
          [bbot / 2, -bh / 2 + anticlast],
          [transTestBR.x, transTestBR.y],
          [tbot / 2, thbot],
          [ttop / 2, thtop],
          [transTestTR.x, transTestTR.y],
          [btop / 2, bh / 2 + anticlast],
          [-btop / 2, bh / 2 + anticlast],
          [transTestTL.x, transTestTL.y],
          [-ttop / 2, thtop],
          [-tbot / 2, thbot],
          [transTestBL.x, transTestBL.y],
        ];
        // bot
        const section = new Shape()
          .moveTo(secPoints[0][0], secPoints[0][1]) // bot
          .quadraticCurveTo(
            0,
            -bh / 2 - anticlast,
            secPoints[1][0],
            secPoints[1][1]
          ) // bot
          .lineTo(secPoints[2][0], secPoints[2][1]) // bot half
          .quadraticCurveTo(
            -rayGuideBot.x,
            rayGuideBot.y,
            secPoints[3][0],
            secPoints[3][1]
          )
          .lineTo(secPoints[4][0], secPoints[4][1]) // top half
          .quadraticCurveTo(
            -rayGuideTop.x,
            rayGuideTop.y,
            secPoints[5][0],
            secPoints[5][1]
          )
          .lineTo(secPoints[6][0], secPoints[6][1]) // top
          .quadraticCurveTo(
            0,
            bh / 2 - anticlast,
            secPoints[7][0],
            secPoints[7][1]
          ) // top
          .lineTo(secPoints[8][0], secPoints[8][1]) // top half
          .quadraticCurveTo(
            rayGuideTop.x,
            rayGuideTop.y,
            secPoints[9][0],
            secPoints[9][1]
          ) // bot half
          .lineTo(secPoints[10][0], secPoints[10][1])
          .quadraticCurveTo(
            rayGuideBot.x,
            rayGuideBot.y,
            secPoints[11][0],
            secPoints[11][1]
          )
          // bot half
          .lineTo(secPoints[0][0], secPoints[0][1]); // bot
        this.graphGroup[steps - angle] = new Group();

        this.bendGroup[steps - angle] = new Group();

        const curve = new QuadraticBezierCurve3(
          new Vector3(-beamLength / 2, 0, 0),
          new Vector3(0, sigmaMax, 0),
          new Vector3(beamLength / 2, 0, 0)
        );

        const extrudeSteps = Math.max(Math.abs(angle - steps / 2), 7);

        const sectionGeo = new ShapeGeometry(section);
        const sectionEdge = new EdgesGeometry(sectionGeo);
        const sectionLine = new LineSegments(
          sectionEdge,
          new LineBasicMaterial({ color: 0x000000, visible: true })
        );

        sectionEdge.dispose();
        sectionLine.rotateY(-Math.PI / 2);
        sectionGeo.rotateY(-Math.PI / 2);
        const sectionEnd1 = sectionLine.clone();
        const sectionEnd2 = sectionLine.clone();

        sectionEnd1
          .translateZ(beamLength / 2 + 0.004 * Math.cos(Math.atan(sigmaMax)))
          .translateY(-anticlast * 3 - 0.004 * Math.sin(Math.atan(sigmaMax)))
          .rotateX(Math.atan(sigmaMax));
        sectionEnd2
          .translateZ(-beamLength / 2 - 0.004 * Math.cos(Math.atan(sigmaMax)))
          .translateY(-anticlast * 3 - 0.004 * Math.sin(Math.atan(sigmaMax)))
          .rotateX(Math.atan(-sigmaMax));
        const bentGeo = new ExtrudeGeometry(section, {
          steps: extrudeSteps,
          curveSegments: extrudeSteps,
          bevelEnabled: false,
          extrudePath: curve,
        });

        const { count } = bentGeo.attributes.position;
        bentGeo.setAttribute(
          'color',
          new BufferAttribute(new Float32Array(count * 3), 3)
        );

        const colorAttribute = bentGeo.getAttribute('color');
        const positions = bentGeo.attributes.position;

        const vertex = new Vector3();

        const baseGray = 0.2;
        const colorCalc = bendAngle / 3 + baseGray;
        const negColorCalc = -bendAngle / 3 + baseGray;

        for (let j = 0; j < count; j += 1) {
          if (bendAngle > 0) {
            if (positions.getY(j) < curve.getPoint((vertex.x + 1) / 2).y) {
              colorAttribute.setXYZ(j, colorCalc, 0.2, colorCalc);
            } else {
              colorAttribute.setXYZ(j, 0.2, colorCalc, colorCalc);
            }
          } else if (positions.getY(j) > curve.getPoint((vertex.x + 1) / 2).y) {
            colorAttribute.setXYZ(j, negColorCalc, 0.2, negColorCalc);
          } else {
            colorAttribute.setXYZ(j, 0.2, negColorCalc, negColorCalc);
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

        const compStencils = BenderDemo.createPlaneStencilGroup(
          compGeo,
          compClip,
          1
        );
        const tensStencils = BenderDemo.createPlaneStencilGroup(
          tensGeo,
          tensClip,
          2
        );

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

        compPos.onAfterRender = renderer => renderer.clearStencil();

        tensPos.onAfterRender = renderer => renderer.clearStencil();

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

        this.bendGroup[angle].add(sectionEnd1, sectionEnd2, beamLine, beamMesh);
        this.graphGroup[angle].add(
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

        const compStencils2 = BenderDemo.createPlaneStencilGroup(
          compGeo2,
          compClip2,
          1
        );
        const tensStencils2 = BenderDemo.createPlaneStencilGroup(
          tensGeo2,
          tensClip2,
          2
        );

        const compPlaneMat2 = compPlaneMat.clone();
        const tensPlaneMat2 = tensPlaneMat.clone();

        const compPos2 = new Mesh(new PlaneGeometry(4, 4), compPlaneMat2);
        const tensPos2 = new Mesh(new PlaneGeometry(4, 4), tensPlaneMat2);

        compPos2.onAfterRender = renderer => renderer.clearStencil();

        tensPos2.onAfterRender = renderer => renderer.clearStencil();

        compPos2.renderOrder = 1.1;
        tensPos2.renderOrder = 2.1;

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

        this.graphGroup[steps - angle].add(
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
        this.bendGroup[steps - angle] = this.bendGroup[angle]
          .clone()
          .rotateX(Math.PI);
        beamMesh.geometry.dispose();

        this.meshLoaded[steps - angle] = true;
        this.bendScene.add(
          this.bendGroup[angle],
          this.bendGroup[steps - angle]
        );
        this.graphScene.add(
          this.graphGroup[angle],
          this.graphGroup[steps - angle]
        );
      }
      this.meshLoaded[angle] = true;

      this.bendGroup[steps - angle].visible = false;
      this.graphGroup[steps - angle].visible = false;

      this.bendGroup[angle].visible = true;
      this.graphGroup[angle].visible = true;
    }
    if (typeof this.bendGroup[this.previous] !== 'undefined') {
      this.bendGroup[this.previous].visible = false;
      this.graphGroup[this.previous].visible = false;
    }

    this.previous = angle;
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
    .nogl {
      margin: auto;
    }
  `;

  get sliderValue() {
    return this.shadowRoot?.getElementById('myRange');
  }

  render() {
    return html`
      ${BenderDemo.detectWebGLContext()
        ? html` <div id="main">
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
                    max="20"
                    value="10"
                    @input=${this.newBend}
                  />
                </div>
              </div>
            </div>
            <p>
              ${this.english
                ? 'The plot shows stress in a vertical slice: compression to the right in blue, and tension to the left in pink.'
                : 'プロットは、垂直方向のスライスでの応力を示しています。青色で右に圧縮、ピンク色で左に引張られた状態を示しています。'}
            </p>`
        : html`<div class="nogl"><p>
            This demo requires
            <a href="https://en.wikipedia.org/wiki/WebGL" target="_blank">WebGL</a>.
            <p>Your browser or device <a href="https://get.webgl.org/" target="_blank">may not support</a> WebGL.</p>
          </p></div>`}
    `;
  }
}

customElements.define('bender-demo', BenderDemo);
