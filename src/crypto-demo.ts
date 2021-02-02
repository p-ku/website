import { LitElement, html, css, property } from 'lit-element';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { normalize } from 'path';
import('@dimforge/rapier3d').then(RAPIER => {
  const gravity = new RAPIER.Vector3(0.0, -9.81, 0.0);
  const world = new RAPIER.World(gravity);

  // Create the ground
  const groundRigidBodyDesc = new RAPIER.RigidBodyDesc(
    RAPIER.BodyStatus.Static
  );
  const groundRigidBody = world.createRigidBody(groundRigidBodyDesc);
  const groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 0.1, 10.0);
  world.createCollider(groundColliderDesc, groundRigidBody.handle);

  // Create a dynamic rigid-body.
  // Use "static" for a static rigid-body instead.
  const rigidBodyDesc = new RAPIER.RigidBodyDesc(
    RAPIER.BodyStatus.Dynamic
  ).setTranslation(new RAPIER.Vector3(0.0, 1.0, 0.0));
  const rigidBody = world.createRigidBody(rigidBodyDesc);

  // Create a cuboid collider attached to rigidBody.
  const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5).setDensity(
    2.0
  ); // The default density is 1.0.
  const collider = world.createCollider(colliderDesc, rigidBody.handle);

  // Game loop. Replace by your own game loop system.
  const gameLoop = () => {
    world.step();

    // Get and print the rigid-body's position.
    const position = rigidBody.translation();
    console.log('Rigid-body position: ', position.x, position.y, position.z);

    setTimeout(gameLoop, 16);
  };

  gameLoop();
});
class CryptoDemo extends LitElement {
  @property({ type: String }) lang = '';
  @property({ type: Boolean }) english = true;
  @property({ attribute: false }) scene = new THREE.Scene();
  @property({ attribute: false }) camera = new THREE.PerspectiveCamera(
    33,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  @property({ attribute: false }) renderer = new THREE.WebGLRenderer();

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
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
  };

  init() {
    this.camera.position.z = 10;
    this.scene.background = new THREE.Color(0xfffde8);

    /*    this.controls.target.set(0, 0, 0);
    this.controls.update(); */

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    this.shadowRoot
      .getElementById('main')
      .appendChild(this.renderer.domElement);

    //

    const h = 2,
      b = 1,
      tf = 0.1,
      tw = 0.1;

    const shape = new THREE.Shape();
    const angle = 45;
    shape.moveTo(-b / 2, 0);
    shape.lineTo(b / 2, 0);
    shape.lineTo(b / 2, tf);
    shape.lineTo(tw / 2, tf);
    shape.lineTo(tw / 2, h - tf);
    shape.lineTo(b / 2, h - tf);
    shape.lineTo(b / 2, h);
    shape.lineTo(-b / 2, h);
    shape.lineTo(-b / 2, h - tf);
    shape.lineTo(-tw / 2, h - tf);
    shape.lineTo(-tw / 2, tf);
    shape.lineTo(-b / 2, tf);
    shape.lineTo(-b / 2, 0);
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-2, 0, 0),
      new THREE.Vector3(0, -2 * Math.tan((angle * Math.PI) / 360), 0),
      new THREE.Vector3(2, 0, 0)
    );
    const uvtest = THREE.ExtrudeGeometry.WorldUVGenerator;

    const extrudeSettings = {
      steps: 10,
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
    const normalizer = new THREE.Vector3(1, 0, 1);
    for (let i = 0; i < geometry.faces.length; i++) {
      const face = geometry.faces[i];
      face.color.setRGB(
        geometry.vertices[face.b].x,
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
    const mesh = new THREE.Mesh(geometry, material3);

    this.scene.add(mesh);
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
  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      max-width: 960px;
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
      max-width: 960px;
      max-height: 100%;
      color: #321e00;
      margin: 0 auto;
    }
    svg {
      display: flex;
    }
  `;

  render() {
    return html`
      <div id="main">
        <h2>${this.english ? 'bender' : 'ベンダー'}</h2>
      </div>
    `;
  }
}
customElements.define('crypto-demo', CryptoDemo);
