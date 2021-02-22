import { writeFileSync } from 'fs';
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
  BufferGeometry,
  FrontSide,
  BackSide,
  IncrementWrapStencilOp,
  DecrementWrapStencilOp,
  Ray,
  BufferAttribute,
  Object3D,
} from 'three';
const bh = 1;
const t = 0.2;
function init() {
  const compStencilGroup1 = new Group();
  const compStencilGroup2 = new Group();
  const compPosGroup = new Group();
  const compMeshGroup = new Group();

  const tensGroup = new Group();
  const bendGroup = new Group();
  /*
  const compPos = new Mesh();
  const tensPos = new Mesh();

   const beamMeshes;
  const beamLines;
  const sectionLines;
  const compMeshes;
  const compPoss;
  const compStencils1;
  const compStencils2;
  const tensPoss;
  const tensStencils1;
  const tensStencils2; 

  const tensMeshes;
  const compLines;
  const tensLines;
*/
  const beamLength = 2;

  let sign = 1;
  console.log('huh');

  const steps = 100;
  for (let index = 0; index < steps + 1; index++) {
    const angle = ((index - steps / 2) * 1) / steps;
    const sigmaMax = -Math.atan(angle);
    const poisson = sigmaMax / 4;
    const anticlast = sigmaMax / 8;
    if (angle > 0) {
      sign = 1;
    } else {
      sign = -1;
    }

    const thtop = bh / 2 - t + poisson * (bh / 8 - (t * t) / (2 * bh)); //thickness of topflange
    const thbot = -bh / 2 + t + poisson * (bh / 8 - (t * t) / (2 * bh)); //thickness of bottomflange
    const btop = bh - bh * poisson; //width
    const bbot = bh + bh * poisson; //width
    const btop2 = bh - (bh * poisson * (bh - t)) / bh; //width at more middle part of flange
    const bbot2 = bh + (bh * poisson * (bh - t)) / bh;
    const ttop = t - (t * poisson * (bh - t)) / bh; //thickness of web
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
    if (angle == 0) {
      rayGuideTop = new Vector3(thtop, thtop, 0);
      rayGuideBot = new Vector3(thbot, thbot, 0);
    }

    const section = new Shape()
      .moveTo(-bbot / 2, -bh / 2 + anticlast) //bot
      .quadraticCurveTo(0, -bh / 2 - anticlast, bbot / 2, -bh / 2 + anticlast) //bot
      .lineTo(transTestBR.x, transTestBR.y); //bot half
    if (angle == 0) {
      section.lineTo(tbot / 2, thbot);
    } else {
      section.quadraticCurveTo(-rayGuideBot.x, rayGuideBot.y, tbot / 2, thbot);
    }

    section.lineTo(ttop / 2, thtop); //top half
    if (angle == 0) {
      section.lineTo(transTestTR.x, transTestTR.y);
    } else {
      section.quadraticCurveTo(
        -rayGuideTop.x,
        rayGuideTop.y,
        transTestTR.x,
        transTestTR.y
      );
    }

    section.lineTo(btop / 2, bh / 2 + anticlast); //top
    section.quadraticCurveTo(
      0,
      bh / 2 - anticlast,
      -btop / 2,
      bh / 2 + anticlast
    ); //top
    section.lineTo(transTestTL.x, transTestTL.y); //top half
    if (angle == 0) {
      section.lineTo(-ttop / 2, thtop); //bot half
    } else {
      section.quadraticCurveTo(rayGuideTop.x, rayGuideTop.y, -ttop / 2, thtop); //bot half
    }
    section.lineTo(-tbot / 2, thbot); //bot half
    if (angle == 0) {
      section.lineTo(transTestBL.x, transTestBL.y);
    } else {
      section.quadraticCurveTo(
        rayGuideBot.x,
        rayGuideBot.y,
        transTestBL.x,
        transTestBL.y
      );
    }
    //bot half
    section.lineTo(-bbot / 2, -bh / 2 + anticlast); //bot
    const testy = new QuadraticBezierCurve(
      new Vector2(-tbot / 2, thbot),
      new Vector2(rayGuideBot.x, rayGuideBot.y),
      new Vector2(transTestBL.x, transTestBL.y)
    );

    const curve = new QuadraticBezierCurve3(
      new Vector3(-beamLength / 2, 0, 0),
      new Vector3(0, sigmaMax, 0),
      new Vector3(beamLength / 2, 0, 0)
    );

    const curve2 = new QuadraticBezierCurve3(
      new Vector3(-0.001 / 2, 0, 0),
      new Vector3(0, 0, 0),
      new Vector3(0.001, 0, 0)
    );
    const sectionGeo = new ShapeGeometry(section);
    const sectionEdge = new EdgesGeometry(sectionGeo);
    const sectionLine = new LineSegments(
      sectionEdge,
      new LineBasicMaterial({ color: 0x000000, visible: false })
    );
    /*       sectionEdge.dispose();
     */ sectionLine.rotateY(-Math.PI / 2);
    sectionGeo.rotateY(-Math.PI / 2);

    const bentGeo = new ExtrudeGeometry(section, {
      steps: 20,
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

    for (let j = 0; j < count; j++) {
      if (angle > 0) {
        if (positions.getY(j) < curve.getPoint((vertex.x + 1) / 2).y) {
          colorAttribute.setXYZ(j, angle / 3 + 0.2, 0.2, angle / 3 + 0.2);
        } else {
          colorAttribute.setXYZ(j, 0.2, angle / 3 + 0.2, angle / 3 + 0.2);
        }
      } else {
        if (positions.getY(j) > curve.getPoint((vertex.x + 1) / 2).y) {
          colorAttribute.setXYZ(j, -angle / 3 + 0.2, 0.2, -angle / 3 + 0.2);
        } else {
          colorAttribute.setXYZ(j, 0.2, -angle / 3 + 0.2, -angle / 3 + 0.2);
        }
      }
    }

    const bentMat = new MeshPhongMaterial({
      vertexColors: true,
      polygonOffset: true,
      polygonOffsetFactor: -1, // positive value pushes polygon further away
      polygonOffsetUnits: 1,
      wireframe: false,

      visible: false,
    });
    const beamEdge = new EdgesGeometry(bentGeo);
    const beamLine = new LineSegments(
      beamEdge,
      new LineBasicMaterial({ color: 0x000000, visible: false })
    );
    /*       beamEdge.dispose();
     */
    const beamMesh = new Mesh(bentGeo, bentMat);
    beamLine.geometry.translate(0, -anticlast * 3, 0);
    beamMesh.translateY(-anticlast * 3);
    /*       const json2 = beamMesh.toJSON();
      json2.push(amlight2.toJSON()); */

    bendGroup.add(beamMesh, beamLine);
    /*     const compPosGroup = new Group();
    const tensPosGroup = new Group(); */

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
    /*     const compClipObjects = new Group();
    const tensClipObjects = new Group(); */

    /*     this.graphScene.add(clipObjects[0], clipObjects[1]);
     */
    const compClip = [
      new Plane(new Vector3(-1, -sigmaMax * 3.5, 0), 0.001),
      new Plane(new Vector3(1, 0, 0)),
    ];
    const tensClip = [
      new Plane(new Vector3(1, sigmaMax * 3.5, 0), 0.001),
      new Plane(new Vector3(-1, 0, 0)),
    ];

    /* const compClip = new Plane(new Vector3(0.1, 0.1, 0.1));
const tensClip = new Plane(new Vector3(0.01, 0.1, 1)); */
    const compMat = new MeshStandardMaterial({
      color: new Color(0.3, 0.67, 0.67),
      metalness: 0.1,
      roughness: 0.75,
      visible: false,
    });
    const tensMat = new MeshStandardMaterial({
      color: new Color(0.67, 0.3, 0.67),
      metalness: 0.1,
      roughness: 0.75,
      visible: false,
    });
    compMat.clippingPlanes = [compClip[0]];
    tensMat.clippingPlanes = [tensClip[0]];

    const compStencils = createPlaneStencilGroup(compGeo, [compClip[0]], 1);
    const tensStencils = createPlaneStencilGroup(tensGeo, [tensClip[0]], 2);

    const compPlaneMat = new MeshStandardMaterial({
      name: 'compPlaneMat',
      metalness: 0.1,
      roughness: 0.75,
      stencilWrite: true,
      stencilRef: 0,
      stencilFunc: NotEqualStencilFunc,
      stencilFail: ReplaceStencilOp,
      stencilZFail: ReplaceStencilOp,
      stencilZPass: ReplaceStencilOp,
      color: new Color(0.25, 0.5575, 0.5575),
      visible: false,
    });

    const tensPlaneMat = new MeshStandardMaterial({
      name: 'tensPlaneMat',
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

    /*       compPosGroup.add(compPos);
      tensPosGroup.add(tensPos); */

    let compMesh = new Mesh();
    let tensMesh = new Mesh();

    if (angle != 0) {
      compMesh = new Mesh(compGeo, compMat);
      compMesh.renderOrder = 6;
      tensMesh = new Mesh(tensGeo, tensMat);
      tensMesh.name = 'tensMesh';
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
    }
    /*       compMesh.translateX(0.001);
      tensMesh.translateX(-0.001);
      compPos.translateX(0.001);
      tensPos.translateX(-0.001);  */
    /*   compClipObjects.add(compMesh);
    tensClipObjects.add(tensMesh); */

    /*     compClipObjects.add(compStencils[0]);
    tensClipObjects.add(tensStencils[0]);
    compClipObjects.add(compStencils[1]);
    tensClipObjects.add(tensStencils[1]); */

    /*            this.graphScene.add(compPos, tensPos);
     */ compPos.quaternion.setFromAxisAngle(
      new Vector3(0, 0, 1),
      Math.atan(sigmaMax * 3.5)
    );
    compPos.rotateY(Math.PI / 2);
    tensPos.quaternion.setFromAxisAngle(
      new Vector3(0, 0, 1),
      Math.atan(sigmaMax * 3.5)
    );
    tensPos.rotateY(
      -Math.PI / 2
    ); /* beamLines[index] = beamLine;
    beamMeshes[index] = beamMesh;
    sectionLines[index] = sectionLine;

    compMeshes[index] = compMesh;
    compPoss[index] = compPos;
    compStencils1[index] = compStencils[0];
    compStencils2[index] = compStencils[1];
    tensMeshes[index] = tensMesh;
    tensPoss[index] = tensPos;
    tensStencils1[index] = tensStencils[0];
    tensStencils2[index] = tensStencils[1]; */ //      graphGroup.add( /* sectionLine */ );
    /*       beamMeshGroup.add(beamMesh);

    beamLineGroup.add(beamLine);   */
    /*       if (angle == 0) {compMesh.tr}
     */ /*       graphGroup.add();
     */ compStencilGroup1.add(compStencils[0]);
    compStencilGroup2.add(compStencils[1]);
    compPosGroup.add(compPos);
    compMeshGroup.add(compMesh);

    tensGroup.add(tensPos, tensStencils[0], tensStencils[1], tensMesh);
    //       this.graphScene.add(graphGroup);

    //    this.graphScene.add(/* plotPlaneLines */);
    //graphGroup.add(/* plotPlaneLines */);
    /*        beamMesh.geometry.dispose();
     */
  }
  console.log('go');

  const jsonData = compPosGroup.toJSON();
  const data = JSON.stringify(jsonData, null, 4);
  /*     let data = 'learning blahbalalal';
   */ writeFileSync('test.txt', data, err => {
    if (err) throw err;
    console.log('go');
  });
}

function createPlaneStencilGroup(geometry, plane, renderOrder) {
  const group = new Group();
  const mat0 = new MeshBasicMaterial();
  mat0.depthWrite = false;
  mat0.depthTest = false;
  mat0.colorWrite = false;
  mat0.stencilWrite = true;
  mat0.stencilFunc = AlwaysStencilFunc;
  mat0.visible = false;

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
/* init(); */
export { init };
