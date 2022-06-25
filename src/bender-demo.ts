import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import {
  LineSegments,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  DirectionalLight,
  AmbientLight,
  HemisphereLight,
  EdgesGeometry,
  LineBasicMaterial,
  PlaneGeometry,
} from 'three';
import { OrbitControls } from './OrbitControls.js';
import './contact-form.js';
import { BendPlots } from './BendPlots.js';

export class BenderDemo extends LitElement {
  @property({ type: Boolean }) english!: boolean;

  @property({ type: Boolean }) loading = true;

  @property({ type: Number }) previous = 10;

  @property({ type: Boolean }) webGLCapable = false;

  @property({ attribute: false }) bendGroup: any;

  @property({ attribute: false }) graphGroup: any;

  @property({ attribute: false }) bendScene: any;

  @property({ attribute: false }) graphScene: any;

  @property({ attribute: false }) camera = new PerspectiveCamera(
    33,
    window.outerWidth / window.outerHeight,
    0.1,
    100
  );

  @property({ attribute: false }) renderer: any;

  @property({ attribute: false }) renderer2: any;

  @property({ attribute: false }) controls: any;

  @property({ attribute: false }) controls2: any;

  constructor() {
    super();
    // Test for webGL
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl && gl instanceof WebGLRenderingContext) this.webGLCapable = true;
    else this.webGLCapable = false;
  }

  async firstUpdated() {
    if (this.webGLCapable) {
      this.renderer = new WebGLRenderer({ antialias: true });
      this.renderer2 = new WebGLRenderer({ antialias: true });
      this.renderer.setSize(
        window.outerHeight / 2.525,
        window.outerHeight / 3.03
      );
      this.renderer2.setSize(
        window.outerHeight / 2.525,
        window.outerHeight / 3.03
      );
      this.controls = new OrbitControls(
        this.camera,
        this.renderer.domElement as unknown as HTMLElement
      );
      this.controls2 = new OrbitControls(
        this.camera,
        this.renderer2.domElement as unknown as HTMLElement
      );

      await new Promise(r => setTimeout(r, 0));
      this.init();
      this.loading = false;

      this.bendGroup[10].visible = true;
      this.graphGroup[10].visible = true;
      this.animator();
      const steps = Number((this.sliderValue as HTMLInputElement).max);
      this.bendGroup[steps / 2].visible = true;
      this.graphGroup[steps / 2].visible = true;
    }
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
    window.addEventListener('resize', this.handleResize);
    const sRoot = this.shadowRoot;
    if (sRoot != null) {
      const beamRoot = sRoot.getElementById('beam');
      const graphRoot = sRoot.getElementById('graph');
      if (beamRoot != null) beamRoot.appendChild(this.renderer.domElement);
      if (graphRoot != null) graphRoot.appendChild(this.renderer2.domElement);
    } else {
      return;
    }

    const bendLoad = new BendPlots();

    this.bendGroup = bendLoad.bendGroup;
    this.graphGroup = bendLoad.graphGroup;
    this.bendScene = bendLoad.bendScene;
    this.graphScene = bendLoad.graphScene;

    this.bendScene.background = new Color(0xfffde8);
    this.graphScene.background = new Color(0xfffde8);
    this.camera.aspect = 3 / 2.5;
    this.camera.updateProjectionMatrix();
    this.camera.position.set(2, 2, 3.2);

    this.renderer2.localClippingEnabled = true;

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

  newBend() {
    const angle = Number((this.sliderValue as HTMLInputElement).value);

    this.bendGroup[angle].visible = true;
    this.bendGroup[this.previous].visible = false;
    this.graphGroup[angle].visible = true;
    this.graphGroup[this.previous].visible = false;

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
      text-align: center;
      margin: 0 auto;
      justify-content: flex-start;
      width: 100%;
      height: 100%;
      text-align: center;
      flex-direction: column;
      max-width: 800px;
      flex-grow: 1;
      align-items: center;
    }

    p {
      max-width: 80vw;
      align-self: center;
    }

    label {
      white-space: nowrap;
    }

    .slider {
      display: flex;
      border-radius: 14px;
      background: #ffc342;
      width: 100%;
      height: 14px;
      -webkit-appearance: none;
      outline: none;
      margin: 1em;
    }

    #smile {
      display: flex;
      box-sizing: border-box;
      resize: none;
      width: 90%;
      font-family: inherit;
      color: #321e00;
      background: rgba(255, 253, 232, 0.8);
      font-size: 21px;
      align-items: center;
      padding-top: 1em;
    }
    .disabled {
      pointer-events: none;
      display: none;
    }
    .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #321e00;
      cursor: pointer;
      align-items: center;
      align-content: center;
      justify-content: center;
      -webkit-box-shadow: none;
      box-shadow: none;
    }
    .slider::-moz-range-thumb {
      width: 36px;
      height: 36px;
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
    #loadingNote {
      color: #ffc342;
      margin-top: 10vh;
    }
  `;

  get sliderValue() {
    return this.shadowRoot?.getElementById('myRange');
  }

  render() {
    return html`
      ${this.webGLCapable
        ? html`
            <div id="main">
              <h1 id="loadingNote" class=${this.loading ? '' : 'disabled'}>
                loading...
              </h1>
              <div id="beam"></div>
              <div id="graph"></div>
              <div id="smile">
                <label class=${this.loading ? 'disabled' : ''} for="myRange"
                  >:(</label
                >
                <input
                  id="myRange"
                  class=${this.loading ? 'slider disabled' : 'slider'}
                  type="range"
                  min="0"
                  max="20"
                  value="10"
                  @input=${this.newBend}
                />
                <label class=${this.loading ? 'disabled' : ''} for="myRange"
                  >(:</label
                >
              </div>
              <p class=${this.loading ? 'disabled' : ''}>
                ${this.english
                  ? 'The plot shows stress in a vertical slice: compression to the right in blue, and tension to the left in pink.'
                  : 'プロットは、垂直方向のスライスでの応力を示しています。青色で右に圧縮、ピンク色で左に引張られた状態を示しています。'}
              </p>
            </div>
          `
        : html`<div class="nogl"><p>
            This demo requires
            <a href="https://en.wikipedia.org/wiki/WebGL" target="_blank">WebGL</a>.</p>
            <p>Your browser or device <a href="https://get.webgl.org/" target="_blank">may not support</a> WebGL.</p>
          </p></div>`}
    `;
  }
}

customElements.define('bender-demo', BenderDemo);
