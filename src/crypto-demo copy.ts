import { LitElement, html, css, property } from 'lit-element';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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

  firstUpdated() {
    if (location.pathname.includes('jp')) {
      this.english = false;
      this.lang = '/jp';
    } else {
      this.english = true;
      this.lang = '';
    }
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
    h2 {
      line-height: 1em;
      text-align: left;
      margin-left: 1rem;
    }
  `;

  render() {
    return html`
      <h2>${this.english ? 'crypto, coming soon' : 'クリプト、近刊'}</h2>
    `;
  }
}

customElements.define('crypto-demo', CryptoDemo);
