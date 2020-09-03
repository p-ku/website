import { LitElement, html, css } from 'lit-element';

class MainPage extends LitElement {
  static styles = css`
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
  `;

  render() {
    return html` <h1>My app</h1> `;
  }
}

customElements.define('home-page', MainPage);
