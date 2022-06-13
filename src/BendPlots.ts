import {
  Mesh,
  Plane,
  Vector2,
  Vector3,
  MeshPhongMaterial,
  MeshStandardMaterial,
  Group,
  ExtrudeGeometry,
  LineSegments,
  Shape,
  Color,
  QuadraticBezierCurve,
  QuadraticBezierCurve3,
  EdgesGeometry,
  ShapeGeometry,
  LineBasicMaterial,
  PlaneGeometry,
  NotEqualStencilFunc,
  ReplaceStencilOp,
  Ray,
  BufferAttribute,
  BufferGeometry,
  MeshBasicMaterial,
  AlwaysStencilFunc,
  IncrementWrapStencilOp,
  FrontSide,
  BackSide,
  DecrementWrapStencilOp,
  Scene,
} from 'three';

export class BendPlots {
  bendGroup: Group[] = [];

  graphGroup: Group[] = [];

  bendScene = new Scene();

  graphScene = new Scene();

  constructor() {
    const steps = 20;
    const bh = 1;
    const t = 0.2;
    const beamLength = 2;

    const bentMat = new MeshPhongMaterial({
      vertexColors: true,
      polygonOffset: true,
      polygonOffsetFactor: -1, // positive value pushes polygon further away
      polygonOffsetUnits: 1,
      wireframe: false,
      visible: true,
    });
    for (let angle = 0; angle < steps / 2; angle += 1) {
      this.bendGroup[angle] = new Group();
      this.graphGroup[angle] = new Group();

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

      const extrudeSteps = Math.round(20 * Math.sqrt(Math.abs(bendAngle)));
      const curveSteps = Math.round(extrudeSteps / 2);

      const sectionGeo = new ShapeGeometry(section);
      const sectionEdge = new EdgesGeometry(sectionGeo);
      const sectionLine = new LineSegments(
        sectionEdge,
        new LineBasicMaterial({ color: 0x000000, visible: true })
      );

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
        curveSegments: curveSteps,
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

      const beamEdge = new EdgesGeometry(bentGeo);
      const beamLine = new LineSegments(
        beamEdge,
        new LineBasicMaterial({ color: 0x000000, visible: true })
      );

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
      const tensClip = [new Plane(new Vector3(-1, -sigmaMax * 3.5, 0), 0.001)];

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

      const compStencils = BendPlots.buildStencil(compGeo, compClip, 1);
      const tensStencils = BendPlots.buildStencil(tensGeo, tensClip, 2);

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

      const compClip2 = [new Plane(new Vector3(-1, sigmaMax * 3.5, 0), 0.001)];
      const tensClip2 = [new Plane(new Vector3(1, -sigmaMax * 3.5, 0), 0.001)];

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

      const compStencils2 = BendPlots.buildStencil(compGeo2, compClip2, 1);
      const tensStencils2 = BendPlots.buildStencil(tensGeo2, tensClip2, 2);

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

      this.bendScene.add(this.bendGroup[angle], this.bendGroup[steps - angle]);
      this.graphScene.add(
        this.graphGroup[angle],
        this.graphGroup[steps - angle]
      );

      this.bendGroup[steps - angle].visible = false;
      this.graphGroup[steps - angle].visible = false;

      this.bendGroup[angle].visible = false;
      this.graphGroup[angle].visible = false;
      beamMesh.geometry.dispose();
      beamEdge.dispose();
      bentMat.dispose();
      bentGeo.dispose();
      compMat.dispose();
      compMat2.dispose();
      compGeo.dispose();
      compGeo2.dispose();
      tensGeo.dispose();
      tensGeo2.dispose();
      tensMat.dispose();
      tensMat2.dispose();
      sectionGeo.dispose();
      sectionEdge.dispose();
    }

    const straighAng = steps / 2;
    this.bendGroup[straighAng] = new Group();
    this.graphGroup[straighAng] = new Group();
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

    this.bendGroup[straighAng].add(
      sectionEnd1,
      sectionEnd2,
      beamMesh.rotateY(Math.PI / 2).translateZ(-1),
      beamLine.rotateY(Math.PI / 2).translateZ(-1)
    );
    this.graphGroup[straighAng].add(sectionLine);
    this.bendScene.add(this.bendGroup[straighAng]);
    this.graphScene.add(this.graphGroup[straighAng]);

    sectionEdge.dispose();
    beamMesh.geometry.dispose();
    beamEdge.dispose();
    straightGeo.dispose();
    sectionGeo.dispose();
  }

  static buildStencil(
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
}
