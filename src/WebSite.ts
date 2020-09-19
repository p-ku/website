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
      background-color: #fffde8;;


    }

    @keyframes fade-in-animation {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
#outlet, #outlet :only-child {
  display: flex;
  flex-direction: column;
      flex-grow: 1;
      width: 100%;
      min-height: 100%;
align-self: stretch;
    }
    a {color: #ef8127;}
    a::selection {color: #fffde8; background-color: #ef8127;}

    #navbar a::selection,
    #navbar span::selection,
    #navbar div::selection {
      background: transparent;
      outline: none;
    }
    #topper,
    #navbar,
    #navspace,
    #navright,
    #navleft,
    #navcenter {
      display: inline-flex;
      height: 2.5rem;
      align-items: center;
      align-content: center;
      white-space: nowrap;
      justify-content: center;
      z-index: 2;
      overflow-y: visible;
min-height: 64px;
    }
/* #topper {
  width: 100%;
  height: 2rem;
  color: #FFC342;
} */
    #navbar {
      background-image: linear-gradient(45deg, var(--navbar), #683e00);
      box-shadow: 0px 0px 5px 1px rgba(0,0,0,0.5);
      width: 100%;
      height: 2.5rem;
      position: sticky; top: 0;
      justify-content: space-between;
      flex-direction: column;
      flex-wrap: wrap;

    }
    #navspace {
      justify-content: space-between;
flex-direction: row;
width: 100%;
    }
    #navcenter {
      flex: 1 1 auto;
    }

    #navleft, #navright {
      font-size: 2rem;
      flex: 0.4 1 auto;
    }

    #home {
      display: inline-flex;
      box-sizing: border-box;
      color: #FFC342;
      text-decoration: none;
      text-align: left;
      align-content: center;
      align-self: center;
      align-items: center;
      min-width: 48px;
      font-weight: 700;
      height: 100%;
line-height: 100%;    


}
    #home:hover {
      color: #ffdb49;
    }

#demobar {
}
    #demobar,
    #demotitle {
      display: flex;
      color: var(--demobar);
      align-self: flex-end;
      justify-content: center;
      border: solid var(--demobar) 3px;
      border-bottom: none;
      border-radius: 0 1rem 0 0;
      border-left: 0;
      overflow-y: visible;
      height: 2rem;
      font-size: 1rem;
      font-weight: 600;
      max-width: 960px;
      width: 11rem;
    align-items: center;
    min-height: 48px;
    }
    #demotitle::after {
      content: ":";
    }
    #demobar a
{
  display: flex;
  justify-content:center;
  align-items: center;
      box-sizing: border-box;
      color: var(--demotitle);
      text-decoration: none;
      border-bottom: solid #00000000 3px;
      border-top: solid #00000000 3px;
      width: 50%;
      height: 100%;
    }
    #demobar a.chosen {
      color: var(--demo-chosen);
      border-bottom: dashed var(--demobar) 3px;
      border-top: solid #00000000 3px;

    }
    #demobar a:hover:not(.chosen) {
      color: #fffde8;
    }
    #demotitle {
      background-color: var(--demobar);
      color: var(--demo-text);
      cursor: default;
      border-radius: 1rem 0 0 0;
      border-right: 0;
width: 4rem;

    }
     #langspace {
      display: flex;
      height: 2.5rem;
      align-content: center;
      text-align: center;
      align-items: center;
      align-self: center;
      min-width: 2.5rem;
justify-content: center;
flex: 1 1 2.5rem;
    }

    .jpen:link,
    .jpen:visited {
      box-sizing: border-box;
      display: flex;
      color: #eb737b;
      border: solid #eb737b 3px;
      cursor: pointer;
      border-radius: 50%;
      height: 1.5rem;
      width: 1.5rem;
      background-color: #00000000;
      font-size: 1rem;
      font-weight: 700;
      align-items: center;
      text-decoration: none;
      justify-content: center;
      min-width: 48px;
      min-height: 48px;
    }
    .jpen:hover, .jp:hover {
      color: #fffde8;
    }
    .jp:link,
    .jp:visited {
      color: #fffde8;
      background-color: #ef3341;
      border-color: #fffde8;
    }

    #mail, #source {
      display: flex;
      color: #FFC342;
      box-sizing: border-box;
      font-size: 1.9rem;
      font-weight: 900;
      text-decoration: none;
      text-align: center;
      align-self: center;
      align-content: center;
      vertical-align: center;
      justify-content: center;
      align-items: center;
      height: 100%;
      cursor: pointer;
      border-bottom: solid #00000000 3px;
      border-top: solid #00000000 3px;
      min-width: 48px;
      flex: 1 1 2.5rem;
    }
    #source {
      color: #9df5ee;
      font-size: 1.2rem;
    }
    #mail:hover, #source:hover {
      color: #fffde8;
    }


    #mail.chosen {
      color: #fffde8;
      border-bottom: dashed #FFC342 3px;
    }
    #home.chosen {
      border-bottom: dashed #FFC342 3px;
    }
    #down {
    display:none;}

    .closed {
      display: none;
    }
    @media screen and (min-width: 960px)  {

    }
    @media screen and (max-width: 840px)  {

.jpen:hover {
      color: #eb737b;
    }
     .jp:hover {
color: #fffde8;
    }
    #home {
      display: inline-flex;
      font-size: 2rem;

    }

    #demotitle.chosen {
border-bottom: dashed var(--demobar) 3px;
      border-top: solid #00000000 3px;
    }


#mail:hover, #home:hover {
  color: #FFC342;
}
#source:hover {
      color: #9df5ee;
    }

      #demotitle {
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        background-color: #00000000;
        color: var(--demobar);
        border: none;
        cursor: pointer;
        align-self: center;
        align-items: center;
        height: 100%;
        min-width: fit-content;
        line-height: 100%;
        border-bottom: solid #00000000 3px;
        border-top: solid #00000000 3px;
        font-size: 1rem;
        width: 4rem;
      }

       #demotitle::after {
        content: '▾';
       }

      .open {
        display: inline-flex;
        box-sizing: border-box;
        background-color: var(--demobar);
        box-shadow: 0px 2px 2px 0px rgba(0,0,0,0.3);
        position: absolute;
        top: 100%;
        right: 0;
        height: 3rem;
        width: 100%;
        align-self: center;
        text-align: center;
        align-content: center;
        align-items: center;
        justify-content: center;
        min-height: 64px;
      }

      .open a {
        display: flex;
        color: var(--demo-text);
        text-decoration: none;
        font-weight: 600;
        width: 50%;
        border: none;
        align-self: center;
        text-align: center;
        align-content: center;
        align-items: center;
        justify-content: center;

        vertical-align: center;
        -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10+ and Edge */
  user-select: none; /* Standard syntax */
height: 100%;
      }


      .open a.chosen {
        color: var(--demo-chosen);
        border: none;
      }
      #demobar {
        display: none;
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
            <div
              id="demotitle"
              class=${this.currentPage.endsWith('bender') ||
              this.currentPage.endsWith('crypto')
                ? 'chosen'
                : ''}
              @click=${() => {
                this.isOpen = !this.isOpen;
              }}
            >
              ${this.english ? 'demo' : 'デモ'}
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
              id="source"
              href="https://github.com/p-ku"
              target="_blank"
              @click=${() => {
                if (this.isOpen) {
                  this.isOpen = !this.isOpen;
                }
              }}
              >&lt;/&gt;</a
            >

            <a
              id="mail"
              class=${this.currentPage.endsWith('contact') ? 'chosen' : ''}
              href=${this.lang.concat('/contact')}
              @click=${() => {
                this.switchPage('/contact');
                if (this.isOpen) {
                  this.isOpen = !this.isOpen;
                }
              }}
              >➤</a
            >
            <div id="langspace">
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
      </div>
      <div
        id="outlet"
        @click=${() => {
          if (this.isOpen) {
            this.isOpen = !this.isOpen;
          }
        }}
      ></div>
    `;
  }
}
