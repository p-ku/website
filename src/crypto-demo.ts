import { LitElement, html, css, property } from 'lit-element';
import { WebSite } from './WebSite.js';

class CryptoDemo extends LitElement {
  static styles = css``;

  render() {
    return html` <h1>${WebSite.language ? 'Crypto?' : 'クリプト'}</h1> `;
  }
}

customElements.define('crypto-demo', CryptoDemo);
