import { LitElement, html, css, property } from 'lit-element';

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
      width: 50vw;
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
    `;
  }
}

customElements.define('civil-demo', CivilDemo);
