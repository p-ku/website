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
/*       max-height: calc(100vh - max(64px, 2.5rem));
 */      /*       animation: fade-in-animation 0.5s ease-out;
 */
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
    @keyframes fade-in-animation {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    h1,
    h2,
    p {
      display: flex;
      margin: 0;
      padding: 0;
      line-height: 150%;
      margin-top: 0.5em;
      justify-content: center;
      margin-left: 1em;
    }
    h1 {
      margin-top: 0.5em;
    }

    h2 {
      font-size: 1.3em;
      margin-bottom: 0.5em;
    }
    p {
      justify-content: flex-start;
    }

    #topcontainer,
    #bottomcontainer,
    #imgcontainer {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    #topcontainer {
      max-width: 960px;
      align-items: flex-start;
    }

    #bottomcontainer {
      flex-direction: row;
      justify-content: space-between;
      justify-self: flex-end;
      align-self: flex-end;
      min-height: min(50vmax, 75vmin);
      min-width: min(50vmax, 75vmin);
      max-width: calc(100vw - ((100vw - 960px) / 2));
      flex: 1;
    }
    #bottomtext {
      max-width: 960px;    }
      #bottomtext p {text-align: left;}
/*     #toptext {
      align-self: flex-start;
    } */
    #imgcontainer {
      position: relative;
      height: min(50vmax, 75vmin);
      width: min(50vmax, 75vmin);
      align-self: flex-end;
    
      margin-right: 1vmin;
      min-height: min(50vmax, 75vmin);
      min-width: min(50vmax, 75vmin);
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
      #imgcontainer {
        position: relative;
        height: min(50vmax, 75vmin);
        width: min(50vmax, 75vmin);
        align-self: center;
        margin-right: 0;
      }
      #bottomcontainer {
      flex-direction: column;
    }
  `;

  render() {
    return html`
      <div id="topcontainer">
        <h1>Eric Peek</h1>
        <h2>Pursuing a career in creation.</h2></div>
      <div id="bottomcontainer">
        <div id="bottomtext">
          <p>
            I am driven to create. Despite this, my career path involves little
            creativity. Now is the time to change course. Enable my
            transformation, and witness my full potential.
          </p>
          <p>
            Software is both ubiquitous and hungry for ingenuity. With that in
            mind, the solution has become painfully obvious; I must work in
            software.
          </p>
  </div>
          <div id="imgcontainer">
            <img
              src="headshot-4k.jpg"
              srcset="
                headshot-HD.jpg   720w,
                headshot-FHD.jpg 1080w,
                headshot-QHD.jpg 1440w,
                headshot-4k.jpg  2160w,
                headshot-4k.jpg
              "
              sizes="70vmin"
            />
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('home-page', MainPage);
