import { LitElement, html, css } from 'lit-element';
import { openWcLogo } from './open-wc-logo.js';


class MainPage extends LitElement {

  static styles = css `
  .logo > svg {
    margin-top: 72px;
    animation: app-logo-spin infinite 20s linear;
  }
  
  @keyframes app-logo-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `


  render() {
    return html`    

<div class="logo">${openWcLogo}</div>
<h1>My app</h1>

    `;
  }
}
customElements.define('main-page', MainPage);
