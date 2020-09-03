import { LitElement, html, css } from 'lit-element';
import { bigCircle } from './big-circle.js';

class HomePage extends LitElement {
  static styles = css`
    .logo > svg {
      margin-top: 0px;
      animation: app-logo-spin infinite 20s linear;
    }
    /*     .navcircle {
      --b: 20vmin;
      --bcsq: calc(var(--b) / 4);
      --k: calc(10000vmin + var(--bcsq) - var(--b));
      --r: calc(var(--k) + var(--b));
      --d: calc(2 * var(--r));

      height: var(--d);
      width: var(--d);
      animation: app-logo-spin infinite 20s linear;
      position: absolute;
      top: calc(0vmin - var(--r) - var(--k));
      box-sizing: border-box;
} */

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
    return html`
      <h1>My app</h1>
      <!-- <div class="logo">${bigCircle}</div> -->
    `;
  }
}

customElements.define('home-page', HomePage);
