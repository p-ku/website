import { LitElement, html, css, property } from 'lit-element';
import './home-page.js';
import './crypto-demo.js';
import './bender-demo.js';
import { Router } from '@vaadin/router';

export class WebSite extends LitElement {
  @property({ type: Boolean }) english = true;
  @property({ type: String }) currentPage = '/';
  @property({ type: String }) lang = '';
  @property({ type: String }) buttonDec = 'jp lang';

  constructor() {
    super();
    this.currentPage = location.pathname.replace('https://p-ku.com', '');
    if (this.currentPage.includes('jp')) {
      this.english = false;
      this.lang = '/jp';
      this.buttonDec = 'jp jpen';
    } else {
      this.english = true;
      this.lang = '';
      this.buttonDec = 'jpen';
    }
    this.switchRoute(this.currentPage);
  }

  firstUpdated() {
    const outlet = this.shadowRoot?.getElementById('outlet');
    const router = new Router(outlet);
    router.setRoutes([
      { path: '/', component: 'home-page' },
      { path: '/crypto', component: 'crypto-demo' },
      { path: '/bender', component: 'bender-demo' },
      { path: '/jp/', component: 'home-page' },
      { path: '/jp/crypto', component: 'crypto-demo' },
      { path: '/jp/bender', component: 'bender-demo' },
      {
        path: '(.*)',
        redirect: '/',
      },
    ]);
  }

  switchRoute(route = '/') {
    Router.go(`${route}`);
  }
  switchPage(destination = '/') {
    this.currentPage = this.lang.concat(destination);
  }
  switchLanguage() {
    this.english = !this.english;
    if (this.currentPage.includes('jp')) {
      this.currentPage = this.currentPage.replace('/jp/', '/');
      this.lang = '';
      this.buttonDec = 'jpen';
    } else {
      this.currentPage = '/jp' + this.currentPage;
      this.lang = '/jp';
      this.buttonDec = 'jp jpen';
    }
    return;
  }

  static styles = css`
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
    }
    main {
      flex-grow: 1;
    }
    a::selection,
    span::selection,
    div::selection {
      background: transparent;
      outline: none;
    }

    #navbar,
    #navspace,
    #navright,
    #navleft {
      display: flex;
      height: var(--navbar-height);
      z-index: 2;
      overflow: hidden;
      align-items: center;
      align-content: center;
      white-space: nowrap;
    }
    #navbar {
      background-image: linear-gradient(45deg, var(--navbar), #683e00);
      box-shadow: 0px 0px 5px 1px var(--black);
      justify-content: center;
      width: 100vw;
    }
    #navspace {
      padding: calc(
        (var(--navbar-height) - (var(--navbar-height) / 1.5)) / 2 - 3px
      );
      width: 100vw;
      max-width: 960px;
      justify-content: space-between;
    }
    #navright {
      justify-content: flex-end;
      /*       min-width: calc(2.2 * var(--navbar-height));
 */
      width: 40vw;
    }
    #navleft {
      font-size: var(--navbar-height);
      justify-content: flex-start;
      width: 100vw;
      overflow: visible;
    }

    #home {
      color: var(--home);
      text-decoration: none;
      font-weight: 600;
      font-size: 70%;
      margin-right: 10%;
      align-self: flex-start;
    }
    #home:hover {
      color: var(--home);
    }
    #demotitle {
      background-color: var(--demobar);
      align-self: flex-end;
      color: var(--demo-text);
      cursor: default;
      font-weight: 700;
      font-size: calc(var(--demobar-height) / 1.5);
      height: calc(var(--demobar-height) - 3px);
      border-radius: calc(var(--navbar-height) / 8) 0 0 0;
      border: solid var(--demobar) 3px;
      border-top: solid var(--demobar) 6px;
      align-self: flex-end;
      text-align: bottom;
    }
    #demobar {
      display: flex;
      color: var(--demobar);
      height: calc(var(--demobar-height) + 3px);
      align-self: flex-end;
      justify-content: space-around;
      border: solid var(--demobar);
      border-bottom: 0;
      border-radius: 0 calc(var(--navbar-height) / 8) 0 0;
      flex-grow: 0.6;
    }
    #demobar a {
      color: var(--demobar);
      text-decoration: none;
      font-weight: 600;
      font-size: calc(var(--demobar-height) / 1.5);
      align-self: flex-end;
      border-bottom: solid #00000000 3px;
      height: calc(var(--demobar-height) - 3px);
    }

    #demobar a.chosen {
      color: var(--demo-chosen);
      border-bottom: solid var(--demobar) 3px;
      transition-duration: 0.1s;
    }
    #demobar a:hover:not(.chosen) {
      color: var(--white);
      transition-duration: 0.1s;
    }
    #sbears {
      display: flex;
      justify-content: center;
      align-items: center;
      align-self: flex-end;
      /*       border-bottom: dashed #fffde8; */
      margin-right: 15%;
    }
    #sbear1,
    #sbear2 {
      display: flex;
      color: #fffde8;
      text-decoration: none;
      font-size: calc(var(--navbar-height) / 3);
      cursor: default;
      font-weight: 900;
    }

    #sbear2 {
      opacity: 0;
      position: relative;
      right: 0;
    }
    #sbear2:hover {
      transition-duration: 0.3s;
      opacity: 1;
    }
    .jpen:active {
      background-color: var(--redp1);
    }

    .jpen:link,
    .jpen:visited {
      color: var(--redm3);
      border: solid var(--redm3);
      cursor: pointer;
      border-radius: 50%;
      width: calc(var(--navbar-height) / 1.5);
      height: calc(var(--navbar-height) / 1.5);
      background-color: #00000000;
      font-size: calc(var(--navbar-height) / 3);
      font-weight: 700;
      text-decoration: none;
      line-height: calc(var(--navbar-height) / 1.5);
      min-width: calc(var(--navbar-height) / 1.5);
    }
    .jpen:hover {
      color: var(--white);
      transition-duration: 0.1s;
      background-color: var(--redp2);
    }
    .jp:link,
    .jp:visited {
      color: var(--white);
      background-color: var(--japan);
      border-color: var(--white);
    }
    .jp:hover {
      background-color: var(--redm1);
      transition-duration: 0.1s;
      border-color: var(--white);
    }
    .jp:active {
      background-color: var(--redm2);
      transition-duration: 0.1s;
      border-color: var(--white);
    }
    #footer {
      display: flex;
      font-size: var(--footer-font-size);
      width: 100%;
      max-width: 480px;
      min-height: calc(2 * var(--footer-font-size));
    }
    .footercolumn {
      width: 50%;
      align-self: flex-start;
    }
    @media (hover: none) {
      .jpen:hover {
        color: var(--white);
        transition-duration: 0.1s;
        background-color: var(--redp2);
      }
      .jpen:link,
      .jpen:visited {
        color: var(--redm3);
        border: solid var(--redm3);
        cursor: pointer;
        border-radius: 50%;
        width: calc(var(--navbar-height) / 1.5);
        height: calc(var(--navbar-height) / 1.5);
        background-color: #00000000;
        font-size: calc(var(--navbar-height) / 3);
        font-weight: 700;
        text-decoration: none;
        line-height: calc(var(--navbar-height) / 1.5);
      }
      .jp:link,
      .jp:visited {
        color: var(--white);
        background-color: var(--japan);
        border-color: var(--white);
      }
      #footer {
        display: flex;
        font-size: var(--footer-font-size);
        width: 100%;
        max-width: 480px;
        min-height: calc(2 * var(--footer-font-size));
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
              href=${this.lang.concat('/')}
              class=${this.currentPage === '/' ? 'athome' : ''}
              @click=${() => this.switchPage('/')}
              >ピ-クu</a
            >
            <span id="demotitle">${this.english ? 'demos' : 'デモ'}</span>
            <div id="demobar">
              <a
                id="bender"
                class=${this.currentPage.endsWith('bender') ? 'chosen' : ''}
                href=${this.lang.concat('/bender')}
                @click=${() => this.switchPage('/bender')}
                >${this.english ? 'bender' : '土木'}</a
              >
              <a
                id="crypto"
                class=${this.currentPage.endsWith('crypto') ? 'chosen' : ''}
                href=${this.lang.concat('/crypto')}
                @click=${() => this.switchPage('/crypto')}
                >${this.english ? 'crypto' : 'クリプト'}</a
              >
            </div>
          </div>
          <div id="navright">
            <div id="sbears">
              <span
                id="sbear1"
                class=${this.currentPage === '/' ? 'athome' : ''}
                >ʕ •ᴥ• ʔ</span
              >
              <!--               <span
                id="sbear2"
                class=${this.currentPage === '/' ? 'athome' : ''}
                >&#9673; &#x25CF;
              </span> -->
            </div>
            <a
              href=${this.currentPage}
              class=${this.buttonDec}
              @click=${() => {
                this.switchLanguage();
              }}
              >JP</a
            >
          </div>
        </div>
      </div>
      <main>
        <div id="outlet"></div>
      </main>
      <div id="footer">
        <a
          class="footercolumn"
          id="source"
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/p-ku/website"
          >${this.english
            ? 'Website Source Code'
            : 'ウェブサイトのソースコード'}</a
        >
        <a class="footercolumn" id="email">contact@p-ku.com</a>
      </div>
    `;
  }
}
