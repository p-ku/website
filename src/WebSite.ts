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
  @property({ type: String }) buttonDec = 'en';
  @property({ type: Boolean }) isOpen = false;

  constructor() {
    super();
    this.currentPage = location.pathname.replace('https://p-ku.com', '');
    if (this.currentPage.includes('jp')) {
      this.english = false;
      this.lang = '/jp';
      this.buttonDec = 'jp';
    } else {
      this.english = true;
      this.lang = '';
      this.buttonDec = 'en';
    }
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
      margin: 0 auto;
      text-align: center;
      flex-grow: 1;
      animation: fade-in-animation 0.5s ease-out;
      background-color: #fffde8;
      font-size: calc(10px + 2vmin);
      font-weight: 700;
    }

    @keyframes fade-in-animation {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    #outlet,
    #outlet :only-child {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      width: 100%;
      min-height: 100%;
      align-self: stretch;
    }

    a::selection {
      color: #fffde8;
      background-color: #ef8127;
    }

    #navbar,
    #navright,
    #navleft,
    #navcenter {
      display: flex;
      align-items: center;
      align-content: center;
      justify-content: center;
      min-height: 64px;
      height: 2.5em;
    }

    #navbar {
      background-image: linear-gradient(-45deg, #321e00, #683e00);
      box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.5);
      min-width: 100%;
      position: sticky;
      top: 0;
      justify-content: space-between;
    }

    #navbar * a {
      display: flex;
      height: 100%;
      align-items: center;
      text-decoration: none;
      border-bottom: solid #00000000 3px;
      border-top: solid #00000000 3px;
      box-sizing: border-box;
      align-items: center;
      justify-content: center;
      -webkit-user-select: none; /* Safari */
      -ms-user-select: none; /* IE 10+ and Edge */
      user-select: none; /* Standard syntax */
    }

    #navbar .linkspace {
      height: 100%;
    }

    #navbar * a::selection,
    #navbar span::selection,
    #navbar div::selection {
      background: transparent;
      outline: none;
    }

    #navleft,
    #navright {
      flex: 0.4 1 auto;
    }

    #navcenter {
      flex: 1 1 auto;
      align-self: flex-end;
    }

    .home {
      font-size: 2em;
      color: #ffc342;
      text-decoration: none;
      min-height: 48px;
    }

    #demobar,
    #demotitle {
      display: flex;
      color: #dfabf4;
      align-self: flex-end;
      justify-content: center;
      border: solid #dfabf4 3px;
      border-bottom: none;
      border-radius: 0 1rem 0 0;
      border-left: 0;
      height: 66%;
      font-size: 1.2em;
      max-width: 960px;
      width: 33vw;
    }

    #demotitle {
      background-color: #dfabf4;
      color: #af4ebd;
      cursor: default;
      border-radius: 1rem 0 0 0;
      border-right: 0;
      width: 4em;
      align-items: center;
    }

    #demotitle::after {
      content: ':';
    }

    #demobar a {
      justify-content: center;
      box-sizing: border-box;
      color: #dfabf4;
      width: 50%;
      min-width: max-content;
    }

    #demobar a.chosen {
      color: #fffde8;
      border-bottom: dashed #dfabf4 3px;
    }

    .linkspace {
      display: flex;
      min-width: 2.5em;
      justify-content: center;
      flex: 1 1 2.5em;
    }

    .linktext {
      display: flex;
      opacity: 0;
      font-size: calc(12px + 0.5vmin);
      color: #fffde8;
      text-decoration: none;
      position: absolute;
      bottom: 0;
      line-height: 2em;
      pointer-events: none;
    }

    .mail,
    .source,
    #jpen {
      color: #ffc342;
      box-sizing: content-box;
      text-decoration: none;
      min-width: 48px;
      width: 100%;
      flex: 1 1 max(2.5em, 64px);
    }
    .source {
      color: #9df5ee;
    }

    #jpen {
      color: #eb737b;
    }

    .mail.chosen {
      border-bottom: dashed #ffc342 3px;
    }

    #jpencircle,
    #mailcircle,
    #sourcecircle {
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      border: solid 3px;
      border-radius: 50%;
      width: 2em;
      height: 2em;
      font-size: calc(12px + 0.5vmin);
      background-color: red;
      background-color: #00000000;
      min-height: 32px;
      min-width: 32px;
    }

    #jpencircle.jp {
      color: #fffde8;
      background-color: #ef3341;
      border-color: #fffde8;
    }

    #burger,
    .closed {
      display: none;
    }

    @media (hover: hover) {
      #jpen:hover #jpencircle {
        color: #fffde8;
      }

      .linkspace:hover .linktext {
        opacity: 1;
      }

      #demobar a:hover {
        color: #fffde8;
      }

      .home:hover {
        color: #ffdb49;
      }
    }

    @media screen and (max-width: 768px) {
      #navleft,
      #navright {
        flex: none;
      }
      #navcenter,
      .linkspace,
      .linktext {
        display: none;
      }
      /*       #navbar {
        background-image: linear-gradient(90deg, #321e00, #683e00);
      } */

      #burger {
        color: #fffde8;
        font-size: 32px;
        width: 64px;
        display: flex;
        height: 100%;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }

      #jpencircle,
      #mailcircle,
      #sourcecircle {
        height: 32px;
        width: 32px;
      }

      .linkspace:last-child {
        display: block;
        width: 64px;
        min-width: 64px;
        flex: none;
        justify-self: center;
        align-content: center;
        align-self: center;
        text-align: center;
      }

      .linktext {
        opacity: 1;
      }

      #demotitle {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        background-color: #00000000;
        color: #dfabf4;
        border: none;
        cursor: pointer;
        align-self: center;
        align-items: center;
        height: 100%;
        min-width: fit-content;
        line-height: 100%;
        border-bottom: solid #00000000 3px;
        border-top: solid #00000000 3px;
        width: 4rem;
      }

      .open {
        background-image: linear-gradient(315deg, #321e00, #683e00);

        display: flex;
        flex-direction: row;
        box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.3);
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        height: 6em;
        align-self: center;
        text-align: center;
        align-content: center;
        align-items: center;
        justify-content: center;
        min-height: 128px;
      }
      #burgerdemo,
      #burgerlink {
        display: flex;
        flex-direction: column;
        height: 100%;
        flex: 1 1 50vw;
      }

      #burgerlink {
      }
      #burgerdemo {
        flex: 1 1 50vw;
        flex-grow: 1;
        /*         box-sizing: border-box;
        border-right: dashed #fffde8 3px; */
        border-radius: 0 32px 0 0;
        background-image: radial-gradient(
          farthest-corner at top left,
          #fffde8,
          #dfabf4
        );
      }

      #burgerdemo a {
        color: #321e00;
        border: none;
        min-height: 64px;
      }

      #burgerlink > div {
        display: flex;
      }

      .burgertext {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-grow: 1;
        color: #fffde8;
      }

      #burgerlink a {
        width: 3em;
        min-width: 64px;
        border: none;
        min-height: 64px;
        height: 60%;
      }
      #burgerlink > div a.chosen {
        color: #fffde8;
      }
      .chosen #mailcircle {
        background-color: #ffc342;
      }
      #burgerlink a.burgermail {
        /*         background-image: radial-gradient(farthest-side at top right, #FFC342, #fffde8);
 */
        color: #ffc342;
      }

      #burgerlink a.burgersource {
        /*         background-image: radial-gradient(farthest-side at bottom right, #9df5ee, #fffde8);
 */
        color: #9df5ee;
      }

      #burgerdemo a.chosen::before {
        content: '→';
        left: 0%;
        position: absolute;
        font-weight: 900;
        font-size: 2em;
      }

      #burgerdemo a.chosen::after {
        content: '←';
        right: 50vw;
        position: absolute;
        font-weight: 900;
        font-size: 2em;
      }

      #demobar {
        display: none;
      }
    }
  `;

  render() {
    return html`
      <div id="navbar" >
        <div id="burger" @click=${() => {
          this.isOpen = !this.isOpen;
        }}>≡</div>
                      <div class=${
                        this.isOpen ? 'open closed' : 'closed'
                      }                 @click=${() => {
      if (this.isOpen) {
        this.isOpen = !this.isOpen;
      }
    }}>
<div id="burgerdemo">
                <a
                  class=${this.currentPage.endsWith('bender') ? 'chosen' : ''}
                  href=${this.lang.concat('/bender')}
                  @click=${() => this.switchPage('/bender')}
                  >${this.english ? 'bender' : 'ベンダー'}</a
                >
                <a
                  class=${this.currentPage.endsWith('crypto') ? 'chosen' : ''}
                  href=${this.lang.concat('/crypto')}
                  @click=${() => this.switchPage('/crypto')}
                  >${this.english ? 'crypto' : 'クリプト'}</a
                >
              </div>                      
            <div id="burgerlink">
              <div>
            <a class='burgertext' href=${this.lang.concat('/contact')}
                @click=${() => this.switchPage('/contact')}                
  >${this.english ? 'contact' : 'コンタクト'}</a>
              <a
                class=${
                  this.currentPage.endsWith('contact')
                    ? 'burgermail chosen'
                    : 'burgermail'
                }
                href=${this.lang.concat('/contact')}
                @click=${() => this.switchPage('/contact')}

                > <div id="mailcircle">➤</div></a
              ></div><div>
              <a class='burgertext' href="https://github.com/p-ku" target="_blank"               
              >${this.english ? 'github' : 'ギットハブ'}</a>
                <a
                class="burgersource"
                href="https://github.com/p-ku"
                target="_blank" >              <div id="sourcecircle">&lt;/&gt;</div></a
              >
              </div>

             </div>
          </div>
        <div id="navleft">

            <a
              class="home"
              href=${this.lang.concat('/')}
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
            <div id="demotitle">
              ${this.english ? 'demo' : 'デモ'}
            </div>
            <div id="demobar">
              <a
                class=${this.currentPage.endsWith('bender') ? 'chosen' : ''}
                href=${this.lang.concat('/bender')}
                @click=${() => this.switchPage('/bender')}
                >${this.english ? 'bender' : 'ベンダー'}</a
              >
              <a
                class=${this.currentPage.endsWith('crypto') ? 'chosen' : ''}
                href=${this.lang.concat('/crypto')}
                @click=${() => this.switchPage('/crypto')}
                >${this.english ? 'crypto' : 'クリプト'}</a
              >
            </div>
          </div>
          <div id="navright">
            <div class="linkspace">
              <a
                class="source"
                href="https://github.com/p-ku"
                target="_blank"
                @click=${() => {
                  if (this.isOpen) {
                    this.isOpen = !this.isOpen;
                  }
                }}
                >&lt;/&gt;</a
              ><span class='linktext'                 
              >${this.english ? 'github' : 'ギットハブ'}</span>
              </div>
              <div class="linkspace">
              <a
                class=${
                  this.currentPage.endsWith('contact') ? 'mail chosen' : 'mail'
                }
                href=${this.lang.concat('/contact')}
                @click=${() => {
                  this.switchPage('/contact');
                  if (this.isOpen) {
                    this.isOpen = !this.isOpen;
                  }
                }}
                >➤</a
              >
              <span class='linktext'                 
              >${this.english ? 'contact' : 'コンタクト'}</span></div>
              <div class="linkspace">
                <a
                id="jpen"
                  href=${this.currentPage}
                  @click=${() => {
                    this.switchLanguage();
                    if (this.isOpen) {
                      this.isOpen = !this.isOpen;
                    }
                  }}
                  ><div id="jpencircle" class=${this.buttonDec}>JP</div></a
                >
              </div>
            </div>
          </div>

        <div
          id="outlet"
          @click=${() => {
            if (this.isOpen) {
              this.isOpen = !this.isOpen;
            }
          }}
        ></div>
      </div>
    `;
  }
}
