import { LitElement, html, css, property } from 'lit-element';
import './home-page.js';
import './crypto-demo.js';
import { Router } from '@vaadin/router';

export class WebSite extends LitElement {
  @property({ type: String }) page = 'home';
  @property({ type: String }) title = '';
  @property({ type: String }) activeTab = '';
  @property({ type: Boolean }) smallScreen = false;
  @property({ type: Boolean }) language = true;
  @property({ type: String }) currentPage = 'home';

  constructor() {
    super();
    this.activeTab =
      location.pathname === '/' ? 'home' : location.pathname.replace('/', '');
  }

  firstUpdated() {
    const outlet = this.shadowRoot?.getElementById('outlet');
    const router = new Router(outlet);
    router.setRoutes([
      { path: '/', component: 'home-page' },
      { path: '/crypto', component: 'crypto-demo' },
      { path: '/civil', component: 'civil-demo' },
      {
        path: '(.*)',
        redirect: '/',
        action: () => {
          this.activeTab = 'home';
        },
      },
    ]);
  }

  switchRoute(route = 'home') {
    this.activeTab = route;
    Router.go(`/${route}`);
  }

  static styles = css`
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      max-width: 100vw;
      margin: 0 auto;
      text-align: center;
    }

    main {
      flex-grow: 1;
    }

    @keyframes shiny {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    a::selection,
    span::selection,
    div::selection {
      background: transparent;
    }

    #navbar {
      display: flex;
      background-image: linear-gradient(45deg, var(--navbar), #683e00);
      max-width: 100vw;
      width: 100vw;
      height: var(--navbar-height);
      box-shadow: 0px 0px 5px 1px var(--black);
      z-index: 2;
      overflow: hidden;
      justify-content: center;
      font-size: var(--navbar-height);
      align-items: center;
      align-content: center;
    }

    #navspace {
      padding: calc((var(--navbar-height) - (var(--navbar-height) / 1.5)) / 2);
      display: flex;
      max-width: 960px;
      width: 100%;
      height: var(--navbar-height);
      z-index: 3;
      overflow: hidden;
      justify-content: space-between;
      font-size: var(--navbar-height);
      align-items: center;
      align-content: center;
    }

    #demospace {
      display: flex;
      max-width: 960px;
      width: 100%;
      height: var(--demobar-height);
      overflow: hidden;
      font-size: var(--navbar-height);
      justify-content: flex-end;
    }

    #navright {
      display: flex;
      height: var(--navbar-height);
      z-index: 2;
      overflow: hidden;
      font-size: var(--navbar-height);
      align-items: center;
      align-content: center;
      max-width: 70%;
      width: max-content;
    }

    #navleft {
      display: flex;
      height: var(--navbar-height);
      z-index: 2;
      overflow: visible;
      justify-self: flex-start;
      justify-content: space-between;
      font-size: var(--navbar-height);
      align-items: center;
      align-content: center;
      max-width: 70%;
      width: max-content;
    }

    #demobar {
      display: flex;
      background-color: var(--demobar);
      height: var(--demobar-height);
      border-radius: calc(var(--demobar-height) / 2) 0
        calc(var(--demobar-height) + 70%) var(--demobar-height);
      z-index: 1;
      justify-content: space-around;
      align-items: center;
      padding-right: calc(var(--navbar-height) + 2vmin);
      position: relative;
      right: calc(var(--navbar-height) * 1.5);
      max-width: 30%;
      width: calc(var(--navbar-height) * 3);
    }

    #demotitle {
      font-size: calc(12px + 0.5vmin);
      align-self: flex-end;
      color: var(--demobar);
      cursor: default;
      padding-right: calc(
        var(--navbar-height) * 1.5 - calc(var(--navbar-height) / 1.5)
      );
      font-weight: 700;
    }
    #footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
    }

    #footer a {
      margin-left: 5px;
      padding-left: calc(20px + 0.5vmin);
      padding-right: calc(20px + 0.5vmin);
    }
    a.mid {
      color: var(--demo-text);
      text-decoration: none;
      font-weight: 600;
      font-size: calc(var(--navbar-height) / 3);
    }
    a.chosen {
      color: var(--demo-chosen);
    }

    #home {
      color: var(--home);
      text-decoration: none;
      font-weight: 600;
      font-size: 70%;
      padding-right: var(--navbar-height);
    }

    #home:hover {
      color: var(--home);
    }

    #sbears {
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-direction: column;
      position: relative;
      align-self: flex-end;
      width: max-content;
    }

    #sbear1 {
      display: flex;
      color: #33efe2cc;
      font-size: 50%;
      text-decoration: none;
      font-size: calc(var(--navbar-height) / 3);
      cursor: default;
      font-weight: 900;
      width: max-content;

      position: absolute;
      opacity: 1;
    }

    #sbear2 {
      display: flex;
      color: #33efe2cc;
      font-size: 50%;
      text-decoration: none;
      font-size: calc(var(--navbar-height) / 3);
      cursor: default;
      font-weight: 900;
      z-index: 10;
      width: max-content;
      opacity: 0;
      transition-duration: 0.9s;
    }

    #sbear2:hover {
      transition-duration: 0.9s;
      opacity: 1;
    }

    #demobar a:hover:not(.chosen) {
      color: #570f73;
    }

    .lang:hover {
      color: var(--white);
      transition-duration: 0.1s;
      background-color: var(--redp2);
    }
    .lang:active {
      background-color: var(--redp1);
    }

    .lang {
      display: flex;
      color: var(--redm3);
      border: solid;
      border-color: var(--redm3);
      cursor: pointer;
      border-radius: 50%;
      width: calc(var(--navbar-height) / 1.5);
      height: calc(var(--navbar-height) / 1.5);
      background-color: #00000000;
      font-size: calc(var(--navbar-height) / 3);
      font-weight: 700;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    .japanese {
      color: var(--white);
      background-color: var(--japan);
      border-color: var(--white);
    }
    .japanese:hover {
      background-color: var(--redm1);
      transition-duration: 0.1s;
      border-color: var(--white);
    }
    .japanese:active {
      background-color: var(--redm2);
      transition-duration: 0.1s;
      border-color: var(--white);
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
      <div id="navbar">
        <div id="navspace">
          <div id="navleft">
            <a
              id="home"
              href=""
              class=${this.currentPage === 'home' ? 'athome' : ''}
              @click=${() => (this.currentPage = 'home')}
              >ピ-クu</a
            >
            <div id="sbears">
              <span
                id="sbear1"
                class=${this.currentPage === 'home' ? 'athome' : ''}
                @click=${() => (this.currentPage = 'home')}
                >ʕ •ᴥ• ʔ
              </span>
              <span
                id="sbear2"
                class=${this.currentPage === 'home' ? 'athome' : ''}
                @click=${() => (this.currentPage = 'home')}
                >&#9673; &#9678;
              </span>
            </div>
          </div>
          <div id="navright">
            <span id="demotitle">${this.language ? 'demo' : 'デモ'}</span>
            <div
              class=${this.language ? 'english lang' : 'japanese lang'}
              @click=${() => {
                this.language = !this.language;
                return false;
              }}
            >
              JP
            </div>
          </div>
        </div>
      </div>
      <div id="demospace">
        <div id="demobar">
          <a
            id="crypto"
            class=${this.currentPage === 'crypto'
              ? 'chosen mid'
              : 'inchosen mid'}
            href="crypto"
            @click=${() => (this.currentPage = 'crypto')}
            >${this.language ? 'Crypto$' : 'クリプト¥'}</a
          >
          <a
            id="civil"
            class=${this.currentPage === 'civil'
              ? 'chosen mid'
              : 'inchosen mid'}
            href="civil"
            @click=${() => (this.currentPage = 'civil')}
            >${this.language ? 'Civil' : '土木'}</a
          >
        </div>
      </div>
      <main>
        <div id="outlet"></div>
      </main>
      <div id="footer">
        <div id="footleft">
          <a
            id="source"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/p-ku/website"
            >${this.language ? 'Source Code' : 'ソースコード'}</a
          >
        </div>
        <div id="footright">
          <a id="email">contact@p-ku.com</a>
        </div>
      </div>
    `;
  }
}
