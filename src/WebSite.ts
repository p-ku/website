import { LitElement, html, css, property } from 'lit-element';
import './home-page.js';
import './crypto-demo.js';
import './bender-demo.js';
import './contact-form.js';

import { Router } from '@vaadin/router';

export class WebSite extends LitElement {
  @property({ type: Boolean }) english = true;
  @property({ type: String }) currentPage = '/';
  @property({ type: String }) lang = '';
  @property({ type: String }) buttonDec = 'jp lang';
  @property({ type: Boolean }) isOpen = false;

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
      { path: '/contact', component: 'contact-form' },
      { path: '/jp/', component: 'home-page' },
      { path: '/jp/crypto', component: 'crypto-demo' },
      { path: '/jp/bender', component: 'bender-demo' },
      { path: '/jp/contact', component: 'contact-form' },

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
    #navleft,
    #navcenter {
      display: flex;
      height: var(--navbar-height);
      z-index: 2;
      overflow-y: visible;
      align-items: center;
      align-content: center;
      white-space: nowrap;
    }
    #navbar {
      background-image: linear-gradient(45deg, var(--navbar), #683e00);
      box-shadow: 0px 0px 5px 1px rgba(0,0,0,0.5);
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
    #navleft {
      font-size: var(--navbar-height);
      justify-content: space-between;
  
      width: 0%;
      min-width: max-content;
    }
    #navcenter {
      justify-content: center;
      flex-grow: 1;
    }
    #navright {
      justify-content: flex-end;
      width: 0%;
      min-width: max-content;
    }

    #home {
      color: var(--home);
      text-decoration: none;
      font-weight: 700;
      font-size: calc(var(--navbar-height) / 1.2);
    }

    #home:hover {
      color: #fbd743;
      transition-duration: 0.1s;
    }

    #demobar,
    #demotitle {
      display: flex;
      color: var(--demobar);
      height: calc(var(--demobar-height) + 3px);
      align-self: flex-end;
      justify-content: space-evenly;
      border: solid var(--demobar) 3px;
      border-bottom: 0;
      border-radius: 0 calc(var(--navbar-height) / 4) 0 0;
      flex-grow: 0.6;
      min-width: calc(var(--navbar-height) * 3);
      border-left: 0;
      overflow-y: visible;
    }
    #demobar a,
    #demotitle span{
      color: var(--demotitle);
      text-decoration: none;
      font-weight: 600;
      font-size: calc(var(--demobar-height) / 1.5);
      border-bottom: solid #00000000 2px;
      flex: 0.4;
      width: 4em;
      z-index: 3;
      align-self: flex-end;
    }
    #demobar a.chosen {
      color: var(--demo-chosen);
      border-bottom: solid var(--demobar) 2px;
      transition-duration: 0.1s;

    }
    #demobar a:hover:not(.chosen) {
      color: var(--white);
      transition-duration: 0.1s;
    }
    #demotitle {
      background-color: var(--demobar);
      color: var(--demo-text);
      cursor: default;
      height: calc(var(--demobar-height) + 3px);
      border-radius: calc(var(--navbar-height) / 4) 0 0 0;
      min-width: calc(var(--demobar-height) * 2.5);
      flex-grow: 0;
      border-right: 0;
      position: relative;
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
    }
    .jp:link,
    .jp:visited {
      color: var(--white);
      background-color: var(--japan);
      border-color: var(--white);
    }
    .jp:hover {
      background-color: var(--redm3);
      transition-duration: 0.1s;
      border-color: var(--white);
    }

    #mail {
      color: #9df5ee;
      font-size: calc(var(--navbar-height));
      margin-right: calc(2 *
              (var(--navbar-height) - (var(--navbar-height) / 1.5)) / 2 - 3px
            );
      font-weight: 900;
      text-decoration: none;
      text-align: center;
      align-self: center;
      align-content: center;
      vertical-align: center;
      height: calc(var(--navbar-height) - 4px);
      line-height: calc(var(--navbar-height));
      cursor: pointer;
      border-bottom: solid #00000000 2px;
      border-top: solid #00000000 2px;
    }
    #mail:hover {
      transition-duration: 0.1s;
      color: var(--white);
      }

    #mail.chosen {
      color: var(--demo-chosen);
      border-bottom: solid #9df5ee 2px;
      border-top: solid #00000000 2px;

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

.closed {
  display: none;
}

    @media screen and (max-width: 450px)  {
          #demotitle {
            display: flex;
            background-color: #00000000;
            color: var(--demobar);
            border-radius: calc(var(--navbar-height) / 4) calc(var(--navbar-height) / 4) 0 0;
            border-right: solid 3px;
            border-left: solid 3px;
            width: 20vw;  cursor: pointer;
      
          }
          .open {
            display: flex;
            background-color: var(--demobar);
            width: calc(20vw + 6px);
            box-shadow: 1px 3px 4px 0px rgba(0,0,0,0.5);
            z-index: 40;
            position: absolute;
            top: 100%;
            flex-wrap: wrap;
            border-radius: 0 0 calc(var(--navbar-height) / 4) calc(var(--navbar-height) / 4);
            height: 15vh;
          }

          .open a {
            color: var(--demo-text);
            text-decoration: none;
            font-weight: 600;
            font-size: calc(var(--demobar-height) / 1.5);
            width: 100%;
            flex-grow: 1;
            border: none;
            align-self: center;
            text-align: center;
          }

          .open a.chosen {
            color: var(--demo-chosen);
            border: none;
          }
          #demobar {
            display: none;
          }


    @media (hover: none) {

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
              @click=${() => {
                this.switchPage('/');
                if (this.isOpen) {
                  this.isOpen = !this.isOpen;
                }
              }}
              >ピ-クu</a
            >
          </div>
          <div id="navcenter">
            <div id="demotitle" @click=${() => (this.isOpen = !this.isOpen)}>
              <span>${this.english ? 'demo' : 'デモ'}</span>
              <div class=${this.isOpen ? 'open closed' : 'closed'}>
                <a
                  id="bender"
                  class=${this.currentPage.endsWith('bender') ? 'chosen' : ''}
                  href=${this.lang.concat('/bender')}
                  @click=${() => this.switchPage('/bender')}
                  >${this.english ? 'bender' : 'ベンダー'}</a
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
            <div id="demobar">
              <a
                id="bender"
                class=${this.currentPage.endsWith('bender') ? 'chosen' : ''}
                href=${this.lang.concat('/bender')}
                @click=${() => this.switchPage('/bender')}
                >${this.english ? 'bender' : 'ベンダー'}</a
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
            <a
              id="mail"
              class=${this.currentPage.endsWith('contact') ? 'chosen' : ''}
              href=${this.lang.concat('/contact')}
              @click=${() => this.switchPage('/contact')}
            >
              &#9993;</a
            >
            <a
              href=${this.currentPage}
              class=${this.buttonDec}
              @click=${() => {
                this.switchLanguage();
                if (this.isOpen) {
                  this.isOpen = !this.isOpen;
                }
              }}
              >JP</a
            >
          </div>
        </div>
      </div>
      <main
        @click=${() => {
          this.switchPage('/');
          if (this.isOpen) {
            this.isOpen = !this.isOpen;
          }
        }}
      >
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
