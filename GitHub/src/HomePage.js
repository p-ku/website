import { LitElement, html, css, property } from 'lit-element';
import { openWcLogo } from './open-wc-logo.js';
import {Router} from '@vaadin/router';

export class HomePage extends LitElement {

  @property({
    type: String
  }) page = 'main';

  @property({
    type: String
  }) title = '';

  @property({type: String}) activeTab = '';
  @property({type: Array}) tabs = ['basic', 'intermediate', 'advanced'];

  constructor(){
    super();
    this.activeTab = location.pathname === '/' ? 'basic' : location.pathname.replace('/', '');
    this.tabs = ['basic', 'intermediate', 'advanced'];
  }

  firstUpdated() {
    const router = new Router(this.shadowRoot.getElementById('outlet'));
    router.setRoutes([
      {path: '/',     component: 'basic-demos'},
      {path: '/basic',  component: 'basic-demos'},
      {path: '/intermediate',  component: 'intermediate-demos'},
      {path: '/advanced',  component: 'advanced-demos'},
      {path: '(.*)', redirect: '/', action: () => {
        this.activeTab = 'basic';
        }
      }
    ]);
  }

  switchRoute(route) {
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

    .app-footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
    }

    .app-footer a {
      margin-left: 5px;
    }

    /* Style the navbar */
    #navbar {
      overflow: hidden;
      background-color: #333;
      position: fixed;
    top: 0;
    width: 100%;
    border: 1px solid;
    padding: 10px;
    box-shadow: 5px 1px 8px #000000;
    }

    #navbar .links {
      float: right;
      display: block;
      color: #f2f2f2;
      text-align: center;
      padding: 14px;
      text-decoration: none;
    }

    #home {
      float: left;
      display: block;
      color: #f2f2f2;
      text-align: center;
      padding: 14px;
      text-decoration: none;
    }

    #navbar a:hover {
      background-color: #ddd;
      color: black;
    }

    #navbar a.active {
      background-color: #4CAF50;
      color: white;
    }



  `;

  render() {
    return html `
<div id="navbar">
        <a id="home" href="#home">ピーク</a>
        <a class="links" href="#news">GitHub</a>
        <a class="links" href="contact">Contact</a>

      </div>
      <main>

        <div class="logo">${openWcLogo}</div>
        <h1>My app</h1>

        <p>Edit <code>src/HomePage.js</code> and save to reload.</p>
        <a
          class="app-link"
          href="https://open-wc.org/developing/#code-examples"
          target="_blank"
          rel="noopener noreferrer"
        >
          Code examples
        </a>
      </main>

      <p class="app-footer">
        🚽 Made with love by
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/open-wc"
          >open-wc</a
        >.
      </p>
    `;
  }
}
