import { LitElement, html, css, property } from 'lit-element';
import './home-page.js';
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

    .logo > svg {
      margin-top: 36px;
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

    #navbar {
      display: flex;
      max-width: 100vw;
      overflow: hidden;
      background-color: var(--navbar);
      width: 100%;
      height: calc(30px + 4vmin);
      box-shadow: 0px 0px 5px 1px var(--black);
      z-index: 1;
      justify-content: center;
      transition-duration: 0.1s;
    }

    #limit {
      display: flex;
      justify-content: space-between;
      align-items: stretch;
      align-content: center;
      align-self: center;
      width: 960px;
    }

    #navleft {
      display: flex;
      align-items: center;
      width: calc(150px + 2vmin);
      padding-left: calc(5px + 1vmin);
    }
    #navright {
      display: flex;
      align-items: center;
      width: calc(150px + 2vmin);
      justify-content: flex-end;
      padding-right: calc(5px + 1vmin);
    }
    #navcenter {
      display: flex;
      align-items: center;
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

    .langspace {
      display: flex;
      justify-content: center;
    }

    .lang:hover {
      color: var(--white);
      background-color: var(--lang-hover);
      box-shadow: 0 0 4px 2px var(--white);
    }
    .lang:active {
      text-shadow: 0 0 3px var(--white);
      box-shadow: 0 0 2px 1px var(--white);
      background-color: var(--lang-active);
    }

    .lang {
      color: var(--navbar);
      transition-duration: 0.1s;
      cursor: pointer;
      border-radius: 50%;
      line-height: calc(20px + 2vmin);
      width: calc(20px + 2vmin);
      background-color: var(--navbar);
      font-size: calc(5px + 2vmin);
      font-weight: 700;
      text-shadow: 1px 1px 2px var(--black);
    }
    .japanese {
      color: var(--white);
      background-color: var(--japan);
      box-shadow: 0 0 20px calc(30px + 2vmin) var(--white);
    }
    .japanese:hover {
      box-shadow: 0 0 20px calc(30px + 2vmin) var(--white);
      background-color: var(--japan-hover);
      text-shadow: 0 0 3px var(--white);
    }
    .japanese:active {
      box-shadow: 0 0 20px calc(35px + 2vmin) var(--white);
      background-color: var(--japan-active);
      text-shadow: 0 0 4px var(--white);
    }
    .lang::selection {
      background: transparent;
    }

    a.mid {
      color: var(--demo);
      text-decoration: none;
      transition-duration: 0.1s;
      padding: 1vmin;
      font-weight: 600;
      text-shadow: 1px 1px 2px var(--black);
    }
    a.active {
      text-shadow: 0 0 3px var(--demo-shadow);
      color: var(--demo-active);
    }

    #home:hover {
      font-size: calc(20px + 2vmin);
    }

    #home {
      color: var(--home);
      text-decoration: none;
      transition-duration: 0.05s;
      text-shadow: 2px 2px 1px var(--black);
      font-weight: 600;
    }

    #navbar a:hover:not(.active) {
      color: var(--white);
    }

    .navcircle {
      --b: 20vmin;
      --bcsq: calc(var(--b) / 4);
      --k: calc(10000vmin + var(--bcsq) - var(--b));
      --r: calc(var(--k) + var(--b));
      --d: calc(2 * var(--r));

      height: var(--d);
      width: var(--d);
      background: linear-gradient(to right, red, yellow);
      border-radius: 50%;
      box-shadow: 0px 0px 5px 1px var(--black);
      animation: app-logo-spin infinite 20s linear;
      position: absolute;
      top: calc(0vmin - var(--r) - var(--k));
      box-sizing: border-box;
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
        <div id="limit">
          <div id="navleft">
            <a
              id="home"
              href=""
              class=${this.currentPage === 'home' ? 'athome' : ''}
              @click=${() => (this.currentPage = 'home')}
              >ピ-クu</a
            >
          </div>
          <div id="navcenter">
            <a
              id="crypto"
              class=${this.currentPage === 'crypto'
                ? 'active mid'
                : 'inactive mid'}
              href="crypto"
              @click=${() => (this.currentPage = 'crypto')}
              >${this.language ? 'Crypto' : 'クリプト'}</a
            >
            <a
              id="civil"
              class=${this.currentPage === 'civil'
                ? 'active mid'
                : 'inactive mid'}
              href="civil"
              @click=${() => (this.currentPage = 'civil')}
              >${this.language ? 'Civil' : 'デモ２'}</a
            >
          </div>
          <div id="navright" class="centerlang">
            <span
              class=${this.language ? 'english lang' : 'japanese lang'}
              @click=${() => {
                this.language = !this.language;
                return false;
              }}
              >JP</span
            >
          </div>
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
