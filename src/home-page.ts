import { LitElement, html, css, property } from 'lit-element';

class MainPage extends LitElement {
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
    }
    .logo > svg {
      margin-top: 72px;
      animation: app-logo-spin infinite 20s linear;
    }

    .test {
      font-size: 2em;
    }
    h1 {
      line-height: 1em;
      align-self: center;
      justify-content: center;
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
    return html`
      <h1>${this.english ? 'Nice to meet you.' : 'はじめまして'}</h1>
    `;
  }
}

customElements.define('home-page', MainPage);
