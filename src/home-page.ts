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
      width: 100vw;
      height: 100%;
      margin: 0 auto;
      color: #321e00;
      align-content: center;
      align-items: center;
      /*       background: url(headshot.jpg) no-repeat center bottom fixed;
      -webkit-background-size: 100vmin;
      -moz-background-size: 100vmin;
      -o-background-size: 100vmin;
      background-size: 100vmin; */
    }

    #subhost {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      max-width: 960px;
      max-height: 100%;
      color: #321e00;
      margin: 0 auto;
    }

    .logo > svg {
      margin-top: 72px;
      animation: app-logo-spin infinite 20s linear;
    }

    .test {
      font-size: 2em;
    }
    h2 {
    }
    #topcontainer,
    #bottomcontainer {
      display: flex;
      width: 100%;
      height: calc(100vmin - 2.5rem);
    }

    #topcontainer {
    }

    #bottomcontainer {
      position: relative;
      width: calc(100vmin - 2.5rem);
    }
    img {
      height: 100%;
      width: 100%;
    }
    /*     #in {
      position: absolute;
      top: 8px;
      left: 16px;
    } */
    #footer {
    }
    #test {
      flex: 1;
      width: 100%;
    }
    @keyframes app-logo-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    @media screen and (max-width: 720px) {
    }
  `;

  render() {
    return html`
      <div id="subhost">
        <div id="topcontainer">
          <h2 id="in">
            ${this.english ? 'Nice to meet you.' : 'はじめまして'}
          </h2>
        </div>
      </div>
      <div id="bottomcontainer"><img src="headshot.jpg" /></div>
    `;
  }
}

customElements.define('home-page', MainPage);
