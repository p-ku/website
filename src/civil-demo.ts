import { LitElement, html, css, property } from 'lit-element';
import '@google/model-viewer';

class CivilDemo extends LitElement {
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
    }

    .column {
      width: 100vw;
      height: calc(100vh - var(--navbar-height) - var(--demobar-height));
    }

    model-viewer {
      --poster-color: transparent;
    }
  `;

  render() {
    return html`
      <div class="column">
        <p>Play around with the model on the right!</p>
        <p>Just watch it rotate on its own or do it yourself with the mouse</p>
        <p>You can also zoom in the model!</p>
      </div>
      <model-viewer
        class="column"
        src="../archive/Astronaut.gltf"
        alt="A 3D model of a robot"
        loading="eager"
        auto-rotate=""
        camera-controls=""
      ></model-viewer>
    `;
  }
}

customElements.define('civil-demo', CivilDemo);
