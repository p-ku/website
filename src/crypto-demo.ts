import { LitElement, html, css, property } from 'lit-element';
import { WebSite } from './WebSite.js';

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
  /*  detectLanguage() {
    if (location.pathname.startsWith('/jp')) {
      return true;
    } else {
      return false;
    }
  } */
  static styles = css``;

  render() {
    return html` <h1>${this.english ? 'Crypto?' : 'クリプト?'}</h1> `;
  }
}

customElements.define('crypto-demo', CryptoDemo);
