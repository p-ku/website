import { LitElement, html, css, property } from 'lit-element';

class MainPage extends LitElement {
  @property({ type: String }) lang = '';
  @property({ type: Boolean }) english = true;
  @property({ attribute: false }) enintro = html` <p>
      Six years into my first attempt at a career, I've realized three
      things:<br /><br />1. I'm not making things.<br />2. I want to make
      things.<br />3. Software engineers make things.
    </p>
    <p>hello</p>`;
  @property({ attribute: false }) jpintro = html` <p>
    Six years into my first attempt at a career, I've realized two things:<br />
    1. I'm not making things. 2.<br />
    I want to make things "
  </p>`;

  firstUpdated() {
    if (location.pathname.includes('jp')) {
      this.english = false;
      this.lang = '/jp';
    } else {
      this.english = true;
      this.lang = '';
    }
  }
  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 100%;
      margin: 0 auto;
      color: #321e00;
      align-content: center;
      align-items: center;
      max-height: calc(100vh - max(64px, 2.5rem));

      /*       background: url(headshot.jpg) no-repeat center bottom fixed;
      -webkit-background-size: 100vmin;
      -moz-background-size: 100vmin;
      -o-background-size: 100vmin;
      background-size: 100vmin; */
    }
    /* 
    #subhost {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 100%;
      max-width: 960px;
      min-height: calc(100vh - 2.5rem);
      color: #321e00;
      margin: 0 auto;
    } */

    h2 {
      width: 100%;
    }
    #topcontainer,
    #bottomcontainer {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    #topcontainer {
      flex: 1 1 auto;
    }

    #bottomcontainer {
      position: relative;
      height: 70vmin;
      width: 70vmin;
      align-self: flex-end;
      margin-right: 1vmin;
    }
    img {
      height: 100%;
      width: 100%;
    }
    /*     #in {
      position: absolute;
      top: 8px;
      left: 16px;
    } */
    #footer {
    }
    #test {
      flex: 1;
      width: 100%;
    }
    @keyframes app-logo-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    @media screen and (max-width: 869px) {
    }
  `;

  render() {
    return html`
      <div id="topcontainer"></div>
      <div id="bottomcontainer">
        <img
          src="headshot-4k.jpg"
          srcset="
            headshot-HD.jpg   720w,
            headshot-FHD.jpg 1080w,
            headshot-QHD.jpg 1440w,
            headshot-4k.jpg  2160w,
            headshot-4k.jpg
          "
          sizes="95vmin"
        />
      </div>
    `;
  }
}

customElements.define('home-page', MainPage);
