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

    .app-footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
    }

    .app-footer a {
      margin-left: 5px;
      padding-left: calc(20px + 0.5vmin);
      padding-right: calc(20px + 0.5vmin);
    }

    /* Style the navbar */
    #navbar {
      list-style-type: none;
      overflow: hidden;
      background-color: #333;
      border-radius: 0px 0px 12px 12px;   
      width: 100%;
      height: calc(32px + 2vmin);
      box-shadow: 0px 0px 5px 1px #000000;
    }

    #navbar div {
      height: calc(32px + 2vmin);
    } 

    #lang:hover {
      background-color: #f2f2f2; /* Green */
    }

    #demo1, #demo2 {
      color: #f2f2f2;
      text-align: center;
      text-decoration: none;
      display: inline-flex;
      line-height: calc(32px + 2vmin);
      padding-left: calc(0.5vmin);
      padding-right: calc(0.5vmin);
    }

    #navbar div a:hover:not(.active) {background-color: #111;}
    #navbar div a.active:hover {background-color: darkslateblue;}

    #home {
      color: #f2f2f2;
      text-align: center;
      text-decoration: none;
      display: inline-flex;
      line-height: calc(32px + 2vmin);
      padding-left: calc(0.5vmin);
      padding-right: calc(0.5vmin);
    }

    #lang {
      text-align: center;
      text-decoration: none;
      border: none;
      width: calc(3 * calc(20px + 2vmin));
      line-height: calc(32px + 2vmin);
      top: 0;
      background-color: gray;
      transition-duration: 0.1s;
      font-size: calc(10px + 2vmin);
      cursor: pointer;
    }

    a.active {
      background-color: darkcyan;
    }

    #navleft {float: left;}

    #navright {float: right;}

    #navcenter {float: none;}

  @media screen and (max-width: 960px) {
    #navbar {border-radius: 0px;}
    }

    @media screen and (max-width: 600px) {
      #navright button {border-radius: 0px}

      #navcenter {
        position: relative;
        top: 0;
        left: 0;
        transform: none;
      }
    }

  `;

  render() {
    return html `

<div id="navbar">
  <div id="navleft">
    <a id="home" href="" @click=${() => this.switchRoute('main')}>ピ-クu</a>
  </div>
  <div id="navright">
    <button id="lang" @click=${() => (this.language = !this.language)}>${this.language ? "日本語" : "EN"}</button>
  </div>
  <div id="navcenter">
    <a id="demo1" class=${this.activeTab==="demo1" ? "active" : "inactive"} href="demo1" @click=${() => this.switchRoute('demo1') }>${this.language ? "Demo 1" : "デモ１"}</a>
    <a id="demo2" class=${(this.activeTab==="demo2") ? "active" : "inactive"} href="demo2" @click=${() => this.switchRoute('demo2') }>${this.language ? "Demo 2" : "デモ２"}</a>
  </div>
</div>

<main>
  <div id="outlet">
  </div>
</main>

<p class="app-footer">
  <a id='sourcecode'
    target="_blank"
    rel="noopener noreferrer"
    href="https://github.com/p-ku"
    >${this.language ? "Source Code" : "ソースコード"}</a>
    <a id='email'>contact@p-ku.com</a>
</p>
    `;
  }
}
customElements.define('home-page', HomePage);