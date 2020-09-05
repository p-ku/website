import { LitElement, html, css } from 'lit-element';
/* import '@google/model-viewer';
 */
class CivilDemo extends LitElement {
  static styles = css`
    /* Transform the page into a 2-column grid */
    #holder {
      display: grid;
      grid-template-columns: 1fr 1fr;
      height: 100%;
    }

    /* The left grid contains the text and occupies 50% of the available space */
    #text {
      align-self: center;
      justify-self: center;
      text-align: center;
      margin: 0px 45px;
    }
  `;

  render() {
    return html`
      <span>hello</span>
      <body>
        <div id="holder">
          <div id="text">
            <h1 class="sample-text">
              Play around with the model on the right!
            </h1>
            <h1 class="sample-text">
              Just watch it rotate on its own or do it yourself with the mouse
            </h1>
            <h1 class="sample-text">You can also zoom in the model!</h1>
          </div>
          <div id="model">
            <!--             <model-viewer
              src="./Astronaut.gltf"
              alt="A 3D model of a robot"
              auto-rotate=""
              camera-controls=""
              background-color="#455A64"
            ></model-viewer> -->
          </div>
        </div>
      </body>
    `;
  }
}

customElements.define('civil-demo', CivilDemo);
