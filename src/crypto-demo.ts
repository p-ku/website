import { LitElement, html, css, property } from 'lit-element';
import { WebSite } from './WebSite.js';

class CryptoDemo extends LitElement {
  @property({ type: Boolean }) language = true;

  /*  detectLanguage() {
    if (location.pathname.startsWith('/jp')) {
      return true;
    } else {
      return false;
    }
  } */
  static styles = css``;

  render() {
    return html` <h1>${this.language ? 'クリプト?' : 'Crypto?'}</h1> `;
  }
}

customElements.define('crypto-demo', CryptoDemo);
