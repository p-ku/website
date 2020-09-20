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
      background-color: #fffde8;;
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

#outlet, #outlet :only-child {
  display: flex;
  flex-direction: column;
      flex-grow: 1;
      width: 100%;
      min-height: 100%;
align-self: stretch;
    }


    a::selection {color: #fffde8; background-color: #ef8127;}



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
      background-image: linear-gradient(45deg, var(--navbar), #683e00);
      box-shadow: 0px 0px 5px 1px rgba(0,0,0,0.5);
      min-width: 100%;
      position: sticky; top: 0;
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
        #navleft, #navright {
      flex: 0.4 1 auto;
    }

    #navcenter {
      flex: 1 1 auto;
      align-self: flex-end;
    }

    .home {
      font-size: 2em;
      color: #FFC342;
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
      font-size: 1.3em;
      max-width: 960px;
      width: 30vw;
    }   
    
     #demotitle {
      background-color: #dfabf4;
      color: #af4ebd;
      cursor: default;
      border-radius: 1rem 0 0 0;
      border-right: 0;
width: 4em;      
overflow-y: visible;
align-items: center;
    }
    #demotitle::after {
      content: ":";
    }

    #demobar a {
  justify-content:center;
      box-sizing: border-box;
      color: #dfabf4;
      width: 50%;
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
color: #fffde8;text-decoration: none;
position: absolute;
bottom: 0;
line-height: 2em;
pointer-events: none;
    }



    #mail, #source, #jpen {
      color: #FFC342;
      box-sizing: content-box;
      text-decoration: none;
      min-width: 48px;
      width: 100%;
      flex: 1 1 max(2.5em, 64px);
    }
    #source {
      color: #9df5ee;
    }
     #jpen {
      color: #eb737b;
    }

    #mail.chosen {
      border-bottom: dashed #FFC342 3px;
    }

#jpencircle {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  border: solid #eb737b 3px;
  border-radius: 50%;
  width: 2em;
  height: 2em;
font-size: calc(12px + 0.5vmin);
      background-color: red;
  background-color: #00000000;
}

    #jpencircle.jp {
      color: #fffde8;
      background-color: #ef3341;
       border-color: #fffde8;
    }

    #burger, .closed {
      display: none;
    }

    @media (hover:hover) {
    #jpen:hover #jpencircle {
      color: #fffde8;
    }    
    .linkspace:hover .linktext{
opacity: 1;
    }    
    #demobar a:hover {
      color: #fffde8;
    }    
    .home:hover {
      color: #ffdb49;
    }
    }

    @media screen and (min-width: 960px)  {

    }
    @media screen and (max-width: 840px)  {

#navleft {
  justify-content: flex-start;
}
#navcenter {

}
      #burger {
        color: #fffde8;
        font-size: 2em;
      }

    #demotitle.chosen {
border-bottom: dashed #dfabf4 3px;
    }


 .linktext{
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

       #demotitle::after {
         position: absolute;
bottom: 5%;
        content: '▾';
       }

      .open {
        display: inline-flex;
        box-sizing: border-box;
        background-color: #dfabf4;
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
        color: #af4ebd;
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
          <div id="navleft">
            <a id="burger">≡</a>
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
            <div
              id="demotitle"
              class=${
                this.currentPage.endsWith('bender') ||
                this.currentPage.endsWith('crypto')
                  ? 'chosen'
                  : ''
              }
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
            <div class="linkspace">
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
              ><span class='linktext'                 
              >${this.english ? 'github' : 'ギットハブ'}</span>
              </div>
              <div class="linkspace">
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
