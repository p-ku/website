import { LitElement, html, css, property } from 'lit-element';

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

  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      max-width: 960px;
      max-height: 100%;
      color: #321e00;
      margin: 0 auto;
    }
    h2 {
      line-height: 1em;
      text-align: left;
      margin-left: 1rem;
    }
  `;

  render() {
    return html`
      <h2>${this.english ? 'crypto, coming soon' : 'クリプト、近刊'}</h2>
    `;
  }
}

customElements.define('crypto-demo', CryptoDemo);
