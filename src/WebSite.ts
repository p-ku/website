import { LitElement, html, css, property } from 'lit-element';
import './home-page.js';
import {Router} from '@vaadin/router';

export class WebSite extends LitElement {

  @property({type: String}) page = 'home';
  @property({type: String}) title = '';
  @property({type: String}) activeTab = '';
  @property({type: Boolean}) smallScreen = false;
  @property({type: Object}) tabClass = {'home': true, 'crypto': false, 'civil': false};
  @property({type: Boolean}) language = true;
  @property({type: Object}) peek = {EN: "peek", JP: "ピーク"};
  @property({type: Object}) demo = {EN: "demo", JP: "デモ"};
  @property({type: Object}) privacypolicy = {EN: "privacy policy", JP: "個人情報保護方針"};
  @property({type: Object}) termsofservice = {EN: "terms of service", JP: "利用規約"};
  @property({type: String}) currentPage = 'home';

  constructor(){
    super();
    this.activeTab = location.pathname === '/' ? 'home' : location.pathname.replace('/', '');
}

  firstUpdated() {
    const outlet = this.shadowRoot?.getElementById('outlet');
    const router = new Router(outlet);
    router.setRoutes([

      {path: '/',     component: 'home-page'},
      {path: '/crypto',  component: 'crypto-demo'},
      {path: '/civil',  component: 'civil-demo'},
      {path: '(.*)', redirect: '/', action: () => {
        this.activeTab = 'home';

        }
      }
    ]);
  }

  switchRoute(route = 'home') {


    this.activeTab = route;
    Router.go(`/${route}`);
  }


/* updated() {
  this.switchRoute('home')
} */


  static styles = css `
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      color: #1a2b42;
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
    }

    main {
      flex-grow: 1;
    }

    /* Style the navbar */
    #navbar {
      overflow: hidden;
      background-color: #505050;
      display: flex;
      justify-content: space-between;
      align-items: stretch;
      align-content: center;
     /*  border-radius: 0px 0px 80000px 12px;   */ 
     border-radius: 0 0 4vmin 4vmin;
      width: 100%;
      height: calc(32px + 4vmin);
      box-shadow: 0px 0px 5px 1px #121212;
      z-index: 1;
}

#navleft {display: flex;align-items: center;width: calc(150px + 2vmin);padding-left: 6px;}
#navright {display: flex;align-items: center;width: calc(150px + 2vmin);justify-content: flex-end;padding-right: 6px;}
#navcenter {display: flex;align-items: center;}

/*    .app-footer {

      font-size: calc(12px + 0.5vmin);
      align-items: center;
    }

    .app-footer a {
             margin-left: 5px;
      padding-left: calc(20px + 0.5vmin);
      padding-right: calc(20px + 0.5vmin);

    } */

    /* Style the navbar */
    #navbar {
      overflow: hidden;
      background-color: #333;
      border-radius: 0px 0px 12px 12px;   
      width: 100%;
      height: calc(32px + 2vmin);
      box-shadow: 0px 0px 5px 1px #000000;
    }

    #footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
      overflow: hidden;
      width: 100%;
      height: calc(32px + 2vmin);

    }   

.langspace {
      display: flex;
justify-content: center;
    }


    .lang:hover {
      transition-duration: 0.1s;
      color: #f2f2f2;
      background-color: #D02032;
      box-shadow: 0 0 3px 2px #f2f2f2;
    }
    .lang:active {
  text-shadow: 0 0 3px #f2f2f2;
  box-shadow: 0 0 2px 1px #f2f2f2;
  background-color: #EF3340;
}
/*     .lang {
      color: black;
      transition-duration: 0.1s;
      cursor: pointer;
      border-radius: 50%;
      line-height: calc(20px + 2vmin);
      width: calc(20px + 2vmin);
      background-color: #501114;
      font-size: calc(5px + 2vmin);
      box-shadow: 0 0 3px 1px black;
      font-weight: 700;
    } */
    .lang {
      color: #505050;
      transition-duration: 0.1s;
      cursor: pointer;
      border-radius: 50%;
      line-height: calc(20px + 2vmin);
      width: calc(20px + 2vmin);
      background-color: #505050;
      font-size: calc(5px + 2vmin);
      font-weight: 700;
      text-shadow: 1px 1px 2px black;
    }
    .japanese {
      color: #f2f2f2;
      background-color: #EF3340;
      box-shadow: 0 0 3px calc(30px + 2vmin) #f2f2f2;
    }
    .japanese:hover {
      box-shadow: 0 0 3px calc(30px + 2vmin) #f2f2f2;
      background-color: #EF3340;
      text-shadow: 0 0 3px #f2f2f2;
    }
    .japanese:active {
      box-shadow: 0 0 3px calc(25px + 2vmin) #f2f2f2;
      background-color: #EF3340;
      text-shadow: 0 0 4px #f2f2f2;
    }
    .lang::selection {
  background: transparent;
}

    a.mid {
      color: #e9e9e9;
       text-decoration: none;
      color: gray;
      transition-duration: 0.1s;
      padding: 1vmin;
      font-weight: 500;
    }
    a.active {
      text-shadow: 0 0 3px #33EFE2;
      color: #f2f2f2;
    }

#home:hover {
        font-size: calc(20px + 2vmin)
      }

      #home {
      color: #f2f2f2;
       text-decoration: none;
      transition-duration: 0.05s;
      text-shadow: 2px 2px 1px #121212;
      font-weight: 600;
      }

    #navbar a:hover:not(.active) {color: #f2f2f2;}
/*     #navbar div a.active:hover {}
 */


    .navcircle {
      --b: 20vmin;
      --bcsq: calc(var(--b) / 4);
      --k: calc(10000vmin + var(--bcsq) - var(--b));
      --r: calc(var(--k) + var(--b));
      --d: calc(2 * var(--r));

      height: var(--d);
      width: var(--d);
      background: linear-gradient(to right, red , yellow);
      border-radius: 50%;
      box-shadow: 0px 0px 5px 1px #000000;
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
/* 
    .centerlang {

  position: absolute;
  margin-top:0%;
right:0;

} */





  @media screen and (max-width: 960px) {
    #navbar {
    border-radius: 0 0 4vmin 4vmin;
    }
  }

    @media screen and (max-width: 600px) {

    }

  `;

  render() {
    return html `


<div id="navbar">
  <div id="navleft">
    <a id="home" href="" class=${this.currentPage==="home" ? "athome" : ""} @click=${() => this.currentPage='home' }>ピ-クu</a>
  </div>
    <div id="navcenter">
    <a id="crypto" class=${this.currentPage==="crypto" ? "active mid" : "inactive mid"} href="crypto" @click=${() => this.currentPage='crypto' }>${this.language ? "Crypto" : "クリプト"}</a>
    <a id="civil" class=${(this.currentPage==="civil") ? "active mid" : "inactive mid"} href="civil" @click=${() => this.currentPage='civil' }>${this.language ? "Civil" : "デモ２"}</a>
  </div>
  <div id="navright" class="centerlang">
    <span class=${this.language ? "english lang" : "japanese lang"} @click=${() => {(this.language = !this.language); return false;}}>JP</span>
  </div>
</div>

<main>
  <div id="outlet">
  </div>

</main>

<div id="footer">
  <div id="footleft">
    <a id="source"
      target="_blank"
      rel="noopener noreferrer"
      href="https://github.com/p-ku/homepage"

      >${this.language ? "Source Code" : "ソースコード"}</a>
  </div>
  <div id="footright">
    <a id="email">contact@p-ku.com</a>
  </div>
</div>

    `;
  }
}