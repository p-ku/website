import { LitElement, html, css, property } from 'lit-element';
import './main-page.js'
import './contact-form.js';
import {Router} from '@vaadin/router';

class HomePage extends LitElement {

  @property({type: String}) page = 'main';
  @property({type: String}) title = '';
  @property({type: String}) activeTab = '';
  @property({type: String}) active = '0';
  @property({type: Array}) tabs = [''];
  @property({type: Boolean}) smallScreen = false;
  @property({type: Boolean}) language = true;
  @property({type: Object}) peek = {EN: "peek", JP: "ピーク"};
  @property({type: Object}) demo = {EN: "demo", JP: "デモ"};
  @property({type: Object}) privacypolicy = {EN: "privacy policy", JP: "個人情報保護方針"};
  @property({type: Object}) termsofservice = {EN: "terms of service", JP: "利用規約"};

  constructor(){
    super();
    this.activeTab = location.pathname === '/' ? 'main' : location.pathname.replace('/', '');
    this.tabs = ['main', 'contact', 'demo1', 'demo2'];
}

  firstUpdated() {
    const outlet = this.shadowRoot?.getElementById('outlet');
    const router = new Router(outlet);
    router.setRoutes([
      {path: '/',     component: 'main-page'},
      {path: '/demo1',  component: 'demo-one'},
      {path: '/demo2',  component: 'demo-two'},
      {path: '(.*)', redirect: '/', action: () => {
        this.activeTab = 'main';
        }
      }
    ]);
  }

  switchRoute(route = this.tabs[0]) {
    this.activeTab = route;
    Router.go(`/${route}`);
  }

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

/*     .app-footer {
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

    .lang:hover {
      background-color: blue;
      transition-duration: 0.1s;
    }
    .english:hover {
      background-color: #012169;
      color: #f2f2f2;
    }
    .japanese:hover {
      background-color: #EF3340;
      color: #f2f2f2;
    }

    .lang:active {
      background-color: blue;
      transform: 0px 0px;
      transition-duration: 0.1s;
    }
    .english:active {
      background-color: #012169;
      color: white;
    }
    
    .japanese:active {
      color: white;
      background-color: #EF3340;
    }


/*     #lang:focus {
      box-shadow: 0px 0px 5px 1px green;
    } */

    a.head {
      color: #f2f2f2;
      text-align: center;
      text-decoration: none;
      display: inline-flex;
      line-height: calc(32px + 2vmin);
      padding-left: calc(1vmin);
      padding-right: calc(1vmin);
      color: gray;
      transition-duration: 0.1s;
      font-size: calc(4px + 2vmin);
    }

    a.foot {
      color: #f2f2f2;
      text-decoration: none;
      transition-duration: 0.1s;
    }

    a.active {
      text-shadow: 0 0 3px cyan;
      color: #FFFFFF;
    }

    #navbar div a:hover:not(.active) {background-color: #111;}
    #navbar div a.active:hover {}

    #home {
      color: #f2f2f2;
      font-size: calc(10px + 2vmin);
    }
/* 
    .centerlang {

  position: absolute;
  margin-top:0%;
right:0;

} */

    .lang {
      text-align: center;
      color: #f2f2f2;
      text-decoration: none;
      border: none;
      width: calc(60px + 1vmin);
      line-height: calc(60px + 1vmin);
      background-color: dimgray;
      transition-duration: 0.1s;
      cursor: pointer;
      font-family: inherit;
      border-radius: 100%;
      font-size: calc(12px + 0.5vmin);
      position: absolute;
      top: 50%;
      transform: translateY(-50%);

    }

    #navleft {float: left;}
    #navright {float: right; padding-right: calc(16px + 0.5vmin);height:100%; position: relative; display: flex;
  align-items: center;
  justify-content: center;}
    #navcenter {float: none;}

    #footleft {float: left; width: 45%}
    #footright {float: right; width: 45%}
    #footcenter {float: none; width: 10%}

    #email {float: left}
    #source {float: right}

  @media screen and (max-width: 960px) {
    #navbar {border-radius: 0px;}
    }

    @media screen and (max-width: 600px) {

    }

  `;

  render() {
    return html `

<div id="navbar">
  <div id="navleft">
    <a id="home" class="head" href="" @click=${() => this.switchRoute('main')}>ピ-クu</a>
  </div>
  <div id="navright" class="centerlang">
    <button class=${this.language ? "japanese lang" : "english lang"} @click=${() => (this.language = !this.language)}>${this.language ? "JP" : "EN"}</button>
  </div>
  <div id="navcenter">
    <a class=${this.activeTab==="demo1" ? "active head" : "inactive head"} href="demo1" @click=${() => this.switchRoute('demo1') }>${this.language ? "Demo 1" : "デモ１"}</a>
    <a class=${(this.activeTab==="demo2") ? "active head" : "inactive head"} href="demo2" @click=${() => this.switchRoute('demo2') }>${this.language ? "Demo 2" : "デモ２"}</a>
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
      href="https://github.com/p-ku"
      >${this.language ? "Source Code" : "ソースコード"}</a>
  </div>
  <div id="footright">
    <a id="email">contact@p-ku.com</a>
  </div>
</div>

    `;
  }
}
customElements.define('home-page', HomePage);